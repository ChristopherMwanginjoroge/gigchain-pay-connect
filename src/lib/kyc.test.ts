import { describe, expect, it } from "vitest";
import { buildStoragePath, validateDocumentFile, validateKycPayload, validateSelfieFile } from "@/lib/kyc";

describe("kyc helpers", () => {
  it("builds a deterministic storage path", () => {
    const result = buildStoragePath("user-123", "my passport.pdf", 1700000000000);
    expect(result).toBe("user-123/1700000000000-my_passport.pdf");
  });

  it("validates supported files and rejects oversized selfie", () => {
    const document = new File(["ok"], "doc.pdf", { type: "application/pdf" });
    const selfie = new File([new Uint8Array(6 * 1024 * 1024)], "selfie.png", { type: "image/png" });

    expect(() => validateDocumentFile(document)).not.toThrow();
    expect(() => validateSelfieFile(selfie)).toThrow("Selfie exceeds 2MB limit.");
  });

  it("validates the full KYC payload", () => {
    const payload = {
      documentType: "passport" as const,
      documentFile: new File(["ok"], "id.jpg", { type: "image/jpeg" }),
      selfieFile: new File(["ok"], "selfie.jpg", { type: "image/jpeg" }),
    };

    expect(() => validateKycPayload(payload)).not.toThrow();
  });
});
