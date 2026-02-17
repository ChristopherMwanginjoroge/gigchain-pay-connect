import { HEDERA_MIRROR_NODE_URL } from "@/lib/hedera/config";
import { HederaAccountOverview, HederaChainTx, HederaTokenBalance } from "@/types/supabase";

export class HederaMirrorError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "HederaMirrorError";
    this.status = status;
  }
}

async function mirrorRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${HEDERA_MIRROR_NODE_URL}${path}`);
  if (!response.ok) {
    throw new HederaMirrorError("Mirror node request failed.", response.status);
  }
  return (await response.json()) as T;
}

export async function getAccountOverview(accountId: string): Promise<HederaAccountOverview | null> {
  const data = await mirrorRequest<{
    account?: string;
    evm_address?: string;
    balance?: { balance?: number };
  }>(`/accounts/${accountId}`);

  if (!data.account) {
    return null;
  }

  const tinybar = data.balance?.balance ?? 0;
  return {
    account: data.account,
    balanceTinybar: String(tinybar),
    balanceHbar: (tinybar / 100_000_000).toFixed(8),
    evm_address: data.evm_address,
  };
}

export async function getAccountTokenBalances(accountId: string): Promise<HederaTokenBalance[]> {
  const data = await mirrorRequest<{
    balances?: Array<{
      tokens?: Array<{ token_id?: string; balance?: number }>;
    }>;
  }>(`/balances?account.id=${accountId}&limit=1`);

  const tokenBalances = data.balances?.[0]?.tokens ?? [];
  return tokenBalances
    .filter((item) => item.token_id)
    .map((item) => ({
      token_id: item.token_id as string,
      balance: String(item.balance ?? 0),
    }));
}

export async function getRecentTransactions(accountId: string, limit = 10): Promise<HederaChainTx[]> {
  const data = await mirrorRequest<{
    transactions?: Array<{
      transaction_id?: string;
      name?: string;
      result?: string;
      consensus_timestamp?: string;
      memo_base64?: string;
      charged_tx_fee?: number;
    }>;
  }>(`/transactions?account.id=${accountId}&limit=${limit}&order=desc`);

  return (data.transactions ?? []).map((item) => ({
    id: item.transaction_id ?? crypto.randomUUID(),
    type: item.name ?? "UNKNOWN",
    status: item.result === "SUCCESS" ? "SUCCESS" : item.result ? "FAILED" : "UNKNOWN",
    consensusTimestamp: item.consensus_timestamp ?? "",
    memo: item.memo_base64 ? atob(item.memo_base64) : "",
    amount: item.charged_tx_fee ? String(item.charged_tx_fee) : undefined,
    asset: "HBAR",
  }));
}

export async function isTokenAssociated(accountId: string, tokenId: string): Promise<boolean> {
  const data = await mirrorRequest<{
    tokens?: Array<{ token_id?: string }>;
  }>(`/accounts/${accountId}/tokens?token.id=${encodeURIComponent(tokenId)}&limit=1`);

  return (data.tokens ?? []).some((token) => token.token_id === tokenId);
}
