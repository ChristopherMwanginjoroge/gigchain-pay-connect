import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileQuery } from "@/lib/api/profile";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  buildInvoicePayload,
  buildInvoiceQrImageUrl,
  encodeInvoiceUri,
  signInvoicePayload,
  verifyInvoicePayload,
} from "@/lib/invoice/qr";
import { decryptPrivateKey, loadEncryptedKeyVault } from "@/lib/wallet/keys";

const Invoice = () => {
  const { user } = useAuth();
  const profileQuery = useProfileQuery();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("15");
  const [passphrase, setPassphrase] = useState("");
  const [invoiceUri, setInvoiceUri] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [signatureValid, setSignatureValid] = useState<boolean | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [vault, setVault] = useState<Awaited<ReturnType<typeof loadEncryptedKeyVault>>>(null);

  const profile = profileQuery.data;
  const canGenerate = !!profile?.hedera_account_id && !!profile?.hedera_public_key && !!user?.id;

  useEffect(() => {
    let active = true;

    async function loadVault() {
      if (!user?.id) {
        if (active) {
          setVault(null);
        }
        return;
      }
      const loaded = await loadEncryptedKeyVault(user.id);
      if (active) {
        setVault(loaded);
      }
    }

    loadVault();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const generateInvoice = async () => {
    if (!canGenerate || !user?.id || !profile?.hedera_account_id || !profile.hedera_public_key) {
      toast.error("Wallet must be created before invoice generation.");
      return;
    }

    if (!vault) {
      toast.error("No encrypted wallet key found. Create wallet first.");
      return;
    }

    setIsGenerating(true);
    try {
      const privateKey = await decryptPrivateKey(vault, passphrase);
      const payload = buildInvoicePayload({
        phone,
        amount: Number(amount),
        note,
        issuerAccountId: profile.hedera_account_id,
        expiryMinutes: Number(expiryMinutes),
      });
      const signed = await signInvoicePayload(payload, privateKey);
      const valid = await verifyInvoicePayload(signed, profile.hedera_public_key);
      const uri = encodeInvoiceUri(signed);
      setSignatureValid(valid);
      setInvoiceUri(uri);
      setQrUrl(buildInvoiceQrImageUrl(uri));
      toast.success("Invoice QR generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate invoice.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <section className="app-screen rounded-3xl p-5 md:p-7">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/60">Payment Requests</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-cyan-50">Invoice QR</h1>
        <p className="mt-1 text-sm text-cyan-100/65">Generate signed, phone-linked invoice payloads for testnet payments.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <article className="app-card rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-cyan-100">
              Recipient Phone
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+254712345678"
              className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-cyan-100">
                Amount (USDC)
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-cyan-100">
                Expiry (minutes)
              </Label>
              <Input
                id="expiry"
                value={expiryMinutes}
                onChange={(event) => setExpiryMinutes(event.target.value)}
                type="number"
                min="1"
                max="120"
                className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-cyan-100">
              Note
            </Label>
            <Textarea
              id="note"
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Invoice purpose"
              className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passphrase" className="text-cyan-100">
              Wallet Passphrase
            </Label>
            <Input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              placeholder="Unlock local encrypted key"
              className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
            />
          </div>

          <Button
            type="button"
            className="app-btn-primary rounded-xl border-0"
            disabled={!canGenerate || isGenerating}
            onClick={generateInvoice}
          >
            {isGenerating ? "Generating..." : "Generate Invoice QR"}
          </Button>
          {!canGenerate ? <p className="text-xs text-amber-200">Complete wallet setup first.</p> : null}
        </article>

        <article className="app-card-soft rounded-2xl p-5 space-y-3">
          <h2 className="text-lg font-semibold text-cyan-50">Generated Payload</h2>
          {qrUrl ? <img src={qrUrl} alt="Invoice QR" className="h-56 w-56 rounded-xl border border-cyan-300/20 bg-white p-2" /> : null}
          {signatureValid !== null ? (
            <p className={`text-xs ${signatureValid ? "text-emerald-200" : "text-rose-300"}`}>
              Signature verification: {signatureValid ? "valid" : "invalid"}
            </p>
          ) : null}
          <Textarea
            readOnly
            value={invoiceUri}
            rows={6}
            className="border-cyan-300/25 bg-slate-900/30 text-cyan-50"
            placeholder="Invoice URI will appear here"
          />
          <Button
            type="button"
            variant="outline"
            className="border-cyan-300/30 bg-slate-900/30 text-cyan-100 hover:bg-cyan-300/10"
            disabled={!invoiceUri}
            onClick={async () => {
              await navigator.clipboard.writeText(invoiceUri);
              toast.success("Invoice URI copied.");
            }}
          >
            Copy Invoice URI
          </Button>
        </article>
      </section>
    </div>
  );
};

export default Invoice;
