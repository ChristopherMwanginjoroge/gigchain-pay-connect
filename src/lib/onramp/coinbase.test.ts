import { describe, expect, it } from "vitest";
import { buildCoinbaseOnrampRequest } from "@/lib/onramp/coinbase";

describe("coinbase onramp mapping", () => {
  it("maps request payload with normalized amount", () => {
    const payload = buildCoinbaseOnrampRequest({
      amount: 250,
      currency: "CAD",
      walletAddress: "0.0.12345",
      network: "hedera-testnet",
      asset: "USDC",
      email: "me@example.com",
    });

    expect(payload).toEqual({
      paymentAmount: "250.00",
      paymentCurrency: "CAD",
      destinationWallet: "0.0.12345",
      destinationNetwork: "hedera-testnet",
      destinationAsset: "USDC",
      customerEmail: "me@example.com",
    });
  });
});
