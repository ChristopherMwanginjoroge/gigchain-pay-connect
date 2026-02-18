/**
 * Solana RPC Client
 * 
 * Handles all Solana network interactions:
 * - SOL balance queries
 * - USDC (SPL token) balance queries
 * - Account validation
 */

import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount, TokenAccountNotFoundError } from "@solana/spl-token";
import { 
  SOLANA_RPC_URL, 
  SOLANA_USDC_MINT_PUBKEY, 
  SOLANA_USDC_DECIMALS,
  isValidSolanaAddress 
} from "./config";

// Lazy-initialized connection
let _connection: Connection | null = null;

/**
 * Get or create Solana RPC connection
 */
export function getConnection(): Connection {
  if (!_connection) {
    _connection = new Connection(SOLANA_RPC_URL, {
      commitment: "confirmed",
    });
  }
  return _connection;
}

/**
 * Solana account overview
 */
export interface SolanaAccountOverview {
  address: string;
  balanceLamports: number;
  balanceSol: string;
  exists: boolean;
}

/**
 * Get SOL balance for an address
 */
export async function getSolanaBalance(address: string): Promise<SolanaAccountOverview> {
  if (!isValidSolanaAddress(address)) {
    throw new Error(`Invalid Solana address: ${address}`);
  }

  const connection = getConnection();
  const publicKey = new PublicKey(address);
  
  try {
    console.log(`[Solana] Fetching SOL balance for ${address}...`);
    const balanceLamports = await connection.getBalance(publicKey);
    console.log(`[Solana] Balance: ${balanceLamports} lamports (${balanceLamports / LAMPORTS_PER_SOL} SOL)`);
    
    return {
      address,
      balanceLamports,
      balanceSol: (balanceLamports / LAMPORTS_PER_SOL).toFixed(9),
      exists: balanceLamports > 0,
    };
  } catch (error) {
    console.error("[Solana] Failed to fetch balance:", error);
    throw new Error(`Failed to fetch SOL balance for ${address}`);
  }
}

/**
 * USDC token account info
 */
export interface SolanaUsdcBalance {
  address: string;
  tokenAccount: string | null;
  balanceRaw: bigint;
  balanceUsdc: string;
  hasTokenAccount: boolean;
}

/**
 * Get USDC balance for a Solana address
 * Returns 0 if no token account exists (user hasn't received USDC yet)
 */
export async function getSolanaUsdcBalance(address: string): Promise<SolanaUsdcBalance> {
  if (!isValidSolanaAddress(address)) {
    throw new Error(`Invalid Solana address: ${address}`);
  }

  const connection = getConnection();
  const ownerPublicKey = new PublicKey(address);
  
  try {
    // Get the Associated Token Account (ATA) address for USDC
    const ataAddress = await getAssociatedTokenAddress(
      SOLANA_USDC_MINT_PUBKEY,
      ownerPublicKey
    );

    try {
      // Try to get the token account
      const tokenAccount = await getAccount(connection, ataAddress);
      
      const balanceRaw = tokenAccount.amount;
      const balanceUsdc = (Number(balanceRaw) / Math.pow(10, SOLANA_USDC_DECIMALS)).toFixed(2);
      
      return {
        address,
        tokenAccount: ataAddress.toBase58(),
        balanceRaw,
        balanceUsdc,
        hasTokenAccount: true,
      };
    } catch (error) {
      // Token account doesn't exist - user hasn't received USDC yet
      if (error instanceof TokenAccountNotFoundError) {
        return {
          address,
          tokenAccount: null,
          balanceRaw: BigInt(0),
          balanceUsdc: "0.00",
          hasTokenAccount: false,
        };
      }
      throw error;
    }
  } catch (error) {
    console.error("Failed to fetch Solana USDC balance:", error);
    throw new Error(`Failed to fetch USDC balance for ${address}`);
  }
}

/**
 * Combined Solana balances
 */
export interface SolanaBalances {
  sol: SolanaAccountOverview;
  usdc: SolanaUsdcBalance;
}

/**
 * Get all balances for a Solana address (SOL + USDC)
 */
export async function getSolanaBalances(address: string): Promise<SolanaBalances> {
  const [sol, usdc] = await Promise.all([
    getSolanaBalance(address),
    getSolanaUsdcBalance(address),
  ]);
  
  return { sol, usdc };
}

/**
 * Check if a Solana account exists (has been funded with SOL)
 */
export async function accountExists(address: string): Promise<boolean> {
  try {
    const balance = await getSolanaBalance(address);
    return balance.exists;
  } catch {
    return false;
  }
}

/**
 * Get minimum rent exemption for a token account
 * Used to calculate how much SOL is needed to create a USDC token account
 */
export async function getTokenAccountRentExemption(): Promise<number> {
  const connection = getConnection();
  // Token accounts are 165 bytes
  const rentExemption = await connection.getMinimumBalanceForRentExemption(165);
  return rentExemption;
}

/**
 * Format lamports to SOL string
 */
export function lamportsToSol(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(9);
}

/**
 * Format SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}
