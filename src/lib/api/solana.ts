/**
 * Solana React Query Hooks
 * 
 * Provides cached, reactive queries for Solana balances and account data.
 */

import { useQuery } from "@tanstack/react-query";
import { 
  getSolanaBalance, 
  getSolanaUsdcBalance, 
  getSolanaBalances,
  type SolanaAccountOverview,
  type SolanaUsdcBalance,
  type SolanaBalances,
} from "@/lib/solana/rpc";
import { isValidSolanaAddress } from "@/lib/solana/config";

/**
 * Query keys for Solana data
 */
export const solanaQueryKeys = {
  balance: (address: string) => ["solana", "balance", address] as const,
  usdcBalance: (address: string) => ["solana", "usdc-balance", address] as const,
  allBalances: (address: string) => ["solana", "all-balances", address] as const,
};

/**
 * Fetch SOL balance for a Solana address
 */
export function useSolanaBalanceQuery(address: string | null | undefined) {
  return useQuery<SolanaAccountOverview, Error>({
    queryKey: solanaQueryKeys.balance(address ?? ""),
    queryFn: () => getSolanaBalance(address!),
    enabled: Boolean(address && isValidSolanaAddress(address)),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Refetch every minute
  });
}

/**
 * Fetch USDC balance for a Solana address
 */
export function useSolanaUsdcBalanceQuery(address: string | null | undefined) {
  return useQuery<SolanaUsdcBalance, Error>({
    queryKey: solanaQueryKeys.usdcBalance(address ?? ""),
    queryFn: () => getSolanaUsdcBalance(address!),
    enabled: Boolean(address && isValidSolanaAddress(address)),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Refetch every minute
  });
}

/**
 * Fetch all balances (SOL + USDC) for a Solana address
 */
export function useSolanaBalancesQuery(address: string | null | undefined) {
  return useQuery<SolanaBalances, Error>({
    queryKey: solanaQueryKeys.allBalances(address ?? ""),
    queryFn: () => getSolanaBalances(address!),
    enabled: Boolean(address && isValidSolanaAddress(address)),
    staleTime: 30_000, // 30 seconds
    refetchInterval: 60_000, // Refetch every minute
  });
}

/**
 * Combined hook for convenient multi-chain balance display
 */
export function useSolanaWalletData(address: string | null | undefined) {
  const balancesQuery = useSolanaBalancesQuery(address);
  
  // Parse numeric values for display
  const solAmount = balancesQuery.data?.sol.balanceLamports 
    ? balancesQuery.data.sol.balanceLamports / 1_000_000_000 
    : 0;
  const usdcAmount = balancesQuery.data?.usdc.balanceRaw 
    ? Number(balancesQuery.data.usdc.balanceRaw) / 1_000_000 
    : 0;
  
  return {
    isLoading: balancesQuery.isLoading,
    isError: balancesQuery.isError,
    error: balancesQuery.error,
    refetch: balancesQuery.refetch,
    
    // Balances in a structured format
    balances: balancesQuery.data ? {
      sol: {
        amount: solAmount,
        formatted: balancesQuery.data.sol.balanceSol,
        lamports: balancesQuery.data.sol.balanceLamports,
      },
      usdc: {
        amount: usdcAmount,
        formatted: balancesQuery.data.usdc.balanceUsdc,
        raw: balancesQuery.data.usdc.balanceRaw,
        hasTokenAccount: balancesQuery.data.usdc.hasTokenAccount,
        tokenAccount: balancesQuery.data.usdc.tokenAccount,
      },
    } : null,
    
    // Legacy direct access properties
    solBalance: balancesQuery.data?.sol.balanceSol ?? "0.000000000",
    solBalanceLamports: balancesQuery.data?.sol.balanceLamports ?? 0,
    accountExists: balancesQuery.data?.sol.exists ?? false,
    usdcBalance: balancesQuery.data?.usdc.balanceUsdc ?? "0.00",
    usdcBalanceRaw: balancesQuery.data?.usdc.balanceRaw ?? BigInt(0),
    hasTokenAccount: balancesQuery.data?.usdc.hasTokenAccount ?? false,
    tokenAccount: balancesQuery.data?.usdc.tokenAccount,
  };
}
