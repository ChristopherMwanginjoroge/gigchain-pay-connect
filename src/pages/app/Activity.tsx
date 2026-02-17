import { ArrowDownLeft, ArrowUpRight, Clock3, RefreshCcw } from "lucide-react";
import { useHederaTransactionsQuery } from "@/lib/api/hedera";
import { useProfileQuery } from "@/lib/api/profile";
import { useTransactionsQuery } from "@/lib/api/transactions";

const Activity = () => {
  const transactionsQuery = useTransactionsQuery();
  const profileQuery = useProfileQuery();
  const hederaTransactionsQuery = useHederaTransactionsQuery(profileQuery.data?.hedera_account_id, 10);
  const transactions = transactionsQuery.data ?? [];
  const chainTransactions = hederaTransactionsQuery.data ?? [];
  const pendingCount = transactions.filter((item) => item.status === "pending" || item.status === "processing").length;

  const statusClass: Record<string, string> = {
    pending: "border-amber-300/40 bg-amber-300/15 text-amber-100",
    processing: "border-blue-300/40 bg-blue-300/15 text-blue-100",
    completed: "border-emerald-300/40 bg-emerald-300/15 text-emerald-100",
    failed: "border-rose-300/40 bg-rose-300/15 text-rose-100",
    cancelled: "border-rose-300/40 bg-rose-300/15 text-rose-100",
  };

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <section className="app-screen rounded-3xl p-5 md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Transaction Activity</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-cyan-50">History & Status</h1>
        <p className="mt-1 text-sm text-cyan-100/65">Created on web as pending, then updated externally to processing/completed/failed.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/55">Total</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-50">{transactions.length}</p>
          </div>
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/55">Pending / Processing</p>
            <p className="mt-1 text-2xl font-semibold text-amber-100">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/55">Last Sync</p>
            <p className="mt-1 text-sm font-semibold text-cyan-50">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </section>

      <section className="app-card rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-cyan-50">Transaction Feed</h2>
          <span className="inline-flex items-center gap-2 text-xs text-cyan-100/70">
            <RefreshCcw className="h-3.5 w-3.5" />
            live query
          </span>
        </div>

        {transactionsQuery.isLoading ? (
          <p className="mt-4 text-sm text-cyan-100/70">Loading activity...</p>
        ) : null}

        {!transactionsQuery.isLoading && !transactions.length ? (
          <p className="mt-4 rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3 text-sm text-cyan-100/70">
            No transactions found yet.
          </p>
        ) : null}

        {transactions.length ? (
          <div className="mt-4 space-y-2">
            {transactions.map((transaction) => {
              const flow = typeof transaction.metadata?.flow === "string" ? transaction.metadata.flow : transaction.type;
              const isOut = transaction.type === "debit" || transaction.type === "withdrawal";
              return (
                <article key={transaction.id} className="rounded-xl border border-cyan-300/15 bg-slate-950/20 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                          isOut ? "bg-rose-300/20 text-rose-100" : "bg-cyan-300/20 text-cyan-100"
                        }`}
                      >
                        {isOut ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-cyan-50">{transaction.title}</p>
                        <p className="text-xs text-cyan-100/60">{transaction.counterparty ?? "No counterparty"}</p>
                        <p className="mt-1 text-xs text-cyan-100/50">{new Date(transaction.created_at).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-cyan-50">
                        {Number(transaction.amount).toFixed(2)} {transaction.currency}
                      </p>
                      <span className={`mt-1 inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${statusClass[transaction.status]}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-cyan-100/60">
                    <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1">{transaction.type}</span>
                    <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1">{flow}</span>
                    {transaction.hedera_tx_id ? <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-2 py-1">tx: {transaction.hedera_tx_id}</span> : null}
                    {transaction.status === "pending" || transaction.status === "processing" ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        awaiting external processing
                      </span>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </section>

      <section className="app-card-soft rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-cyan-50">Hedera Chain Activity</h2>
          <span className="text-xs text-cyan-100/65">{profileQuery.data?.hedera_account_id ?? "No wallet linked"}</span>
        </div>

        {hederaTransactionsQuery.isLoading ? <p className="mt-3 text-sm text-cyan-100/70">Loading mirror transactions...</p> : null}
        {!hederaTransactionsQuery.isLoading && !chainTransactions.length ? (
          <p className="mt-3 rounded-xl border border-cyan-300/20 bg-slate-950/20 p-3 text-sm text-cyan-100/70">
            No chain transactions available.
          </p>
        ) : null}

        {chainTransactions.length ? (
          <div className="mt-3 space-y-2">
            {chainTransactions.map((tx) => (
              <article key={tx.id} className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cyan-50">{tx.type}</p>
                    <p className="text-xs text-cyan-100/60">{tx.consensusTimestamp || "Pending timestamp"}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-1 text-xs font-semibold ${
                      tx.status === "SUCCESS"
                        ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-100"
                        : tx.status === "FAILED"
                          ? "border-rose-300/40 bg-rose-300/15 text-rose-100"
                          : "border-slate-300/30 bg-slate-300/10 text-slate-100"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-cyan-100/70">tx id: {tx.id}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default Activity;
