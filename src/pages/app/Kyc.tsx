import { useState } from "react";
import { FileCheck2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOCUMENT_TYPES } from "@/lib/kyc";
import { useKycQuery, useSubmitKycMutation } from "@/lib/api/kyc";

const kycSchema = z.object({
  documentType: z.enum(["passport", "national_id", "military_id"]),
});

type KycFormValues = z.infer<typeof kycSchema>;

const Kyc = () => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const kycQuery = useKycQuery();
  const submitKycMutation = useSubmitKycMutation();

  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      documentType: "passport",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!documentFile || !selfieFile) {
      toast.error("Document and selfie files are required.");
      return;
    }

    try {
      await submitKycMutation.mutateAsync({
        documentType: values.documentType,
        documentFile,
        selfieFile,
      });
      toast.success("KYC submitted successfully.");
      setDocumentFile(null);
      setSelfieFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit KYC.");
    }
  });

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <section className="app-screen rounded-3xl p-5 md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Identity Verification</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-cyan-50">KYC Center</h1>
        <p className="mt-1 text-sm text-cyan-100/65">Upload your ID and selfie to unlock full wallet and ramp limits.</p>
        <p className="mt-3 rounded-xl border border-amber-300/35 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
          KYC is currently optional for wallet and transaction actions; status is still recorded for future enforcement.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/15 px-3 py-1 text-xs text-emerald-100">
          <ShieldCheck className="h-4 w-4" />
          Files are stored in private Supabase buckets
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <article className="app-card rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-cyan-50">Submit KYC</h2>
          <p className="mt-1 text-sm text-cyan-100/65">Document max 5MB (jpg/png/pdf). Selfie max 2MB (jpg/png).</p>
          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label className="text-cyan-100">Document Type</Label>
              <Select
                value={form.watch("documentType")}
                onValueChange={(value) => form.setValue("documentType", value as KycFormValues["documentType"])}
              >
                <SelectTrigger className="border-cyan-300/25 bg-slate-900/30 text-cyan-50">
                  <SelectValue placeholder="Choose document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((docType) => (
                    <SelectItem key={docType} value={docType}>
                      {docType.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentFile" className="text-cyan-100">
                Document File
              </Label>
              <Input
                id="documentFile"
                type="file"
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 file:text-cyan-100"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => setDocumentFile(event.target.files?.[0] ?? null)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selfieFile" className="text-cyan-100">
                Selfie File
              </Label>
              <Input
                id="selfieFile"
                type="file"
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50 file:text-cyan-100"
                accept=".jpg,.jpeg,.png"
                onChange={(event) => setSelfieFile(event.target.files?.[0] ?? null)}
              />
            </div>

            <Button type="submit" className="app-btn-primary rounded-xl border-0" disabled={submitKycMutation.isPending}>
              {submitKycMutation.isPending ? "Submitting..." : "Submit KYC"}
            </Button>
          </form>
        </article>

        <article className="app-card-soft rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-50">
            <FileCheck2 className="h-4 w-4 text-cyan-100" />
            KYC History
          </h2>
          {kycQuery.isLoading ? <p className="mt-4 text-sm text-cyan-100/70">Loading KYC records...</p> : null}

          {!kycQuery.isLoading && !kycQuery.data?.length ? (
            <p className="mt-4 rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3 text-sm text-cyan-100/70">No KYC submissions yet.</p>
          ) : null}

          {kycQuery.data?.length ? (
            <ul className="mt-4 space-y-2">
              {kycQuery.data.map((record) => (
                <li key={record.id} className="rounded-xl border border-cyan-300/20 bg-slate-950/25 p-3">
                  <p className="text-sm font-semibold capitalize text-cyan-50">{record.status.replace("_", " ")}</p>
                  <p className="text-xs text-cyan-100/60">
                    {record.document_type} • {new Date(record.created_at).toLocaleString()}
                  </p>
                  {record.rejection_reason ? <p className="mt-1 text-xs text-rose-300">Reason: {record.rejection_reason}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      </section>
    </div>
  );
};

export default Kyc;
