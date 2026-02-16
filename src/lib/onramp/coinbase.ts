import { HEDERA_APP_ENV, HEDERA_IS_DEV } from "@/lib/hedera/config";
import { CoinbaseOnrampSession } from "@/types/supabase";

const coinbaseBaseUrl = import.meta.env.VITE_COINBASE_ONRAMP_API_BASE_URL ?? "https://api.developer.coinbase.com";
const coinbaseApiKey = import.meta.env.VITE_COINBASE_ONRAMP_API_KEY ?? "";
const coinbaseApiSecret = import.meta.env.VITE_COINBASE_ONRAMP_API_SECRET ?? "";
const quotePath = "/onramp/v1/buy/quote";
const sessionPath = "/onramp/v1/buy/session";

export class CoinbaseOnrampError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "CoinbaseOnrampError";
    this.status = status;
  }
}

export interface CoinbaseOnrampInput {
  amount: number;
  currency: string;
  walletAddress: string;
  network: string;
  asset: string;
  email?: string;
}

export interface CoinbaseOnrampRequestPayload {
  paymentAmount: string;
  paymentCurrency: string;
  destinationWallet: string;
  destinationNetwork: string;
  destinationAsset: string;
  customerEmail?: string;
}

export function assertCoinbaseSandboxEnabled() {
  if (!HEDERA_IS_DEV) {
    throw new CoinbaseOnrampError(`Coinbase sandbox actions are disabled in ${HEDERA_APP_ENV}.`, 403);
  }
  if (!coinbaseApiKey || !coinbaseApiSecret) {
    throw new CoinbaseOnrampError("Missing Coinbase sandbox API credentials.", 400);
  }
}

export function buildCoinbaseOnrampRequest(input: CoinbaseOnrampInput): CoinbaseOnrampRequestPayload {
  return {
    paymentAmount: input.amount.toFixed(2),
    paymentCurrency: input.currency,
    destinationWallet: input.walletAddress,
    destinationNetwork: input.network,
    destinationAsset: input.asset,
    customerEmail: input.email,
  };
}

async function coinbaseRequest<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  assertCoinbaseSandboxEnabled();
  const response = await fetch(`${coinbaseBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": coinbaseApiKey,
      "x-api-secret": coinbaseApiSecret,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!response.ok) {
    throw new CoinbaseOnrampError((data.message as string) ?? "Coinbase onramp request failed.", response.status);
  }
  return data as T;
}

export async function createCoinbaseOnrampSession(input: CoinbaseOnrampInput): Promise<CoinbaseOnrampSession> {
  const requestPayload = buildCoinbaseOnrampRequest(input);

  const quote = await coinbaseRequest<{ id?: string; quoteId?: string }>(quotePath, requestPayload);
  const quoteId = quote.quoteId ?? quote.id;
  if (!quoteId) {
    throw new CoinbaseOnrampError("Coinbase quote ID missing.", 502);
  }

  const session = await coinbaseRequest<{ id?: string; url?: string; hostedUrl?: string }>(sessionPath, {
    quoteId,
    ...requestPayload,
  });

  const launchUrl = session.hostedUrl ?? session.url;
  if (!launchUrl) {
    throw new CoinbaseOnrampError("Coinbase launch URL missing.", 502);
  }

  return {
    provider: "coinbase",
    referenceId: session.id ?? quoteId,
    launchUrl,
    status: "created",
  };
}

export function launchCoinbaseOnramp(session: CoinbaseOnrampSession) {
  window.open(session.launchUrl, "_blank", "noopener,noreferrer");
}
