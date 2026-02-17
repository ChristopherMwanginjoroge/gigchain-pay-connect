import { useQuery } from "@tanstack/react-query";
import { getAccountOverview, getAccountTokenBalances, getRecentTransactions } from "@/lib/hedera/mirror";

export function useHederaOverviewQuery(accountId?: string | null) {
  return useQuery({
    queryKey: ["hedera", "overview", accountId],
    queryFn: () => getAccountOverview(accountId as string),
    enabled: !!accountId,
    refetchInterval: 10_000,
  });
}

export function useHederaTokenBalancesQuery(accountId?: string | null) {
  return useQuery({
    queryKey: ["hedera", "tokens", accountId],
    queryFn: () => getAccountTokenBalances(accountId as string),
    enabled: !!accountId,
    refetchInterval: 10_000,
  });
}

export function useHederaTransactionsQuery(accountId?: string | null, limit = 10) {
  return useQuery({
    queryKey: ["hedera", "transactions", accountId, limit],
    queryFn: () => getRecentTransactions(accountId as string, limit),
    enabled: !!accountId,
    refetchInterval: 10_000,
  });
}
