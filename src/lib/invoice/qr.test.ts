import { describe, expect, it, vi } from "vitest";
import {
  buildInvoicePayload,
  buildInvoiceQrImageUrl,
  decodeInvoiceUri,
  encodeInvoiceUri,
  signInvoicePayload,
} from "@/lib/invoice/qr";

vi.mock("@/lib/hedera/client", () => ({
  signMessageWithPrivateKey: vi.fn(async () => new Uint8Array([1, 2, 3])),
  verifyMessageWithPublicKey: vi.fn(async () => true),
}));

describe("invoice qr helpers", () => {
  it("builds payload with expiry and signs it", async () => {
    const payload = buildInvoicePayload({
      phone: "+254712345678",
      amount: 42.5,
      note: "Invoice",
      issuerAccountId: "0.0.12345",
      expiryMinutes: 10,
    });
    expect(payload.currency).toBe("USDC");
    expect(payload.exp).toBeGreaterThan(Date.now());

    const signed = await signInvoicePayload(payload, "private-key");
    expect(signed.algorithm).toBe("Ed25519");
    expect(signed.signature).toBeDefined();
  });

  it("encodes and decodes invoice uri", () => {
    const uri = encodeInvoiceUri({
      payload: {
        v: 1,
        phone: "+254712345678",
        amount: 12,
        currency: "USDC",
        exp: Date.now() + 1000,
        issuerAccountId: "0.0.12345",
        nonce: "abc",
      },
      signature: "abc123",
      algorithm: "Ed25519",
    });

    const decoded = decodeInvoiceUri(uri);
    expect(decoded.payload.phone).toBe("+254712345678");
    expect(buildInvoiceQrImageUrl(uri)).toContain("create-qr-code");
  });
});
