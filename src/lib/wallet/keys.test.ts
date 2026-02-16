import { describe, expect, it } from "vitest";
import { decryptPrivateKey, encryptPrivateKey } from "@/lib/wallet/keys";

describe("wallet key vault", () => {
  it("encrypts and decrypts private key with the same passphrase", async () => {
    const vault = await encryptPrivateKey("private-key-data", "public-key-data", "super-secret-passphrase");
    const decrypted = await decryptPrivateKey(vault, "super-secret-passphrase");

    expect(vault.publicKey).toBe("public-key-data");
    expect(decrypted).toBe("private-key-data");
  });

  it("rejects wrong passphrase", async () => {
    const vault = await encryptPrivateKey("private-key-data", "public-key-data", "correct-passphrase");

    await expect(decryptPrivateKey(vault, "wrong-passphrase")).rejects.toThrow(
      "Invalid passphrase or corrupted recovery file.",
    );
  });
});
