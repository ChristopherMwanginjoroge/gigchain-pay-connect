import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeftRight, ArrowUpRight, Coins, Landmark, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfileQuery } from "@/lib/api/profile";
import { useCreateTransactionMutation } from "@/lib/api/transactions";
import { createCoinbaseOnrampSession, launchCoinbaseOnramp } from "@/lib/onramp/coinbase";

const txSchema = z.object({
  flow: z.enum(["send", "deposit", "withdrawal"]),
  amount: z.coerce.number().positive("Amount must be greater than zero."),
  targetType: z.string().min(2, "Target type is required."),
  targetValue: z.string().min(2, "Target value is required."),
  note: z.string().optional(),
});

type TxValues = z.infer<typeof txSchema>;

const flowOptions = [
  { value: "send", label: "Send", icon: ArrowUpRight },
  { value: "deposit", label: "On-ramp", icon: Coins },
  { value: "withdrawal", label: "Off-ramp", icon: ArrowLeftRight },
] as const;

const targetTypeOptions: Record<TxValues["flow"], Array<{ value: string; label: string }>> = {
  send: [
    { value: "phone", label: "Phone" },
    { value: "wallet", label: "Wallet Address" },
    { value: "bank", label: "Bank Account" },
  ],
  deposit: [
    { value: "coinbase", label: "Coinbase On-ramp" },
    { value: "yellow_card", label: "Yellow Card" },
    { value: "bank_card", label: "Card / Apple Pay" },
    { value: "bank_account", label: "Linked Bank Account" },
  ],
  withdrawal: [
    { value: "mpesa", label: "M-Pesa" },
    { value: "bank", label: "Bank Transfer" },
    { value: "paypal", label: "PayPal" },
  ],
};

const NewTransaction = () => {
  const createTransactionMutation = useCreateTransactionMutation();
  const profileQuery = useProfileQuery();
  const [searchParams] = useSearchParams();
  const [coinbasePending, setCoinbasePending] = useState(false);

  const form = useForm<TxValues>({
    resolver: zodResolver(txSchema),
    defaultValues: {
      flow: "send",
      amount: 0,
      targetType: "phone",
      targetValue: "",
      note: "",
    },
  });

  const flow = form.watch("flow");
  const amount = form.watch("amount");
  const targetType = form.watch("targetType");

  useEffect(() => {
    const requestedFlow = searchParams.get("flow");
    const requestedTargetType = searchParams.get("targetType");

    if (requestedFlow === "send" || requestedFlow === "deposit" || requestedFlow === "withdrawal") {
      form.setValue("flow", requestedFlow);
    }
    if (requestedTargetType) {
      form.setValue("targetType", requestedTargetType);
    }
  }, [form, searchParams]);

  useEffect(() => {
    const validOptions = targetTypeOptions[flow];
    if (!validOptions.some((item) => item.value === targetType)) {
      form.setValue("targetType", validOptions[0].value);
    }
  }, [flow, form, targetType]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createTransactionMutation.mutateAsync(values);
      toast.success("Transaction request submitted as pending.");
      form.reset({
        flow: values.flow,
        amount: 0,
        targetType: values.targetType,
        targetValue: "",
        note: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create transaction.");
    }
  });

  const submitLabel =
    flow === "send" ? "Confirm & Send Payment" : flow === "deposit" ? "Continue On-ramp Request" : "Confirm Withdrawal";

  const targetLabel =
    flow === "send"
      ? "Recipient"
      : flow === "deposit"
        ? "Funding Source / Provider Reference"
        : "Destination Account";

  const estimatedKes = Number.isFinite(Number(amount)) ? Number(amount) * 128.5 : 0;
  const estimatedFee = Number.isFinite(Number(amount)) ? Math.max(Number(amount) * 0.003, 0.1) : 0;

  const launchCoinbaseSandbox = async () => {
    if (!profileQuery.data?.hedera_account_id) {
      toast.error("Create wallet first before starting onramp.");
      return;
    }
    if (Number(amount) <= 0) {
      toast.error("Enter an onramp amount before launching Coinbase.");
      return;
    }

    setCoinbasePending(true);
    try {
      const session = await createCoinbaseOnrampSession({
        amount: Number(amount || 0),
        currency: "CAD",
        walletAddress: profileQuery.data.hedera_account_id,
        network: "hedera-testnet",
        asset: "USDC",
        email: profileQuery.data.email ?? undefined,
      });
      launchCoinbaseOnramp(session);
      toast.success(`Coinbase sandbox session created (${session.referenceId}).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to launch Coinbase sandbox.");
    } finally {
      setCoinbasePending(false);
    }
  };

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <section className="app-screen rounded-3xl p-5 md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Payments and Ramps</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-cyan-50">New Request</h1>
        <p className="mt-1 text-sm text-cyan-100/65">
          Initiate send, on-ramp, and off-ramp actions from web. Each request is recorded as pending for external processing.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {flowOptions.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant="outline"
              className={`rounded-xl border ${
                flow === item.value
                  ? "border-cyan-200/60 bg-cyan-300/20 text-cyan-50"
                  : "border-cyan-300/20 bg-slate-950/20 text-cyan-100/80 hover:bg-cyan-300/10"
              }`}
              onClick={() => form.setValue("flow", item.value)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <article className="app-card rounded-2xl p-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-cyan-100">Flow</Label>
              <Select value={flow} onValueChange={(value) => form.setValue("flow", value as TxValues["flow"])}>
                <SelectTrigger className="border-cyan-300/25 bg-slate-900/30 text-cyan-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="deposit">Deposit (On-ramp)</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal (Off-ramp)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-cyan-100">
                Amount (USDC)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.000001"
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 placeholder:text-cyan-100/30"
                {...form.register("amount")}
              />
              {form.formState.errors.amount?.message ? <p className="text-xs text-rose-300">{form.formState.errors.amount.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label className="text-cyan-100">Target Type</Label>
              <Select value={targetType} onValueChange={(value) => form.setValue("targetType", value)}>
                <SelectTrigger className="border-cyan-300/25 bg-slate-900/30 text-cyan-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {targetTypeOptions[flow].map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.targetType?.message ? <p className="text-xs text-rose-300">{form.formState.errors.targetType.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetValue" className="text-cyan-100">
                {targetLabel}
              </Label>
              <Input
                id="targetValue"
                placeholder={flow === "withdrawal" ? "+254712345678" : flow === "deposit" ? "provider ref / account id" : "recipient id"}
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 placeholder:text-cyan-100/30"
                {...form.register("targetValue")}
              />
              {form.formState.errors.targetValue?.message ? <p className="text-xs text-rose-300">{form.formState.errors.targetValue.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-cyan-100">
                Note (Optional)
              </Label>
              <Textarea
                id="note"
                rows={3}
                placeholder="Any routing detail or message"
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 placeholder:text-cyan-100/30"
                {...form.register("note")}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" className="app-btn-primary rounded-xl border-0" disabled={createTransactionMutation.isPending}>
                {createTransactionMutation.isPending ? "Submitting..." : submitLabel}
              </Button>
              {flow === "deposit" && targetType === "coinbase" ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-cyan-300/30 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20"
                  disabled={coinbasePending}
                  onClick={launchCoinbaseSandbox}
                >
                  {coinbasePending ? "Launching..." : "Launch Coinbase Sandbox"}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-cyan-300/30 bg-slate-950/20 text-cyan-100 hover:bg-cyan-300/10"
                asChild
              >
                <Link to="/app/activity">View Activity</Link>
              </Button>
            </div>
          </form>
        </article>

        <article className="app-card-soft rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-cyan-50">
            {flow === "send" ? "Send Payment Preview" : flow === "deposit" ? "Deposit On-ramp Preview" : "M-Pesa Off-ramp Preview"}
          </h2>
          <p className="mt-1 text-xs text-cyan-100/60">Metadata source is fixed to web for all requests.</p>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">Amount</p>
              <p className="mt-1 text-2xl font-semibold text-cyan-50">
                {Number.isFinite(Number(amount)) ? Number(amount || 0).toFixed(2) : "0.00"} USDC
              </p>
              {flow === "withdrawal" ? <p className="text-xs text-emerald-200/80">Estimated payout ≈ {estimatedKes.toLocaleString()} KES</p> : null}
            </div>

            <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3 text-sm text-cyan-100/80">
              <p className="flex items-center gap-2">
                {flow === "send" ? <Smartphone className="h-4 w-4 text-cyan-200" /> : null}
                {flow === "deposit" ? <Landmark className="h-4 w-4 text-cyan-200" /> : null}
                {flow === "withdrawal" ? <Wallet className="h-4 w-4 text-cyan-200" /> : null}
                Target: {targetType}
              </p>
              <p className="mt-2 text-xs text-cyan-100/60">Estimated service/network fee: {estimatedFee.toFixed(2)} USDC</p>
              <p className="mt-1 text-xs text-cyan-100/60">
                Total deduction: {(Number(amount || 0) + estimatedFee).toFixed(2)} USDC
              </p>
            </div>

            <div className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/50">Request Mapping</p>
              <ul className="mt-2 space-y-1 text-xs text-cyan-100/75">
                <li>`type`: {flow === "send" ? "debit" : flow}</li>
                <li>`status`: pending</li>
                <li>`metadata.source`: web</li>
                <li>`metadata.flow`: {flow}</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default NewTransaction;
