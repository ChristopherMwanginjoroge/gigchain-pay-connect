import { signMessageWithPrivateKey, verifyMessageWithPublicKey } from "@/lib/hedera/client";
import { InvoicePayload, SignedInvoicePayload } from "@/types/supabase";

function toBase64(bytes: Uint8Array) {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function canonicalize(payload: InvoicePayload) {
  return JSON.stringify(payload);
}

export function buildInvoicePayload(input: {
  phone: string;
  amount: number;
  note?: string;
  issuerAccountId: string;
  expiryMinutes: number;
}): InvoicePayload {
  return {
    v: 1,
    phone: input.phone,
    amount: Number(input.amount.toFixed(2)),
    currency: "USDC",
    note: input.note?.trim() || undefined,
    exp: Date.now() + input.expiryMinutes * 60_000,
    issuerAccountId: input.issuerAccountId,
    nonce: crypto.randomUUID(),
  };
}

export async function signInvoicePayload(payload: InvoicePayload, privateKey: string): Promise<SignedInvoicePayload> {
  const message = new TextEncoder().encode(canonicalize(payload));
  const signature = await signMessageWithPrivateKey(privateKey, message);
  return {
    payload,
    signature: toBase64(signature),
    algorithm: "Ed25519",
  };
}

export async function verifyInvoicePayload(signed: SignedInvoicePayload, publicKey: string) {
  if (signed.payload.exp < Date.now()) {
    return false;
  }
  const message = new TextEncoder().encode(canonicalize(signed.payload));
  return verifyMessageWithPublicKey(publicKey, message, fromBase64(signed.signature));
}

export function encodeInvoiceUri(signed: SignedInvoicePayload) {
  return `gigpay://invoice?data=${encodeURIComponent(btoa(JSON.stringify(signed)))}`;
}

export function decodeInvoiceUri(uri: string): SignedInvoicePayload {
  const parsed = new URL(uri);
  const data = parsed.searchParams.get("data");
  if (!data) {
    throw new Error("Invalid invoice uri.");
  }
  return JSON.parse(atob(decodeURIComponent(data))) as SignedInvoicePayload;
}

export function buildInvoiceQrImageUrl(invoiceUri: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(invoiceUri)}`;
}
