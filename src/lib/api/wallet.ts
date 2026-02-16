import { useQuery } from "@tanstack/react-query";
import { restRequest } from "@/lib/supabase/rest";
import { supabaseClient } from "@/lib/supabase/client";
import { UserBalance, UserWalletOverview } from "@/types/supabase";

const walletKey = ["wallet", "balance"] as const;

async function requireUserId() {
  const userId = await supabaseClient.getAuthenticatedUserId();
  if (!userId) {
    throw new Error("No authenticated user found.");
  }
  return userId;
}

export async function fetchWalletBalance(): Promise<UserWalletOverview | null> {
  const userId = await requireUserId();
  let walletRows: Array<{
    hedera_account_id: string | null;
    hedera_public_key: string | null;
    wallet_created_at: string | null;
    balance: string | number | null;
    has_wallet: boolean | null;
  }> = [];

  try {
    walletRows = await restRequest<
      Array<{
        hedera_account_id: string | null;
        hedera_public_key: string | null;
        wallet_created_at: string | null;
        balance: string | number | null;
        has_wallet: boolean | null;
      }>
    >(
      "rpc/get_user_wallet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_uuid: userId }),
      },
      { requireAuth: true },
    );
  } catch {
    // Fall back to the materialized balance view when RPC is unavailable.
  }

  const wallet = walletRows[0];
  if (wallet) {
    const result: UserWalletOverview = {
      user_id: userId,
      balance: String(wallet.balance ?? 0),
      total_transactions: 0,
      last_activity: null,
      hedera_account_id: wallet.hedera_account_id ?? null,
      hedera_public_key: wallet.hedera_public_key ?? null,
      wallet_created_at: wallet.wallet_created_at ?? null,
      has_wallet: Boolean(wallet.has_wallet ?? wallet.hedera_account_id),
    };
    return result;
  }

  const rows = await restRequest<UserBalance[]>(
    `user_balances?select=user_id,balance,total_transactions,last_activity&user_id=eq.${userId}&limit=1`,
  );
  const row = rows[0];
  if (!row) {
    return null;
  }
  const fallback: UserWalletOverview = {
    ...row,
    hedera_account_id: null,
    hedera_public_key: null,
    wallet_created_at: null,
    has_wallet: false,
  };
  return fallback;
}

export function useWalletBalanceQuery() {
  return useQuery({
    queryKey: walletKey,
    queryFn: fetchWalletBalance,
  });
}
