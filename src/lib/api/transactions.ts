import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { restRequest } from "@/lib/supabase/rest";
import { supabaseClient } from "@/lib/supabase/client";
import { CreateTransactionInput, TransactionRecord, TransactionStatus } from "@/types/supabase";
import { buildTransactionInsertPayload } from "@/lib/transactions";

const transactionsKey = ["transactions", "list"] as const;

async function requireUserId() {
  const userId = await supabaseClient.getAuthenticatedUserId();
  if (!userId) {
    throw new Error("No authenticated user found.");
  }
  return userId;
}

export async function fetchTransactions(): Promise<TransactionRecord[]> {
  const userId = await requireUserId();
  return restRequest<TransactionRecord[]>(`transactions?select=*&user_id=eq.${userId}&order=created_at.desc`);
}

export async function createTransaction(input: CreateTransactionInput): Promise<TransactionRecord> {
  if (input.amount <= 0) {
    throw new Error("Amount must be greater than zero.");
  }

  const userId = await requireUserId();
  const payload = buildTransactionInsertPayload(input);
  const rows = await restRequest<TransactionRecord[]>(
    "transactions?select=*",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: userId,
        ...payload,
      }),
    },
  );

  if (!rows[0]) {
    throw new Error("Transaction request was not created.");
  }

  return rows[0];
}

export async function updateTransactionStatus(input: {
  id: string;
  status: TransactionStatus;
  description?: string | null;
  hedera_tx_id?: string | null;
  metadata?: Record<string, unknown> | null;
}): Promise<TransactionRecord | null> {
  const userId = await requireUserId();
  const rows = await restRequest<TransactionRecord[]>(
    `transactions?id=eq.${input.id}&user_id=eq.${userId}&select=*`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: input.status,
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.hedera_tx_id !== undefined ? { hedera_tx_id: input.hedera_tx_id } : {}),
        ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
      }),
    },
  );

  return rows[0] ?? null;
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsKey,
    queryFn: fetchTransactions,
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKey });
      queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
    },
  });
}

export function useUpdateTransactionStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsKey });
      queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
    },
  });
}
