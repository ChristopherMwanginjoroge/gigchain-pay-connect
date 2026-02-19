/**
 * Hashport Bridge Integration
 * Bridge USDC from Base (EVM) to Hedera
 * 
 * Hashport is the primary bridge for Hedera ecosystem.
 * Website: https://www.hashport.network/
 * 
 * Flow:
 * 1. User deposits USDC to Base via Coinbase
 * 2. User approves USDC spending on Hashport contract
 * 3. User initiates bridge from Base to Hedera
 * 4. USDC arrives on Hedera account
 */

// Hashport contract addresses
export const HASHPORT_CONTRACTS = {
  // Base Mainnet
  base: {
    bridge: "0x0000000000000000000000000000000000000000", // TODO: Add actual Hashport Base contract
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC on Base
  },
  // Base Sepolia (testnet)
  "base-sepolia": {
    bridge: "0x0000000000000000000000000000000000000000", // TODO: Add testnet contract
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on Base Sepolia
  },
};

// Hedera token IDs
export const HEDERA_TOKENS = {
  mainnet: {
    usdc: "0.0.456858", // USDC on Hedera Mainnet
  },
  testnet: {
    usdc: "0.0.429274", // USDC on Hedera Testnet
  },
};

export interface BridgeQuote {
  sourceChain: string;
  targetChain: string;
  sourceToken: string;
  targetToken: string;
  amount: string;
  estimatedReceived: string;
  bridgeFee: string;
  estimatedTime: string; // e.g., "5-10 minutes"
}

export interface BridgeTransaction {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  sourceChain: string;
  targetChain: string;
  sourceTxHash?: string;
  targetTxHash?: string;
  amount: string;
  createdAt: number;
}

/**
 * Build Hashport bridge URL for manual bridging
 * Opens Hashport portal with pre-filled parameters
 */
export function buildHashportBridgeUrl(params: {
  sourceChain: string;
  targetAddress: string; // Hedera account ID
  amount?: string;
}): string {
  const baseUrl = "https://app.hashport.network";
  
  // Hashport uses query params for pre-filling
  const searchParams = new URLSearchParams({
    sourceNetwork: params.sourceChain === "base" ? "8453" : "84532", // Base chain IDs
    targetNetwork: "hedera",
    targetAddress: params.targetAddress,
  });
  
  if (params.amount) {
    searchParams.set("amount", params.amount);
  }
  
  return `${baseUrl}?${searchParams.toString()}`;
}

/**
 * Build instructions for manual bridging via Hashport
 */
export function getBridgeInstructions(params: {
  baseAddress: string;
  hederaAddress: string;
  amount: string;
}): string[] {
  return [
    `Your USDC will be sent to your Base address: ${params.baseAddress}`,
    "Once you receive USDC on Base, go to https://app.hashport.network",
    "Connect your Base wallet (MetaMask, Coinbase Wallet, etc.)",
    `Bridge USDC from Base to Hedera address: ${params.hederaAddress}`,
    "The bridge typically takes 5-10 minutes to complete",
    "Your USDC will appear in your GigPay wallet once bridging completes",
  ];
}

/**
 * Estimate bridge fee and time
 */
export function estimateBridgeFee(amount: number): {
  fee: number;
  feePercent: number;
  estimatedReceived: number;
  estimatedTime: string;
} {
  // Hashport typically charges ~0.1-0.5% fee
  const feePercent = 0.3;
  const fee = amount * (feePercent / 100);
  const estimatedReceived = amount - fee;
  
  return {
    fee,
    feePercent,
    estimatedReceived,
    estimatedTime: "5-10 minutes",
  };
}

/**
 * Check if Hashport supports a given chain
 */
export function isBridgeSupported(chain: string): boolean {
  return ["base", "base-sepolia", "ethereum", "polygon", "avalanche"].includes(chain.toLowerCase());
}

/**
 * Open Hashport in a new tab
 */
export function openHashportBridge(params: {
  sourceChain: string;
  targetAddress: string;
  amount?: string;
}): void {
  const url = buildHashportBridgeUrl(params);
  window.open(url, "_blank", "noopener,noreferrer");
}
