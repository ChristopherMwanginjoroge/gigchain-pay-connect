/**
 * MoonPay On-Ramp Integration
 * 
 * MoonPay provides fiat → crypto purchasing with built-in KYC.
 * Uses URL redirect for widget with signature for security.
 * 
 * Supports USDC on Hedera (usdc_hedera)
 * Docs: https://docs.moonpay.com/
 */

const MOONPAY_API_KEY = import.meta.env.VITE_MOONPAY_API_KEY;
const MOONPAY_ENVIRONMENT = import.meta.env.VITE_MOONPAY_ENVIRONMENT || 
  (import.meta.env.VITE_APP_ENV === "production" ? "production" : "sandbox");

export interface MoonPayConfig {
  /** User's Hedera wallet address (0.0.xxxxx) */
  walletAddress: string;
  /** Amount in fiat currency */
  fiatAmount?: number;
  /** Fiat currency code (USD, KES, etc.) */
  fiatCurrency?: string;
  /** User's email for pre-fill */
  email?: string;
  /** External transaction ID for tracking */
  externalTransactionId?: string;
  /** Redirect URL after purchase */
  redirectURL?: string;
  /** Show wallet address form */
  showWalletAddressForm?: boolean;
}

export interface MoonPayWidgetUrlParams {
  apiKey: string;
  currencyCode: string;
  walletAddress: string;
  baseCurrencyCode?: string;
  baseCurrencyAmount?: string;
  email?: string;
  externalTransactionId?: string;
  redirectURL?: string;
  showWalletAddressForm?: string;
  colorCode?: string;
  theme?: string;
}

/**
 * Build MoonPay widget URL
 * The URL can be used in an iframe or opened in a new window
 */
export function buildMoonPayWidgetUrl(config: MoonPayConfig): string {
  if (!MOONPAY_API_KEY) {
    throw new Error("Missing VITE_MOONPAY_API_KEY environment variable");
  }

  const baseUrl = MOONPAY_ENVIRONMENT === "production" 
    ? "https://buy.moonpay.com"
    : "https://buy-sandbox.moonpay.com";

  const params = new URLSearchParams();
  
  // Required params
  params.set("apiKey", MOONPAY_API_KEY);
  params.set("currencyCode", "usdc_hedera"); // USDC on Hedera
  params.set("walletAddress", config.walletAddress);
  
  // Optional params
  if (config.fiatCurrency) {
    params.set("baseCurrencyCode", config.fiatCurrency.toLowerCase());
  }
  if (config.fiatAmount) {
    params.set("baseCurrencyAmount", config.fiatAmount.toString());
  }
  if (config.email) {
    params.set("email", config.email);
  }
  if (config.externalTransactionId) {
    params.set("externalTransactionId", config.externalTransactionId);
  }
  if (config.redirectURL) {
    params.set("redirectURL", config.redirectURL);
  }
  
  // Lock wallet address
  params.set("showWalletAddressForm", config.showWalletAddressForm ? "true" : "false");
  
  // Theme customization
  params.set("colorCode", "0891b2"); // Cyan-600 to match app
  params.set("theme", "dark");

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Open MoonPay widget in a new window/popup
 */
export function openMoonPayWidget(config: MoonPayConfig): Window | null {
  const url = buildMoonPayWidgetUrl(config);
  
  const width = 500;
  const height = 700;
  const left = (window.innerWidth - width) / 2 + window.screenX;
  const top = (window.innerHeight - height) / 2 + window.screenY;
  
  const popup = window.open(
    url,
    "moonpay-widget",
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
  );
  
  return popup;
}

/**
 * Open MoonPay in an iframe overlay
 */
export function openMoonPayIframe(
  config: MoonPayConfig, 
  containerId: string = "moonpay-container"
): { iframe: HTMLIFrameElement; cleanup: () => void } {
  const url = buildMoonPayWidgetUrl(config);
  
  // Create overlay container
  const overlay = document.createElement("div");
  overlay.id = containerId;
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;
  
  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    font-size: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10000;
  `;
  
  // Create iframe
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.style.cssText = `
    width: 450px;
    height: 650px;
    border: none;
    border-radius: 16px;
    background: #1a1a2e;
  `;
  iframe.allow = "accelerometer; autoplay; camera; gyroscope; payment";
  
  overlay.appendChild(closeBtn);
  overlay.appendChild(iframe);
  document.body.appendChild(overlay);
  
  const cleanup = () => {
    overlay.remove();
  };
  
  closeBtn.onclick = cleanup;
  overlay.onclick = (e) => {
    if (e.target === overlay) cleanup();
  };
  
  return { iframe, cleanup };
}

/**
 * Check if MoonPay is configured
 */
export function isMoonPayAvailable(): boolean {
  return Boolean(MOONPAY_API_KEY);
}

/**
 * Get MoonPay environment
 */
export function getMoonPayEnvironment(): string {
  return MOONPAY_ENVIRONMENT;
}

/**
 * Estimate MoonPay fees (rough estimate - actual shown in widget)
 * MoonPay typically charges 3.5-4.5% + network fees
 */
export function estimateMoonPayFees(fiatAmount: number): {
  estimatedFee: number;
  estimatedReceive: number;
  feePercentage: number;
} {
  // MoonPay fee is typically around 4.5% for cards
  const feePercentage = 0.045;
  const networkFee = 1.00; // Approximate network fee in USD
  
  const estimatedFee = (fiatAmount * feePercentage) + networkFee;
  const estimatedReceive = fiatAmount - estimatedFee;

  return {
    estimatedFee,
    estimatedReceive: Math.max(0, estimatedReceive),
    feePercentage: feePercentage * 100,
  };
}

/**
 * Listen for MoonPay postMessage events
 * MoonPay sends events via postMessage when embedded in iframe
 */
export function listenForMoonPayEvents(callbacks: {
  onTransactionCreated?: (data: MoonPayTransactionData) => void;
  onTransactionCompleted?: (data: MoonPayTransactionData) => void;
  onTransactionFailed?: (data: MoonPayTransactionData) => void;
  onClose?: () => void;
}): () => void {
  const handler = (event: MessageEvent) => {
    // Verify origin
    if (!event.origin.includes("moonpay.com")) return;
    
    const { type, payload } = event.data || {};
    
    switch (type) {
      case "onTransactionCreated":
        callbacks.onTransactionCreated?.(payload);
        break;
      case "onTransactionCompleted":
        callbacks.onTransactionCompleted?.(payload);
        break;
      case "onTransactionFailed":
        callbacks.onTransactionFailed?.(payload);
        break;
      case "onCloseOverlay":
        callbacks.onClose?.();
        break;
    }
  };
  
  window.addEventListener("message", handler);
  
  return () => window.removeEventListener("message", handler);
}

export interface MoonPayTransactionData {
  id: string;
  status: string;
  baseCurrencyAmount: number;
  baseCurrency: { code: string };
  quoteCurrencyAmount: number;
  quoteCurrency: { code: string };
  walletAddress: string;
  cryptoTransactionId?: string;
  externalTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}
