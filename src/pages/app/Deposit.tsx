import { useEffect, useMemo, useState, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { ArrowDownToLine, CreditCard, Landmark, Loader2, Sparkles, ExternalLink, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProfileQuery } from "@/lib/api/profile";
import { useWalletBalanceQuery } from "@/lib/api/wallet";
import { useCreateTransactionMutation, useUpdateTransactionStatusMutation } from "@/lib/api/transactions";
import { useHederaOverviewQuery, useHederaTokenBalancesQuery } from "@/lib/api/hedera";
import { useSolanaWalletData } from "@/lib/api/solana";
import { getAccountTokenBalances } from "@/lib/hedera/mirror";
import { getSolanaUsdcBalance } from "@/lib/solana/rpc";
import { HEDERA_NETWORK, HEDERA_USDC_TOKEN_ID } from "@/lib/hedera/config";
import { SOLANA_NETWORK, getSolanaNetworkDisplay } from "@/lib/solana/config";
import { 
  openMoonPayIframe, 
  estimateMoonPayFees,
  isMoonPayAvailable,
  getMoonPayEnvironment,
  listenForMoonPayEvents,
  type MoonPayTransactionData
} from "@/lib/onramp/moonpay";
import {
  createCoinbaseOnrampSession,
  isCoinbaseConfigured,
  countryByFiat,
} from "@/lib/onramp/coinbase";
import {
  buildPaycrestCheckoutUrl,
  isPaycrestConfigured,
} from "@/lib/onramp/paycrest";

// Supported blockchain networks
type NetworkType = "hedera" | "solana";

// Provider depends on network
type DepositProvider = "moonpay" | "coinbase" | "paycrest";

const networkLabels: Record<NetworkType, string> = {
  hedera: "Hedera",
  solana: "Solana",
};

const networkDescriptions: Record<NetworkType, string> = {
  hedera: "Fast, eco-friendly, enterprise-grade",
  solana: "High-speed, low-cost transactions",
};

// Providers available per network
const providersByNetwork: Record<NetworkType, DepositProvider[]> = {
  hedera: ["moonpay", "paycrest"],
  solana: ["coinbase", "paycrest"],
};

const providerLabels: Record<DepositProvider, string> = {
  moonpay: "MoonPay (Card/Bank → USDC)",
  coinbase: "Coinbase (Card/Bank → USDC)",
  paycrest: "Paycrest (Mobile Money → USDC)",
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
  
  // Multi-chain wallet addresses
  const hederaAccountId = profile?.hedera_account_id?.trim() || walletQuery.data?.hedera_account_id?.trim() || null;
  const solanaAddress = profile?.solana_address?.trim() || null;
  
  // Network selection state
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>(
    profile?.preferred_network || "hedera"
  );
  
  // Active wallet based on selected network
  const activeWalletAddress = selectedNetwork === "hedera" ? hederaAccountId : solanaAddress;

  // Hedera queries
  const hederaOverviewQuery = useHederaOverviewQuery(hederaAccountId);
  const hederaTokensQuery = useHederaTokenBalancesQuery(hederaAccountId);
  
  // Solana queries
  const solanaWalletQuery = useSolanaWalletData(solanaAddress || undefined);

  const [amount, setAmount] = useState("50");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [provider, setProvider] = useState<DepositProvider>(
    selectedNetwork === "hedera" ? "moonpay" : "coinbase"
  );
  const [providerReference, setProviderReference] = useState("");
  const [launching, setLaunching] = useState(false);
  const [monitorState, setMonitorState] = useState<{
    baselineUsdc: number;
    startedAt: number;
    transactionId: string;
    provider: DepositProvider;
    reference?: string;
  } | null>(null);
  
  // MoonPay widget state
  const [moonpayOrderId, setMoonpayOrderId] = useState<string | null>(null);
  const cleanupWidgetRef = useRef<(() => void) | null>(null);
  const cleanupEventsRef = useRef<(() => void) | null>(null);

  const derivedFiat = useMemo(() => resolveFiatFromCountry(profile?.country_code), [profile?.country_code]);
  
  // USDC balances per network
  const hederaUsdcBalance = useMemo(
    () => parseUnits((hederaTokensQuery.data ?? []).find((token) => token.token_id === HEDERA_USDC_TOKEN_ID)?.balance),
    [hederaTokensQuery.data],
  );
  const solanaUsdcBalance = solanaWalletQuery.balances?.usdc?.amount ?? 0;
  const usdcBalanceUnits = selectedNetwork === "hedera" ? hederaUsdcBalance : solanaUsdcBalance;
  
  // Native balances
  const hbarBalance = hederaOverviewQuery.data?.balanceHbar ?? "0.00000000";
  const solBalance = solanaWalletQuery.balances?.sol?.amount?.toFixed(9) ?? "0.000000000";
  const nativeBalance = selectedNetwork === "hedera" ? hbarBalance : solBalance;
  const nativeSymbol = selectedNetwork === "hedera" ? "HBAR" : "SOL";
  
  const numericAmount = Number(amount || 0);
  const previewUsdc = Number.isFinite(numericAmount) ? numericAmount : 0;

  // Update provider when network changes
  useEffect(() => {
    const availableProviders = providersByNetwork[selectedNetwork];
    if (!availableProviders.includes(provider)) {
      setProvider(availableProviders[0]);
    }
  }, [selectedNetwork, provider]);

  useEffect(() => {
    setFiatCurrency(derivedFiat);
  }, [derivedFiat]);

  useEffect(() => {
    if (!monitorState || !activeWalletAddress) {
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
            description: "Deposit confirmation timed out while polling.",
          });
        } catch {
          // Avoid blocking UI if policy blocks updates.
        }
        return;
      }

      try {
        let currentUsdc = 0;
        
        if (selectedNetwork === "hedera" && hederaAccountId) {
          const balances = await getAccountTokenBalances(hederaAccountId);
          currentUsdc = parseUnits(balances.find((token) => token.token_id === HEDERA_USDC_TOKEN_ID)?.balance);
        } else if (selectedNetwork === "solana" && solanaAddress) {
          const solanaBalance = await getSolanaUsdcBalance(solanaAddress);
          currentUsdc = solanaBalance.amount;
        }
        
        if (currentUsdc > monitorState.baselineUsdc) {
          setMonitorState(null);
          toast.success("Deposit detected on-chain. USDC balance updated.");
          try {
            await updateTransactionMutation.mutateAsync({
              id: monitorState.transactionId,
              status: "completed",
              description: `USDC deposit detected on ${networkLabels[selectedNetwork]}.`,
              metadata: {
                source: "web",
                flow: "deposit",
                provider: monitorState.provider,
                providerReference: monitorState.reference,
                network: selectedNetwork,
                detectedOnChain: true,
              },
            });
          } catch {
            // Avoid blocking UI if policy blocks updates.
          }
        }
      } catch {
        // Keep polling on transient failures.
      }
    }, monitorIntervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeWalletAddress, hederaAccountId, solanaAddress, selectedNetwork, monitorState, updateTransactionMutation]);

  if (profileQuery.isLoading || walletQuery.isLoading) {
    return (
      <div className="min-h-[55vh] grid place-items-center">
        <p className="text-sm text-cyan-100/70">Loading deposit setup...</p>
      </div>
    );
  }

  // Check that at least one network wallet exists
  const hasAnyWallet = hederaAccountId || solanaAddress;
  if (!hasAnyWallet) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  // Check wallet exists for selected network
  const hasWalletForSelectedNetwork = selectedNetwork === "hedera" ? !!hederaAccountId : !!solanaAddress;

  const startDeposit = async () => {
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      toast.error("Enter a deposit amount greater than zero.");
      return;
    }
    
    if (!hasWalletForSelectedNetwork) {
      toast.error(`No ${networkLabels[selectedNetwork]} wallet found. Please create one first.`);
      return;
    }

    setLaunching(true);
    try {
      // Get baseline USDC balance for selected network
      let baselineUsdc = 0;
      if (selectedNetwork === "hedera" && hederaAccountId) {
        const freshTokenBalances = await getAccountTokenBalances(hederaAccountId);
        baselineUsdc = parseUnits(
          freshTokenBalances.find((token) => token.token_id === HEDERA_USDC_TOKEN_ID)?.balance,
        );
      } else if (selectedNetwork === "solana" && solanaAddress) {
        const solanaBalance = await getSolanaUsdcBalance(solanaAddress);
        baselineUsdc = solanaBalance.amount;
      }

      const transaction = await createTransactionMutation.mutateAsync({
        flow: "deposit",
        amount: numericAmount,
        targetType: provider,
        targetValue: providerReference || profile.phone || activeWalletAddress || "",
        note: `Deposit initiated via ${providerLabels[provider]} on ${networkLabels[selectedNetwork]}`,
        currency: "USDC",
      });

      if (provider === "moonpay") {
        // MoonPay widget handles KYC, payment, and USDC delivery to Hedera
        if (!isMoonPayAvailable()) {
          throw new Error("MoonPay API key not configured. Please set VITE_MOONPAY_API_KEY.");
        }

        // Set up event listeners for MoonPay postMessage events
        const cleanupEvents = listenForMoonPayEvents({
          onTransactionCreated: (data: MoonPayTransactionData) => {
            setMoonpayOrderId(data.id);
            toast.info(`Order ${data.id} created. Complete payment in MoonPay.`);
          },
          onTransactionCompleted: async (data: MoonPayTransactionData) => {
            setMoonpayOrderId(null);
            toast.success(`USDC purchase complete! ${data.quoteCurrencyAmount} USDC incoming.`);
            cleanupWidgetRef.current?.();
            cleanupEventsRef.current?.();
            try {
              await updateTransactionMutation.mutateAsync({
                id: transaction.id,
                status: "completed",
                description: `MoonPay order ${data.id} completed. ${data.quoteCurrencyAmount} USDC.`,
                metadata: {
                  source: "web",
                  flow: "deposit",
                  provider: "moonpay",
                  network: selectedNetwork,
                  moonpayOrderId: data.id,
                  cryptoAmount: data.quoteCurrencyAmount,
                  transactionHash: data.cryptoTransactionId,
                },
              });
            } catch {
              // Transaction update may fail due to RLS
            }
          },
          onTransactionFailed: async (data: MoonPayTransactionData) => {
            setMoonpayOrderId(null);
            toast.error(`Order failed: ${data.status}`);
            cleanupWidgetRef.current?.();
            try {
              await updateTransactionMutation.mutateAsync({
                id: transaction.id,
                status: "failed",
                description: `MoonPay order ${data.id} failed: ${data.status}`,
              });
            } catch {
              // Transaction update may fail due to RLS
            }
          },
          onClose: () => {
            setLaunching(false);
            cleanupWidgetRef.current = null;
            cleanupEventsRef.current = null;
          },
        });
        cleanupEventsRef.current = cleanupEvents;

        // Open MoonPay iframe overlay
        const { cleanup } = openMoonPayIframe({
          walletAddress: hederaAccountId!,
          fiatAmount: numericAmount,
          fiatCurrency,
          email: profile.email,
          externalTransactionId: transaction.id,
          redirectURL: `${window.location.origin}/app/activity`,
          showWalletAddressForm: false,
        });
        cleanupWidgetRef.current = cleanup;
        
        setMonitorState({
          baselineUsdc,
          startedAt: Date.now(),
          transactionId: transaction.id,
          provider,
          reference: transaction.id,
        });
        toast.success("MoonPay widget opened. Complete KYC and payment.");
        return;
      }

      if (provider === "coinbase") {
        // Coinbase Pay for Solana USDC - uses session token from edge function
        if (!isCoinbaseConfigured()) {
          throw new Error("Coinbase not configured. Please set VITE_COINBASE_ONRAMP_APP_ID.");
        }
        
        toast.info("Initializing Coinbase Pay...");
        
        // Get country code for Coinbase
        const country = countryByFiat[fiatCurrency] || "US";
        
        // Create session with token (calls edge function)
        const session = await createCoinbaseOnrampSession({
          walletAddress: solanaAddress!,
          network: "solana",
          asset: "USDC",
          amount: numericAmount,
          currency: fiatCurrency,
          country,
          paymentMethod: "CARD",
        });
        
        window.open(session.launchUrl, "_blank", "noopener,noreferrer");
        setMonitorState({
          baselineUsdc,
          startedAt: Date.now(),
          transactionId: transaction.id,
          provider,
          reference: session.referenceId,
        });
        toast.success("Coinbase Pay opened. Monitoring wallet for incoming USDC.");
        return;
      }

      if (provider === "paycrest") {
        // Paycrest for African mobile money
        const paycrestUrl = buildPaycrestCheckoutUrl({
          walletAddress: activeWalletAddress!,
          network: selectedNetwork,
          cryptoCurrency: "USDC",
          fiatCurrency,
          fiatAmount: numericAmount,
          phone: profile.phone ?? "",
          email: profile.email ?? "",
          partnerReference: transaction.id,
        });
        window.open(paycrestUrl, "_blank", "noopener,noreferrer");
        setMonitorState({
          baselineUsdc,
          startedAt: Date.now(),
          transactionId: transaction.id,
          provider,
        });
        toast.success(`${providerLabels[provider]} launched. Monitoring wallet for incoming USDC.`);
        return;
      }

      // Legacy hosted provider fallback
      const hostedBaseUrl = import.meta.env.VITE_PAYCREST_HOSTED_URL;
      if (!hostedBaseUrl) {
        throw new Error(`Missing hosted checkout URL for ${provider}. Configure env and retry.`);
      }
      const hostedUrl = buildHostedProviderUrl(hostedBaseUrl, {
        wallet: activeWalletAddress!,
        network: selectedNetwork,
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
          Select network, choose provider, and monitor for incoming USDC.
        </p>
        
        {/* Network Selection */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(["hedera", "solana"] as NetworkType[]).map((network) => {
            const hasWallet = network === "hedera" ? !!hederaAccountId : !!solanaAddress;
            const isSelected = selectedNetwork === network;
            return (
              <button
                key={network}
                onClick={() => hasWallet && setSelectedNetwork(network)}
                disabled={!hasWallet}
                className={`relative rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-950/40"
                    : hasWallet
                    ? "border-cyan-300/20 bg-slate-950/25 hover:border-cyan-300/40"
                    : "border-cyan-300/10 bg-slate-950/15 opacity-50 cursor-not-allowed"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                  </div>
                )}
                <Wallet className="h-5 w-5 text-cyan-300/70 mb-2" />
                <p className="font-medium text-cyan-50">{networkLabels[network]}</p>
                <p className="text-xs text-cyan-100/60 mt-0.5">{networkDescriptions[network]}</p>
                {!hasWallet && (
                  <p className="text-xs text-amber-400/80 mt-2">No wallet created</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Balance Display */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">{nativeSymbol} Balance</p>
            <p className="mt-1 text-xl font-semibold text-cyan-50">{nativeBalance} {nativeSymbol}</p>
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
            <Label className="text-cyan-100">Provider ({networkLabels[selectedNetwork]})</Label>
            <Select value={provider} onValueChange={(value) => setProvider(value as DepositProvider)}>
              <SelectTrigger className="border-cyan-300/25 bg-slate-900/30 text-cyan-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providersByNetwork[selectedNetwork].map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {providerLabels[prov]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* MoonPay info */}
          {provider === "moonpay" && (
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-950/20 p-3 space-y-2">
              <p className="text-xs text-cyan-100/80">
                <CreditCard className="inline h-3.5 w-3.5 mr-1" />
                Pay with card, bank transfer, or Apple/Google Pay
              </p>
              <p className="text-xs text-cyan-100/60">
                MoonPay handles KYC verification. USDC delivered directly to your Hedera wallet.
              </p>
              <p className="text-xs text-cyan-100/60">
                Environment: {getMoonPayEnvironment()}
              </p>
            </div>
          )}
          
          {/* Coinbase info */}
          {provider === "coinbase" && (
            <div className="rounded-lg border border-cyan-300/20 bg-cyan-950/20 p-3 space-y-2">
              <p className="text-xs text-cyan-100/80">
                <CreditCard className="inline h-3.5 w-3.5 mr-1" />
                Pay with card, bank, or linked Coinbase account
              </p>
              <p className="text-xs text-cyan-100/60">
                Coinbase handles KYC verification. USDC delivered directly to your Solana wallet.
              </p>
              <p className="text-xs text-cyan-100/60">
                Network: {getSolanaNetworkDisplay()}
              </p>
            </div>
          )}

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

          {/* MoonPay order tracking */}
          {moonpayOrderId && (
            <div className="rounded-lg border border-amber-300/40 bg-amber-300/10 p-3">
              <p className="text-xs text-amber-100">
                <Loader2 className="inline h-3.5 w-3.5 mr-1 animate-spin" />
                Order in progress: {moonpayOrderId}
              </p>
              <p className="text-xs text-amber-100/60 mt-1">
                Complete the payment flow in the MoonPay widget.
              </p>
            </div>
          )}

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
            <p>{networkLabels[selectedNetwork]} wallet: {activeWalletAddress}</p>
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
              {provider === "moonpay" ? <CreditCard className="h-4 w-4 text-cyan-200" /> : <Landmark className="h-4 w-4 text-cyan-200" />}
              {providerLabels[provider]}
            </p>
            {provider === "moonpay" ? (
              <>
                <p className="mt-2 text-xs text-cyan-100/65">Payment: Card, Bank, Apple/Google Pay</p>
                <p className="mt-1 text-xs text-cyan-100/65">Direct to: {HEDERA_NETWORK}</p>
                <p className="mt-1 text-xs text-emerald-300">
                  Est. fee: ~${estimateMoonPayFees(numericAmount).estimatedFee.toFixed(2)} ({estimateMoonPayFees(numericAmount).feePercentage}%)
                </p>
              </>
            ) : (
              <p className="mt-2 text-xs text-cyan-100/65">Network: {HEDERA_NETWORK}</p>
            )}
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
