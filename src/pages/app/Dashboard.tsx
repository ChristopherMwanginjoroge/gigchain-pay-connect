import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, KeyRound, QrCode, ShieldCheck, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKycQuery } from "@/lib/api/kyc";
import { useProfileQuery, useUpdateProfileMutation } from "@/lib/api/profile";
import { useTransactionsQuery } from "@/lib/api/transactions";
import { useWalletBalanceQuery } from "@/lib/api/wallet";
import { useHederaOverviewQuery, useHederaTokenBalancesQuery } from "@/lib/api/hedera";
import {
  assertDevOperatorEnabled,
  associateUsdc,
  createAccountFromPublicKey,
} from "@/lib/hedera/client";
import { HEDERA_IS_DEV, HEDERA_USDC_TOKEN_ID } from "@/lib/hedera/config";
import { getAccountOverview, isTokenAssociated } from "@/lib/hedera/mirror";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  decryptPrivateKey,
  downloadRecoveryFile,
  encryptPrivateKey,
  generateWalletKeyMaterial,
  loadEncryptedKeyVault,
  parseRecoveryJson,
  storeEncryptedKeyVault,
} from "@/lib/wallet/keys";
import { WalletSetupStatus } from "@/types/supabase";

const KES_RATE = 128.5;
const USDC_DECIMALS = 1_000_000;

const formatAmount = (amount?: string) => {
  const value = Number(amount ?? 0);
  return Number.isFinite(value) ? value.toFixed(2) : "0.00";
};

const parseNumeric = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const setupLabel: Record<WalletSetupStatus, string> = {
  locked_by_kyc: "Locked by KYC",
  ready_to_create: "Ready to Create",
  creating: "Creating Wallet",
  created: "Wallet Ready",
  associate_failed: "USDC Pending (Add HBAR First)",
};

const Dashboard = () => {
  const { user } = useAuth();
  const profileQuery = useProfileQuery();
  const walletQuery = useWalletBalanceQuery();
  const kycQuery = useKycQuery();
  const transactionsQuery = useTransactionsQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const profile = profileQuery.data;
  const linkedAccountFromProfile = profile?.hedera_account_id?.trim() || null;
  const linkedAccountFromWallet = walletQuery.data?.hedera_account_id?.trim() || null;
  const effectiveAccountId = linkedAccountFromProfile || linkedAccountFromWallet;
  const hasLinkedWallet = !!effectiveAccountId;

  const hederaOverviewQuery = useHederaOverviewQuery(effectiveAccountId);
  const hederaTokensQuery = useHederaTokenBalancesQuery(effectiveAccountId);

  const [setupStatus, setSetupStatus] = useState<WalletSetupStatus>("ready_to_create");
  const [passphrase, setPassphrase] = useState("");
  const [confirmBackup, setConfirmBackup] = useState(false);
  const [setupPending, setSetupPending] = useState(false);
  const [createTxId, setCreateTxId] = useState<string | null>(null);
  const [associateTxId, setAssociateTxId] = useState<string | null>(null);
  const [importingVault, setImportingVault] = useState(false);
  const [localVault, setLocalVault] = useState<Awaited<ReturnType<typeof loadEncryptedKeyVault>>>(null);
  const [importPassphrase, setImportPassphrase] = useState("");
  const [confirmImportPassphrase, setConfirmImportPassphrase] = useState("");
  const [associationInProgress, setAssociationInProgress] = useState(false);

  const recentTransactions = (transactionsQuery.data ?? []).slice(0, 4);
  const hasVault = !!localVault;
  const usdcTokenBalance = (hederaTokensQuery.data ?? []).find((item) => item.token_id === HEDERA_USDC_TOKEN_ID);
  const usdcUnits = parseNumeric(usdcTokenBalance?.balance);
  const mirrorUsdcBalance = usdcUnits / USDC_DECIMALS;
  const ledgerUsdcBalance = parseNumeric(walletQuery.data?.balance);
  const hasMirrorUsdcData = hederaTokensQuery.isSuccess;
  const balance = hasMirrorUsdcData ? mirrorUsdcBalance : ledgerUsdcBalance;
  const balanceSource = hasMirrorUsdcData ? "Hedera mirror" : "Supabase ledger fallback";
  const hasSubmittedKyc = !!kycQuery.data?.length;
  const effectiveUsdcAssociated = Boolean(profile?.usdc_associated) || Boolean(usdcTokenBalance);
  const hasHbarBalance = Number(hederaOverviewQuery.data?.balanceHbar ?? 0) > 0;
  const displaySetupStatus: WalletSetupStatus =
    setupStatus === "ready_to_create"
      ? !hasLinkedWallet
        ? "ready_to_create"
        : effectiveUsdcAssociated
          ? "created"
          : "associate_failed"
      : setupStatus;

  useEffect(() => {
    let active = true;
    async function loadVault() {
      if (!user?.id) {
        if (active) {
          setLocalVault(null);
        }
        return;
      }
      const vault = await loadEncryptedKeyVault(user.id);
      if (active) {
        setLocalVault(vault);
      }
    }

    loadVault();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const ensureUsdcAssociation = async (accountId: string, privateKey: string) => {
    const alreadyAssociated = await isTokenAssociated(accountId, HEDERA_USDC_TOKEN_ID);
    if (alreadyAssociated) {
      await updateProfileMutation.mutateAsync({
        usdc_associated: true,
        usdc_prompt_dismissed: false,
      });
      return;
    }

    const association = await associateUsdc(accountId, privateKey);
    setAssociateTxId(association.txId);
    await updateProfileMutation.mutateAsync({
      usdc_associated: true,
      usdc_prompt_dismissed: false,
    });
  };

  const createWallet = async () => {
    if (!user?.id) {
      toast.error("No authenticated user found.");
      return;
    }
    if (!HEDERA_IS_DEV) {
      toast.error("Operator-based wallet creation is disabled outside development.");
      return;
    }
    if (!passphrase || passphrase.length < 8) {
      toast.error("Use a passphrase with at least 8 characters.");
      return;
    }
    if (!confirmBackup) {
      toast.error("Confirm backup export before creating wallet.");
      return;
    }

    setSetupPending(true);
    setSetupStatus("creating");
    try {
      await assertDevOperatorEnabled();
      const keypair = await generateWalletKeyMaterial();
      const vault = await encryptPrivateKey(keypair.privateKey, keypair.publicKey, passphrase);
      await storeEncryptedKeyVault(user.id, vault);
      setLocalVault(vault);
      downloadRecoveryFile(user.id, vault);

      const accountCreation = await createAccountFromPublicKey(keypair.publicKey);
      setCreateTxId(accountCreation.txId);

      await updateProfileMutation.mutateAsync({
        hedera_account_id: accountCreation.accountId,
        hedera_public_key: keypair.publicKey,
        wallet_created_at: new Date().toISOString(),
        usdc_associated: false,
      });

      setSetupStatus("created");
      toast.success("Wallet created. Add some HBAR, then run USDC association.");
    } catch (error) {
      setSetupStatus("ready_to_create");
      toast.error(error instanceof Error ? error.message : "Wallet creation failed.");
    } finally {
      setSetupPending(false);
    }
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const associateWithRetry = async (accountId: string, privateKey: string) => {
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        if (attempt > 1) {
          toast.message(`Retrying USDC association (${attempt}/${maxAttempts})...`);
        }
        await ensureUsdcAssociation(accountId, privateKey);
        return;
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await sleep(attempt * 1200);
          continue;
        }
      }
    }

    throw lastError;
  };

  const retryAssociate = async () => {
    if (!user?.id || !effectiveAccountId) {
      return;
    }
    const vault = localVault ?? (await loadEncryptedKeyVault(user.id));
    if (!vault) {
      toast.error("Recovery vault not found for this user.");
      return;
    }
    if (profile?.hedera_public_key && vault.publicKey !== profile.hedera_public_key) {
      toast.error("Local recovery file does not match the linked wallet. Import the correct recovery JSON.");
      return;
    }
    setAssociationInProgress(true);
    try {
      const liveOverview = await getAccountOverview(effectiveAccountId);
      const hasTinybar = Number(liveOverview?.balanceTinybar ?? 0) > 0;
      if (!hasTinybar) {
        toast.error("Add some HBAR to this wallet first, then retry USDC association.");
        return;
      }
      const privateKey = await decryptPrivateKey(vault, passphrase);
      await associateWithRetry(effectiveAccountId, privateKey);
      setSetupStatus("created");
      toast.success("USDC association completed.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "USDC retry failed.";
      if (message.includes("Invalid passphrase or corrupted recovery file")) {
        toast.error("Wrong passphrase or wrong recovery file for this wallet. Import the matching recovery JSON and retry.");
        return;
      }
      toast.error(message);
    } finally {
      setAssociationInProgress(false);
    }
  };

  const handleRecoveryImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) {
      return;
    }

    setImportingVault(true);
    try {
      if (!importPassphrase.trim() || !confirmImportPassphrase.trim()) {
        throw new Error("Enter passphrase and confirmation before importing recovery.");
      }
      if (importPassphrase !== confirmImportPassphrase) {
        throw new Error("Passphrase confirmation does not match.");
      }
      const raw = await file.text();
      const vault = parseRecoveryJson(raw);
      if (profile?.hedera_public_key && vault.publicKey !== profile.hedera_public_key) {
        throw new Error("Recovery file public key does not match the linked wallet.");
      }
      await decryptPrivateKey(vault, importPassphrase);
      await storeEncryptedKeyVault(user.id, vault);
      setLocalVault(vault);
      setPassphrase(importPassphrase);
      setImportPassphrase("");
      setConfirmImportPassphrase("");
      toast.success("Recovery file imported for this account.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to import recovery file.");
    } finally {
      setImportingVault(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <section className="app-screen rounded-3xl p-5 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-100/65">Hedera Testnet Dashboard</p>
          <span className="app-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            {HEDERA_IS_DEV ? "DEV ONLY" : "DISABLED OUTSIDE DEV"}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-100/70">Total Balance</p>
            <h1 className="text-4xl font-bold tracking-tight text-cyan-50">{formatAmount(String(balance))} USDC</h1>
            <p className="mt-1 text-sm text-emerald-200/90">≈ {Math.round(balance * KES_RATE).toLocaleString()} KES</p>
            <p className="mt-1 text-xs text-cyan-100/60">Source: {balanceSource}</p>
          </div>
          <span className="app-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Live Mirror Node
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <Button asChild className="app-btn-primary h-12 rounded-xl border-0 text-sm">
            <Link to="/app/invoice">Receive</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-xl border-cyan-300/30 bg-cyan-400/5 text-cyan-50 hover:bg-cyan-400/10"
          >
            <Link to="/app/deposit">Deposit / On-ramp</Link>
          </Button>
          <Button asChild className="h-12 rounded-xl border-0 bg-emerald-400/25 text-emerald-50 hover:bg-emerald-400/30">
            <Link to="/app/transactions/new?flow=withdrawal&targetType=mpesa">Withdraw to M-Pesa</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-xl border-cyan-300/30 bg-slate-900/20 text-cyan-100 hover:bg-cyan-400/10"
          >
            <Link to="/app/invoice">
              <QrCode className="h-4 w-4" />
              Invoice QR
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          <article className="app-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-cyan-50">Wallet Onboarding</h2>
                <p className="mt-1 text-sm text-cyan-100/70">
                  Wallet creation with operator account create and automatic USDC association (KYC currently optional).
                </p>
              </div>
              <Wallet className="mt-1 h-5 w-5 text-cyan-200" />
            </div>

            <div className="mt-4 rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/55">Wallet Setup Status</p>
              <p className="mt-1 text-sm font-semibold text-cyan-50">{setupLabel[displaySetupStatus]}</p>
              {!HEDERA_IS_DEV ? <p className="mt-1 text-xs text-amber-200">This flow is intentionally blocked outside development.</p> : null}
              <p className="mt-1 text-xs text-cyan-100/70">
                KYC submission: {hasSubmittedKyc ? "submitted" : "not submitted (currently optional)"}.
              </p>
            </div>

            {!hasLinkedWallet ? (
              <div className="mt-4 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="passphrase" className="text-cyan-100">
                    Wallet Passphrase
                  </Label>
                  <Input
                    id="passphrase"
                    type="password"
                    value={passphrase}
                    onChange={(event) => setPassphrase(event.target.value)}
                    className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 placeholder:text-cyan-100/30"
                    placeholder="Min 8 characters"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs text-cyan-100/80">
                  <input
                    type="checkbox"
                    checked={confirmBackup}
                    onChange={(event) => setConfirmBackup(event.target.checked)}
                    className="h-4 w-4 rounded border-cyan-300/40 bg-slate-900/40"
                  />
                  I confirm recovery backup will be exported before onboarding completes.
                </label>

                <Button type="button" className="app-btn-primary rounded-xl border-0" disabled={setupPending} onClick={createWallet}>
                  <KeyRound className="h-4 w-4" />
                  {setupPending ? "Creating Wallet..." : "Create Hedera Wallet"}
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3 text-sm text-cyan-100/90">
                  Wallet linked: {effectiveAccountId}
                </p>
                <p className="text-xs text-cyan-100/70">
                  Local encrypted recovery: {hasVault ? "available" : "missing on this device"}.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="importPassphrase" className="text-cyan-100">
                    Import Passphrase
                  </Label>
                  <Input
                    id="importPassphrase"
                    type="password"
                    value={importPassphrase}
                    onChange={(event) => setImportPassphrase(event.target.value)}
                    className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 placeholder:text-cyan-100/30"
                    placeholder="Passphrase used for this recovery file"
                    disabled={importingVault}
                  />
                  <Label htmlFor="confirmImportPassphrase" className="text-cyan-100">
                    Confirm Import Passphrase
                  </Label>
                  <Input
                    id="confirmImportPassphrase"
                    type="password"
                    value={confirmImportPassphrase}
                    onChange={(event) => setConfirmImportPassphrase(event.target.value)}
                    className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 placeholder:text-cyan-100/30"
                    placeholder="Re-enter passphrase"
                    disabled={importingVault}
                  />
                  <Label htmlFor="recoveryImport" className="text-cyan-100">
                    Import Recovery JSON
                  </Label>
                  <Input
                    id="recoveryImport"
                    type="file"
                    accept="application/json"
                    className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 file:text-cyan-100"
                    onChange={handleRecoveryImport}
                    disabled={importingVault}
                  />
                  <p className="text-xs text-cyan-100/65">
                    Use this if the wallet was created on another device.
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-cyan-300/30 bg-slate-900/30 text-cyan-100 hover:bg-cyan-400/10"
                    disabled={setupPending || associationInProgress || effectiveUsdcAssociated || !hasHbarBalance}
                    onClick={retryAssociate}
                  >
                    {associationInProgress ? "Associating USDC..." : "Retry USDC Association"}
                  </Button>
                </div>
                {!effectiveUsdcAssociated ? (
                  <p className="text-xs text-cyan-100/70">
                    {hasHbarBalance
                      ? "HBAR detected. You can now associate USDC."
                      : "Fund this wallet with HBAR first to enable USDC association."}
                  </p>
                ) : null}
                {!hasHbarBalance ? (
                  <div className="rounded-xl border border-amber-300/40 bg-amber-300/10 p-3 text-xs text-amber-100">
                    <p className="font-semibold">HBAR required before USDC association</p>
                    <p className="mt-1">
                      This wallet has 0 HBAR. Fund it from Hedera testnet faucet, then retry association.
                    </p>
                    <a
                      href="https://portal.hedera.com/faucet"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-amber-50 underline"
                    >
                      Open Hedera Faucet
                    </a>
                  </div>
                ) : null}
              </div>
            )}

            <div className="mt-4 space-y-2 text-xs text-cyan-100/70">
              {createTxId ? <p>Account create tx: {createTxId}</p> : null}
              {associateTxId ? <p>USDC associate tx: {associateTxId}</p> : null}
            </div>
          </article>

          <article className="app-card-soft rounded-2xl p-5">
            <h3 className="text-base font-semibold text-cyan-50">Recent Activity</h3>
            <p className="mt-1 text-xs text-cyan-100/65">Supabase transaction requests + external status updates.</p>
            <div className="mt-3 space-y-2">
              {!recentTransactions.length ? (
                <p className="rounded-xl border border-cyan-300/15 bg-slate-950/20 p-3 text-sm text-cyan-100/70">No transactions yet.</p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-xl border border-cyan-300/15 bg-slate-950/20 p-3">
                    <div>
                      <p className="text-sm font-semibold text-cyan-50">{transaction.title}</p>
                      <p className="text-xs text-cyan-100/60">{new Date(transaction.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-50">
                        {Number(transaction.amount).toFixed(2)} {transaction.currency}
                      </p>
                      <p className="text-xs uppercase tracking-wide text-cyan-100/60">{transaction.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <article className="app-card rounded-2xl p-5">
            <h3 className="text-base font-semibold text-cyan-50">On-Chain Snapshot</h3>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">HBAR</p>
                <p className="mt-2 text-sm text-cyan-100/90">
                  {hederaOverviewQuery.data?.balanceHbar ?? "0.00000000"} HBAR
                </p>
                <p className="mt-1 text-xs text-cyan-100/60">
                  {hederaOverviewQuery.isFetching ? "Refreshing mirror data..." : "Mirror node synced"}
                </p>
                {hederaOverviewQuery.error ? (
                  <p className="mt-1 text-xs text-amber-200">
                    Mirror lookup failed for {effectiveAccountId}. Check network/account alignment.
                  </p>
                ) : null}
              </div>

              <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">USDC Token</p>
                <p className="mt-2 text-sm text-cyan-100/90">
                  {usdcTokenBalance
                    ? `${formatAmount(String(mirrorUsdcBalance))} USDC (${usdcTokenBalance.balance} units)`
                    : "Not present or zero balance"}
                </p>
                <p className="mt-1 text-xs text-cyan-100/60">
                  Status: {effectiveUsdcAssociated ? "associated" : "not associated"}
                </p>
              </div>

              <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">Ramps</p>
                <div className="mt-2 space-y-2 text-sm text-cyan-100/80">
                  <p className="flex items-center gap-2">
                    <ArrowDownLeft className="h-4 w-4 text-cyan-200" />
                    On-ramp: Coinbase sandbox
                  </p>
                  <p className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                    Off-ramp: future M-Pesa bridge
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="app-card-soft rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-base font-semibold text-cyan-50">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Security Notes
            </h3>
            <p className="mt-2 text-sm text-cyan-100/70">
              This flow uses exposed operator and sandbox secrets in browser for development-only testnet usage.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
