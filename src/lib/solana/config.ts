/**
 * Solana Network Configuration
 * 
 * Supports devnet for testing and mainnet-beta for production.
 * USDC on Solana is an SPL token with a specific mint address.
 */

import { PublicKey, clusterApiUrl } from "@solana/web3.js";

// Network configuration from environment
export const SOLANA_NETWORK = import.meta.env.VITE_SOLANA_NETWORK || "devnet";

// RPC endpoint - use custom RPC for production for better reliability
export const SOLANA_RPC_URL = import.meta.env.VITE_SOLANA_RPC_URL || 
  clusterApiUrl(SOLANA_NETWORK as "devnet" | "mainnet-beta" | "testnet");

// USDC mint addresses per network
const USDC_MINTS: Record<string, string> = {
  "mainnet-beta": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Official Circle USDC on Solana mainnet
  "devnet": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet USDC (faucet available)
  "testnet": "CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp", // Testnet USDC
};

// Get USDC mint for current network (can be overridden via env)
export const SOLANA_USDC_MINT = import.meta.env.VITE_SOLANA_USDC_MINT || 
  USDC_MINTS[SOLANA_NETWORK] || USDC_MINTS["devnet"];

// Validate and create PublicKey for USDC mint
export const SOLANA_USDC_MINT_PUBKEY = new PublicKey(SOLANA_USDC_MINT);

// SPL Token Program ID (standard)
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

// Associated Token Program ID
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

// USDC has 6 decimals on Solana (same as Hedera)
export const SOLANA_USDC_DECIMALS = 6;

// SOL has 9 decimals (lamports)
export const SOLANA_DECIMALS = 9;

/**
 * Network display names
 */
export const SOLANA_NETWORK_DISPLAY: Record<string, string> = {
  "mainnet-beta": "Solana Mainnet",
  "devnet": "Solana Devnet",
  "testnet": "Solana Testnet",
};

/**
 * Get human-readable network name
 */
export function getSolanaNetworkDisplay(): string {
  return SOLANA_NETWORK_DISPLAY[SOLANA_NETWORK] || SOLANA_NETWORK;
}

/**
 * Check if running on mainnet
 */
export function isSolanaMainnet(): boolean {
  return SOLANA_NETWORK === "mainnet-beta";
}

/**
 * Solana Explorer URLs
 */
export function getSolanaExplorerUrl(type: "address" | "tx", value: string): string {
  const base = "https://explorer.solana.com";
  const cluster = SOLANA_NETWORK === "mainnet-beta" ? "" : `?cluster=${SOLANA_NETWORK}`;
  
  switch (type) {
    case "address":
      return `${base}/address/${value}${cluster}`;
    case "tx":
      return `${base}/tx/${value}${cluster}`;
    default:
      return `${base}/${value}${cluster}`;
  }
}

/**
 * Validate Solana address format (base58, 32-44 chars)
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    if (!address || address.length < 32 || address.length > 44) {
      return false;
    }
    // Try to create a PublicKey - will throw if invalid
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
