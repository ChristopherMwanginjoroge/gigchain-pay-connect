/**
 * Paycrest On-Ramp Integration
 * 
 * Paycrest provides fiat → crypto on-ramp for African markets (KES, UGX, TZS, etc.)
 * Uses API-based integration with hosted checkout.
 * 
 * Docs: https://docs.paycrest.io/
 */

const PAYCREST_API_KEY = import.meta.env.VITE_PAYCREST_API_KEY;
const PAYCREST_API_SECRET = import.meta.env.VITE_PAYCREST_API_SECRET;
const PAYCREST_BASE_URL = import.meta.env.VITE_PAYCREST_BASE_URL || "https://api.paycrest.io/v1";

export class PaycrestError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "PaycrestError";
    this.status = status;
  }
}

export interface PaycrestConfig {
  /** User's wallet address (Solana or Hedera) */
  walletAddress: string;
  /** Network (solana, hedera, etc.) */
  network: string;
  /** Crypto currency to purchase (USDC, USDT, etc.) */
  cryptoCurrency: string;
  /** Fiat currency code (KES, UGX, TZS, etc.) */
  fiatCurrency: string;
  /** Amount in fiat currency */
  fiatAmount?: number;
  /** User's email for notifications */
  email?: string;
  /** User's phone number */
  phone?: string;
  /** Partner reference for tracking */
  partnerReference?: string;
}

export interface PaycrestRate {
  sourceCurrency: string;
  targetCurrency: string;
  rate: number;
  fee: number;
  maxAmount: number;
  minAmount: number;
}

export interface PaycrestSession {
  sessionId: string;
  checkoutUrl: string;
  expiresAt: string;
}

/**
 * Check if Paycrest is configured
 */
export function isPaycrestConfigured(): boolean {
  return Boolean(PAYCREST_API_KEY && PAYCREST_API_SECRET);
}

/**
 * Get exchange rate from Paycrest
 */
export async function getPaycrestRate(
  cryptoCurrency: string,
  fiatCurrency: string
): Promise<PaycrestRate> {
  if (!PAYCREST_API_KEY) {
    throw new PaycrestError("Paycrest API key not configured", 400);
  }

  const response = await fetch(
    `${PAYCREST_BASE_URL}/provider/rates/${cryptoCurrency}/${fiatCurrency}`,
    {
      headers: {
        "API-Key": PAYCREST_API_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PaycrestError(
      error.message || `Failed to fetch rate: ${response.statusText}`,
      response.status
    );
  }

  return await response.json();
}

/**
 * Create a Paycrest checkout session
 */
export async function createPaycrestSession(
  config: PaycrestConfig
): Promise<PaycrestSession> {
  if (!PAYCREST_API_KEY || !PAYCREST_API_SECRET) {
    throw new PaycrestError("Paycrest credentials not configured", 400);
  }

  const requestBody = {
    walletAddress: config.walletAddress,
    network: config.network,
    cryptoCurrency: config.cryptoCurrency,
    fiatCurrency: config.fiatCurrency,
    fiatAmount: config.fiatAmount,
    email: config.email,
    phone: config.phone,
    partnerReference: config.partnerReference,
  };

  const response = await fetch(`${PAYCREST_BASE_URL}/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Key": PAYCREST_API_KEY,
      "API-Secret": PAYCREST_API_SECRET,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new PaycrestError(
      error.message || `Failed to create session: ${response.statusText}`,
      response.status
    );
  }

  return await response.json();
}

/**
 * Build hosted checkout URL for simple redirect flow
 */
export function buildPaycrestCheckoutUrl(config: PaycrestConfig): string {
  const params = new URLSearchParams({
    wallet: config.walletAddress,
    network: config.network,
    crypto: config.cryptoCurrency,
    fiat: config.fiatCurrency,
  });

  if (config.fiatAmount) {
    params.set("amount", config.fiatAmount.toFixed(2));
  }
  if (config.email) {
    params.set("email", config.email);
  }
  if (config.phone) {
    params.set("phone", config.phone);
  }
  if (config.partnerReference) {
    params.set("ref", config.partnerReference);
  }

  // Use hosted URL if available, otherwise construct from base
  const hostedUrl = import.meta.env.VITE_PAYCREST_HOSTED_URL || 
    `${PAYCREST_BASE_URL.replace('/v1', '')}/checkout`;
  
  return `${hostedUrl}?${params.toString()}`;
}

/**
 * Launch Paycrest checkout in a new window
 */
export function launchPaycrestCheckout(config: PaycrestConfig): Window | null {
  const url = buildPaycrestCheckoutUrl(config);
  return window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Estimate Paycrest fees (rough estimate - actual shown in checkout)
 */
export function estimatePaycrestFees(fiatAmount: number): {
  estimatedFee: number;
  estimatedReceive: number;
  feePercentage: number;
} {
  // Paycrest fee is typically around 2-3% for mobile money
  const feePercentage = 0.025;
  const estimatedFee = fiatAmount * feePercentage;
  const estimatedReceive = fiatAmount - estimatedFee;

  return {
    estimatedFee,
    estimatedReceive: Math.max(0, estimatedReceive),
    feePercentage: feePercentage * 100,
  };
}

/**
 * Get supported fiat currencies
 */
export function getPaycrestSupportedFiat(): string[] {
  return ["KES", "UGX", "TZS", "RWF", "NGN", "GHS"];
}

/**
 * Get supported crypto currencies
 */
export function getPaycrestSupportedCrypto(): string[] {
  return ["USDC", "USDT", "SOL"];
}
