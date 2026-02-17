import { CreateTransactionInput, TransactionMetadata, TransactionRecord, TransactionStatus, TransactionType } from "@/types/supabase";

export interface TransactionInsertPayload {
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency: string;
  title: string;
  description: string | null;
  counterparty: string;
  metadata: TransactionMetadata;
}

export function buildTransactionInsertPayload(input: CreateTransactionInput): TransactionInsertPayload {
  const currency = input.currency ?? "USDC";
  const amount = input.amount.toFixed(6);

  const type: Record<CreateTransactionInput["flow"], TransactionType> = {
    send: "debit",
    deposit: "deposit",
    withdrawal: "withdrawal",
  };

  const title: Record<CreateTransactionInput["flow"], string> = {
    send: `Send to ${input.targetValue}`,
    deposit: `Deposit from ${input.targetType}`,
    withdrawal: `Withdrawal to ${input.targetType}`,
  };

  const description =
    input.note?.trim() ||
    `${input.flow.charAt(0).toUpperCase() + input.flow.slice(1)} request via ${input.targetType.toLowerCase()}`;

  return {
    type: type[input.flow],
    status: "pending",
    amount,
    currency,
    title: title[input.flow],
    description,
    counterparty: input.targetValue,
    metadata: {
      source: "web",
      flow: input.flow,
      targetType: input.targetType,
      targetValue: input.targetValue,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    },
  };
}

export function statusVariant(status: TransactionRecord["status"]) {
  if (status === "completed") {
    return "bg-green-100 text-green-700";
  }
  if (status === "failed" || status === "cancelled") {
    return "bg-red-100 text-red-700";
  }
  if (status === "processing") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-slate-100 text-slate-700";
}
