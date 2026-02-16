import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowDownToLine, CreditCard, Landmark, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileQuery } from "@/lib/api/profile";
import { useWalletBalanceQuery } from "@/lib/api/wallet";
import { useCreateTransactionMutation, useUpdateTransactionStatusMutation } from "@/lib/api/transactions";
import { useHederaOverviewQuery, useHederaTokenBalancesQuery } from "@/lib/api/hedera";
import { getAccountTokenBalances } from "@/lib/hedera/mirror";
import { HEDERA_NETWORK, HEDERA_USDC_TOKEN_ID } from "@/lib/hedera/config";
import { createCoinbaseOnrampSession, launchCoinbaseOnramp } from "@/lib/onramp/coinbase";

type DepositProvider = "coinbase" | "yellow_card" | "paychant";

const providerLabels: Record<DepositProvider, string> = {
  coinbase: "Coinbase CDP Onramp",
  yellow_card: "Yellow Card Hosted Checkout",
  paychant: "Paychant Hosted Checkout",
};

const fiatByCountryCode: Record<string, string> = {
  KE: "KES",
  UG: "UGX",
  TZ: "TZS",
  RW: "RWF",
  CA: "CAD",
  GB: "GBP",
  EU: "EUR",
  US: "USD",
};

const supportedFiat = ["USD", "CAD", "KES", "UGX", "TZS", "EUR", "GBP"] as const;
const monitorTimeoutMs = 120_000;
const monitorIntervalMs = 5_000;

function parseUnits(value?: string | null) {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function resolveFiatFromCountry(countryCode?: string | null) {
  if (!countryCode) {
    return "USD";
  }
  return fiatByCountryCode[countryCode.toUpperCase()] ?? "USD";
}

function buildHostedProviderUrl(baseUrl: string, params: Record<string, string>) {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

const Deposit = () => {
  const profileQuery = useProfileQuery();
  const walletQuery = useWalletBalanceQuery();
  const createTransactionMutation = useCreateTransactionMutation();
  const updateTransactionMutation = useUpdateTransactionStatusMutation();
  const profile = profileQuery.data;
  const linkedAccountFromProfile = profile?.hedera_account_id?.trim() || null;
  const linkedAccountFromWallet = walletQuery.data?.hedera_account_id?.trim() || null;
  const accountId = linkedAccountFromProfile || linkedAccountFromWallet;

  const hederaOverviewQuery = useHederaOverviewQuery(accountId);
  const hederaTokensQuery = useHederaTokenBalancesQuery(accountId);

  const [amount, setAmount] = useState("50");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [provider, setProvider] = useState<DepositProvider>("coinbase");
  const [providerReference, setProviderReference] = useState("");
  const [launching, setLaunching] = useState(false);
  const [monitorState, setMonitorState] = useState<{
    baselineUsdc: number;
    startedAt: number;
    transactionId: string;
    provider: DepositProvider;
    reference?: string;
  } | null>(null);

  const derivedFiat = useMemo(() => resolveFiatFromCountry(profile?.country_code), [profile?.country_code]);
  const usdcBalanceUnits = useMemo(
    () => parseUnits((hederaTokensQuery.data ?? []).find((token) => token.token_id === HEDERA_USDC_TOKEN_ID)?.balance),
    [hederaTokensQuery.data],
  );
  const hbarBalance = hederaOverviewQuery.data?.balanceHbar ?? "0.00000000";
  const numericAmount = Number(amount || 0);
  const previewUsdc = Number.isFinite(numericAmount) ? numericAmount : 0;

  useEffect(() => {
    setFiatCurrency(derivedFiat);
  }, [derivedFiat]);

  useEffect(() => {
    if (!monitorState || !accountId) {
      return;
    }

    let cancelled = false;
    const intervalId = window.setInterval(async () => {
      if (cancelled) {
        return;
      }

      const elapsed = Date.now() - monitorState.startedAt;
      if (elapsed >= monitorTimeoutMs) {
        setMonitorState(null);
        toast.error("Deposit confirmation timed out. You can keep monitoring from Activity.");
        try {
          await updateTransactionMutation.mutateAsync({
            id: monitorState.transactionId,
            status: "failed",
            description: "Deposit confirmation timed out while polling mirror node.",
          });
        } catch {
          // Avoid blocking UI if policy blocks updates.
        }
        return;
      }

      try {
        const balances = await getAccountTokenBalances(accountId);
        const currentUsdc = parseUnits(balances.find((token) => token.token_id === HEDERA_USDC_TOKEN_ID)?.balance);
        if (currentUsdc > monitorState.baselineUsdc) {
          setMonitorState(null);
          toast.success("Deposit detected on-chain. USDC balance updated.");
          try {
            await updateTransactionMutation.mutateAsync({
              id: monitorState.transactionId,
              status: "completed",
              description: "USDC deposit detected on Hedera mirror node.",
              metadata: {
                source: "web",
                flow: "deposit",
                provider: monitorState.provider,
                providerReference: monitorState.reference,
                detectedOnChain: true,
              },
            });
          } catch {
            // Avoid blocking UI if policy blocks updates.
          }
        }
      } catch {
        // Keep polling on transient mirror node failures.
      }
    }, monitorIntervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [accountId, monitorState, updateTransactionMutation]);

  if (profileQuery.isLoading || walletQuery.isLoading) {
    return (
      <div className="min-h-[55vh] grid place-items-center">
        <p className="text-sm text-cyan-100/70">Loading deposit setup...</p>
      </div>
    );
  }

  if (!accountId) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const startDeposit = async () => {
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter a deposit amount greater than zero.");
      return;
    }

    setLaunching(true);
    try {
      const freshTokenBalances = await getAccountTokenBalances(accountId);
      const baselineUsdc = parseUnits(
        freshTokenBalances.find((token) => token.token_id === HEDERA_USDC_TOKEN_ID)?.balance,
      );

      const transaction = await createTransactionMutation.mutateAsync({
        flow: "deposit",
        amount: numericAmount,
        targetType: provider,
        targetValue: providerReference || profile.phone || accountId,
        note: `Deposit initiated via ${providerLabels[provider]}`,
        currency: "USDC",
      });

      if (provider === "coinbase") {
        const session = await createCoinbaseOnrampSession({
          amount: numericAmount,
          currency: fiatCurrency,
          walletAddress: accountId,
          network: HEDERA_NETWORK === "mainnet" ? "hedera-mainnet" : "hedera-testnet",
          asset: "USDC",
          email: profile.email ?? undefined,
        });
        launchCoinbaseOnramp(session);
        setMonitorState({
          baselineUsdc,
          startedAt: Date.now(),
          transactionId: transaction.id,
          provider,
          reference: session.referenceId,
        });
        toast.success(`Coinbase onramp started (${session.referenceId}).`);
        return;
      }

      const hostedBaseUrl =
        provider === "yellow_card" ? import.meta.env.VITE_YELLOW_CARD_HOSTED_URL : import.meta.env.VITE_PAYCHANT_HOSTED_URL;
      if (!hostedBaseUrl) {
        throw new Error(`Missing hosted checkout URL for ${provider}. Configure env and retry.`);
      }
      const hostedUrl = buildHostedProviderUrl(hostedBaseUrl, {
        wallet: accountId,
        amount: numericAmount.toFixed(2),
        currency: fiatCurrency,
        phone: profile.phone ?? "",
        email: profile.email ?? "",
      });
      window.open(hostedUrl, "_blank", "noopener,noreferrer");
      setMonitorState({
        baselineUsdc,
        startedAt: Date.now(),
        transactionId: transaction.id,
        provider,
      });
      toast.success(`${providerLabels[provider]} launched. Monitoring wallet for incoming USDC.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start deposit flow.");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <section className="app-screen rounded-3xl p-5 md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Deposit USDC</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-cyan-50">Fiat On-ramp</h1>
        <p className="mt-1 text-sm text-cyan-100/65">
          Start a provider checkout and monitor Hedera mirror updates until USDC arrives.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">HBAR Balance</p>
            <p className="mt-1 text-xl font-semibold text-cyan-50">{hbarBalance} HBAR</p>
          </div>
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">USDC Balance</p>
            <p className="mt-1 text-xl font-semibold text-cyan-50">{usdcBalanceUnits.toLocaleString()} units</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <article className="app-card rounded-2xl p-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-cyan-100">
                Deposit Amount
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-cyan-100">Fiat Currency</Label>
              <Select value={fiatCurrency} onValueChange={setFiatCurrency}>
                <SelectTrigger className="border-cyan-300/25 bg-slate-900/30 text-cyan-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFiat.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-cyan-100">Provider</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as DepositProvider)}>
              <SelectTrigger className="border-cyan-300/25 bg-slate-900/30 text-cyan-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coinbase">Coinbase CDP (Card/Bank)</SelectItem>
                <SelectItem value="yellow_card">Yellow Card</SelectItem>
                <SelectItem value="paychant">Paychant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="providerRef" className="text-cyan-100">
              Provider Reference (Optional)
            </Label>
            <Input
              id="providerRef"
              value={providerReference}
              onChange={(event) => setProviderReference(event.target.value)}
              placeholder="Phone / account reference"
              className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
            />
          </div>

          <Button type="button" className="app-btn-primary rounded-xl border-0" disabled={launching} onClick={startDeposit}>
            {launching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting Deposit...
              </>
            ) : (
              <>
                <ArrowDownToLine className="h-4 w-4" />
                Deposit with {providerLabels[provider]}
              </>
            )}
          </Button>

          <div className="flex items-center gap-3 text-xs text-cyan-100/65">
            <p>Wallet destination: {accountId}</p>
            <Button asChild variant="link" className="h-auto p-0 text-cyan-200">
              <Link to="/app/activity">View activity</Link>
            </Button>
          </div>
        </article>

        <article className="app-card-soft rounded-2xl p-5 space-y-3">
          <h2 className="text-lg font-semibold text-cyan-50">Deposit Preview</h2>
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">You Pay</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-50">
              {Number.isFinite(numericAmount) ? numericAmount.toFixed(2) : "0.00"} {fiatCurrency}
            </p>
            <p className="mt-1 text-xs text-cyan-100/65">Estimated receive: ~{previewUsdc.toFixed(2)} USDC</p>
          </div>

          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3 text-sm text-cyan-100/80">
            <p className="flex items-center gap-2">
              {provider === "coinbase" ? <CreditCard className="h-4 w-4 text-cyan-200" /> : <Landmark className="h-4 w-4 text-cyan-200" />}
              {providerLabels[provider]}
            </p>
            <p className="mt-2 text-xs text-cyan-100/65">Network: {HEDERA_NETWORK}</p>
            <p className="mt-1 text-xs text-cyan-100/65">Asset: USDC ({HEDERA_USDC_TOKEN_ID || "set token id env"})</p>
          </div>

          {monitorState ? (
            <div className="rounded-xl border border-emerald-300/40 bg-emerald-300/10 p-3 text-sm text-emerald-100">
              <p className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Monitoring incoming USDC on-chain...
              </p>
              <p className="mt-1 text-xs">
                Checking every 5s for up to 2 minutes. Provider: {providerLabels[monitorState.provider]}
              </p>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
};

export default Deposit;
