import { HEDERA_APP_ENV, HEDERA_IS_DEV } from "@/lib/hedera/config";
import { CoinbaseOnrampSession } from "@/types/supabase";

// Coinbase CDP Project/App ID for widget URL approach
const coinbaseAppId = import.meta.env.VITE_COINBASE_ONRAMP_APP_ID ?? import.meta.env.VITE_COINBASE_ONRAMP_API_KEY ?? "";

// Supabase URL for edge function calls
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// Widget URL base
const coinbaseWidgetBaseUrl = "https://pay.coinbase.com/buy/select-asset";

// Supported networks for Coinbase Onramp
type CoinbaseNetwork = "base" | "solana";

export class CoinbaseOnrampError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "CoinbaseOnrampError";
    this.status = status;
  }
}

/**
 * Check if Coinbase is properly configured
 */
export function isCoinbaseConfigured(): boolean {
  return !!coinbaseAppId;
}

/**
 * Simple URL builder for Coinbase Pay - direct redirect approach
 */
export function buildCoinbaseOnrampUrl(params: {
  walletAddress: string;
  network: "solana";
  asset: string;
  fiatAmount?: number;
  fiatCurrency?: string;
}): string {
  if (!coinbaseAppId) {
    throw new CoinbaseOnrampError("Missing Coinbase App ID. Set VITE_COINBASE_ONRAMP_APP_ID.", 400);
  }

  // Coinbase network identifiers
  const networkMap: Record<string, string> = {
    solana: "solana",
    base: "base",
  };
  const blockchain = networkMap[params.network] ?? "solana";

  // addresses is an object mapping wallet address to array of blockchains
  const addresses = JSON.stringify({
    [params.walletAddress]: [blockchain],
  });

  // Assets is a simple array of token symbols
  const assets = JSON.stringify([params.asset]);

  // Build URL with query params
  const urlParams = new URLSearchParams({
    appId: coinbaseAppId,
    addresses,
    assets,
    defaultAsset: params.asset,
    defaultNetwork: blockchain,
  });

  if (params.fiatAmount) {
    urlParams.set("presetFiatAmount", params.fiatAmount.toFixed(2));
  }
  if (params.fiatCurrency) {
    urlParams.set("fiatCurrency", params.fiatCurrency);
  }

  return `${coinbaseWidgetBaseUrl}?${urlParams.toString()}`;
}

export interface CoinbaseOnrampInput {
  amount: number;
  currency: string;
  walletAddress: string; // Base/EVM address for Coinbase deposit
  network: string; // Now should be "base" or "base-sepolia"
  asset: string;
  country: string;
  paymentMethod: string;
  hederaAddress?: string; // Hedera address for bridge destination
  clientIp?: string;
}

export interface CoinbaseOnrampQuotePayload {
  country: string;
  paymentAmount: string;
  paymentCurrency: string;
  paymentMethod: string;
  purchaseCurrency: string;
  purchaseNetwork: string;
  destinationAddress: string;
  clientIp?: string;
}

// Map fiat currency to ISO country code
export const countryByFiat: Record<string, string> = {
  KES: "KE",
  UGX: "UG",
  TZS: "TZ",
  RWF: "RW",
  CAD: "CA",
  GBP: "GB",
  EUR: "DE",
  USD: "US",
};

export function assertCoinbaseSandboxEnabled() {
  if (!HEDERA_IS_DEV) {
    throw new CoinbaseOnrampError(`Coinbase sandbox actions are disabled in ${HEDERA_APP_ENV}.`, 403);
  }
  if (!coinbaseAppId) {
    throw new CoinbaseOnrampError("Missing Coinbase App ID. Set VITE_COINBASE_ONRAMP_APP_ID or VITE_COINBASE_ONRAMP_API_KEY.", 400);
  }
}

export function buildCoinbaseOnrampQuoteRequest(input: CoinbaseOnrampInput): CoinbaseOnrampQuotePayload {
  return {
    country: input.country,
    paymentAmount: input.amount.toFixed(2),
    paymentCurrency: input.currency,
    paymentMethod: input.paymentMethod,
    purchaseCurrency: input.asset,
    purchaseNetwork: input.network,
    destinationAddress: input.walletAddress,
    clientIp: input.clientIp,
  };
}

/**
 * Build Coinbase Pay Widget URL for client-side onramp.
 * Uses Base network since Hedera is not directly supported by Coinbase.
 * Users will receive USDC on Base and need to bridge to Hedera.
 */
export function buildCoinbaseWidgetUrl(input: CoinbaseOnrampInput, sessionToken?: string): string {
  assertCoinbaseSandboxEnabled();

  // Use Base network (Hedera not supported by Coinbase)
  const blockchain = "base";

  // addresses is an object mapping wallet address to array of blockchains
  // e.g. {"0x1234...": ["base"]}
  const addresses = JSON.stringify({
    [input.walletAddress]: [blockchain],
  });

  // Assets is a simple array of token symbols
  const assets = JSON.stringify([input.asset]);

  // Build URL with query params
  const params = new URLSearchParams({
    appId: coinbaseAppId,
    addresses,
    assets,
    defaultAsset: input.asset,
    defaultNetwork: blockchain,
    defaultPaymentMethod: input.paymentMethod.toLowerCase(),
    fiatCurrency: input.currency,
    presetFiatAmount: input.amount.toFixed(2),
  });

  // Add sessionToken if provided (required for Secure Initialization)
  if (sessionToken) {
    params.set("sessionToken", sessionToken);
  }

  return `${coinbaseWidgetBaseUrl}?${params.toString()}`;
}

/**
 * Fetch a One-Click-Buy URL from the Supabase Edge Function.
 * Uses Coinbase CDP Platform API v2 onramp/sessions endpoint.
 */
async function createCoinbaseSession(
  destinationAddress: string,
  destinationNetwork: string,
  purchaseCurrency: string,
  options?: {
    paymentAmount?: number;
    paymentCurrency?: string;
    paymentMethod?: string;
    country?: string;
    partnerUserRef?: string;
  }
): Promise<{ url: string; quote?: any }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new CoinbaseOnrampError("Missing Supabase configuration for session generation.", 400);
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/coinbase-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ 
      destinationAddress,
      destinationNetwork,
      purchaseCurrency,
      paymentAmount: options?.paymentAmount?.toFixed(2),
      paymentCurrency: options?.paymentCurrency,
      paymentMethod: options?.paymentMethod,
      country: options?.country,
      partnerUserRef: options?.partnerUserRef,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new CoinbaseOnrampError(
      typeof data.error === "string" ? data.error : JSON.stringify(data.error) || "Failed to create Coinbase session",
      response.status
    );
  }

  // Edge function returns { url: "...", quote: {...} }
  if (!data.url) {
    throw new CoinbaseOnrampError("No session URL returned from server", 502);
  }

  return {
    url: data.url,
    quote: data.quote,
  };
}

export async function createCoinbaseOnrampSession(input: CoinbaseOnrampInput): Promise<CoinbaseOnrampSession & { requiresBridge: boolean; hederaAddress?: string }> {
  // Map network identifiers to Coinbase blockchain names
  const blockchainMap: Record<string, string> = {
    "solana": "solana",
  };
  const blockchain = blockchainMap[input.network] ?? input.network;
  const requiresBridge = blockchain !== "solana"; // Solana is direct, Base requires bridge to Hedera

  // Create One-Click-Buy session using CDP Platform API
  const session = await createCoinbaseSession(
    input.walletAddress,
    blockchain,
    input.asset,
    {
      paymentAmount: input.amount,
      paymentCurrency: input.currency,
      paymentMethod: input.paymentMethod,
      country: input.country,
      partnerUserRef: input.walletAddress, // Use wallet as unique user ID
    }
  );

  const referenceId = `cb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    provider: "coinbase",
    referenceId,
    launchUrl: session.url,
    status: "created",
    requiresBridge,
    hederaAddress: input.hederaAddress,
  };
}

/**
 * Build Coinbase widget URL with session token for any supported network
 */
function buildCoinbaseWidgetUrlWithToken(input: CoinbaseOnrampInput, blockchain: string, sessionToken: string): string {
  const addresses = JSON.stringify({
    [input.walletAddress]: [blockchain],
  });
  const assets = JSON.stringify([input.asset]);

  const params = new URLSearchParams({
    appId: coinbaseAppId,
    addresses,
    assets,
    defaultAsset: input.asset,
    defaultNetwork: blockchain,
    defaultPaymentMethod: input.paymentMethod.toLowerCase(),
    fiatCurrency: input.currency,
    presetFiatAmount: input.amount.toFixed(2),
    sessionToken,
  });

  return `${coinbaseWidgetBaseUrl}?${params.toString()}`;
}

export function launchCoinbaseOnramp(session: CoinbaseOnrampSession) {
  window.open(session.launchUrl, "_blank", "noopener,noreferrer");
}
