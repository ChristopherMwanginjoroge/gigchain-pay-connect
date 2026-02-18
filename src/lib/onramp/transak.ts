/**
 * Transak On-Ramp Integration
 * 
 * Transak provides fiat → crypto purchasing with built-in KYC.
 * Uses their embeddable widget SDK for the best UX.
 * 
 * Docs: https://docs.transak.com/docs/on-ramp-integration-guide
 */

import { HEDERA_NETWORK }  from "@/lib/hedera/config";

// Transak environment based on app settings
const TRANSAK_ENVIRONMENT = import.meta.env.VITE_TRANSAK_ENVIRONMENT || 
  (import.meta.env.VITE_APP_ENV === "production" ? "PRODUCTION" : "STAGING");

const TRANSAK_API_KEY = import.meta.env.VITE_TRANSAK_API_KEY;

export interface TransakConfig {
  /** User's Hedera wallet address (0.0.xxxxx) */
  walletAddress: string;
  /** Amount in fiat currency */
  fiatAmount?: number;
  /** Fiat currency code (USD, KES, etc.) */
  fiatCurrency?: string;
  /** User's email for pre-fill */
  email?: string;
  /** Crypto to purchase (default: USDC) */
  cryptoCurrencyCode?: string;
  /** Partner order ID for tracking (your transaction ID) */
  partnerOrderId?: string;
  /** Custom data to pass through */
  partnerCustomerId?: string;
  /** Callback when order status changes */
  onOrderCreated?: (orderData: TransakOrderData) => void;
  onOrderCompleted?: (orderData: TransakOrderData) => void;
  onOrderFailed?: (orderData: TransakOrderData) => void;
  /** Called when widget is closed */
  onClose?: () => void;
}

export interface TransakOrderData {
  id: string;
  status: TransakOrderStatus;
  fiatCurrency: string;
  fiatAmount: number;
  cryptoCurrency: string;
  cryptoAmount: number;
  walletAddress: string;
  network: string;
  transactionHash?: string;
  partnerOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TransakOrderStatus = 
  | "AWAITING_PAYMENT_FROM_USER"
  | "PAYMENT_DONE_MARKED_BY_USER"
  | "PROCESSING"
  | "PENDING_DELIVERY_FROM_TRANSAK"
  | "ON_HOLD_PENDING_DELIVERY_FROM_TRANSAK"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "REFUNDED"
  | "EXPIRED";

export type TransakEventName =
  | "TRANSAK_WIDGET_INITIALISED"
  | "TRANSAK_WIDGET_OPEN"
  | "TRANSAK_WIDGET_CLOSE"
  | "TRANSAK_ORDER_CREATED"
  | "TRANSAK_ORDER_SUCCESSFUL"
  | "TRANSAK_ORDER_FAILED"
  | "TRANSAK_ORDER_CANCELLED";

/**
 * Initialize and open the Transak widget
 * Returns a cleanup function to close the widget
 */
export async function openTransakWidget(config: TransakConfig): Promise<() => void> {
  if (!TRANSAK_API_KEY) {
    throw new Error("Missing VITE_TRANSAK_API_KEY environment variable");
  }

  // Dynamically import Transak SDK (v4 uses named export)
  const { Transak } = await import("@transak/transak-sdk");

  // Build the hosted URL with all parameters
  const widgetUrl = buildTransakHostedUrl(config);

  const transak = new Transak({
    widgetUrl,
    referrer: window.location.origin,
    widgetHeight: "650px",
    widgetWidth: "450px",
    themeColor: "0891b2",
  });

  // Set up event handlers using static methods
  Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData: unknown) => {
    console.log("Transak order created:", orderData);
    const data = orderData as { status: TransakOrderData };
    config.onOrderCreated?.(data.status);
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: unknown) => {
    console.log("Transak order completed:", orderData);
    const data = orderData as { status: TransakOrderData };
    config.onOrderCompleted?.(data.status);
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (orderData: unknown) => {
    console.log("Transak order failed:", orderData);
    const data = orderData as { status: TransakOrderData };
    config.onOrderFailed?.(orderData as TransakOrderData);
  });

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
    console.log("Transak widget closed");
    config.onClose?.();
    transak.cleanup();
  });

  // Open the widget
  transak.init();

  // Return cleanup function
  return () => {
    transak.cleanup();
  };
}

/**
 * Build a hosted Transak URL for redirect flow (alternative to widget)
 */
export function buildTransakHostedUrl(config: TransakConfig): string {
  if (!TRANSAK_API_KEY) {
    throw new Error("Missing VITE_TRANSAK_API_KEY environment variable");
  }

  const baseUrl = TRANSAK_ENVIRONMENT === "PRODUCTION" 
    ? "https://global.transak.com"
    : "https://global-stg.transak.com";

  const params = new URLSearchParams({
    apiKey: TRANSAK_API_KEY,
    network: "hedera",
    cryptoCurrencyCode: config.cryptoCurrencyCode || "USDC",
    walletAddress: config.walletAddress,
    disableWalletAddressForm: "true",
    defaultFiatCurrency: config.fiatCurrency || "USD",
    themeColor: "0891b2",
    hideMenu: "true",
    productsAvailed: "BUY",
  });

  if (config.fiatAmount) {
    params.set("defaultFiatAmount", config.fiatAmount.toString());
  }
  if (config.email) {
    params.set("email", config.email);
  }
  if (config.partnerOrderId) {
    params.set("partnerOrderId", config.partnerOrderId);
  }
  if (config.partnerCustomerId) {
    params.set("partnerCustomerId", config.partnerCustomerId);
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Get supported fiat currencies for a country
 */
export function getTransakSupportedFiat(countryCode: string): string {
  const countryFiatMap: Record<string, string> = {
    US: "USD",
    KE: "KES",
    NG: "NGN",
    GH: "GHS",
    ZA: "ZAR",
    UG: "UGX",
    TZ: "TZS",
    RW: "RWF",
    GB: "GBP",
    EU: "EUR",
    CA: "CAD",
    AU: "AUD",
    IN: "INR",
  };

  return countryFiatMap[countryCode?.toUpperCase()] || "USD";
}

/**
 * Estimate Transak fees (rough estimate - actual shown in widget)
 * Transak typically charges 1-3% + network fees
 */
export function estimateTransakFees(fiatAmount: number): {
  estimatedFee: number;
  estimatedReceive: number;
  feePercentage: number;
} {
  // Transak fee is typically around 1-3%
  const feePercentage = 0.025; // 2.5% average
  const networkFee = 0.50; // Approximate network fee in USD
  
  const estimatedFee = (fiatAmount * feePercentage) + networkFee;
  const estimatedReceive = fiatAmount - estimatedFee;

  return {
    estimatedFee,
    estimatedReceive: Math.max(0, estimatedReceive),
    feePercentage: feePercentage * 100,
  };
}

/**
 * Check if Transak is available (API key configured)
 */
export function isTransakAvailable(): boolean {
  return Boolean(TRANSAK_API_KEY);
}

/**
 * Get Transak environment
 */
export function getTransakEnvironment(): string {
  return TRANSAK_ENVIRONMENT;
}
