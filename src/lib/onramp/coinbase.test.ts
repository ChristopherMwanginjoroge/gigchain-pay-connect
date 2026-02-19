import { describe, expect, it } from "vitest";
import { buildCoinbaseOnrampQuoteRequest, countryByFiat } from "@/lib/onramp/coinbase";

describe("coinbase onramp mapping", () => {
  it("maps request payload with correct API field names", () => {
    const payload = buildCoinbaseOnrampQuoteRequest({
      amount: 250,
      currency: "CAD",
      walletAddress: "0.0.12345",
      network: "hedera-testnet",
      asset: "USDC",
      country: "CA",
      paymentMethod: "CARD",
    });

    expect(payload).toMatchObject({
      country: "CA",
      paymentAmount: "250.00",
      paymentCurrency: "CAD",
      paymentMethod: "CARD",
      purchaseCurrency: "USDC",
      purchaseNetwork: "hedera-testnet",
      destinationAddress: "0.0.12345",
    });
  });

  it("maps fiat currency to country code", () => {
    expect(countryByFiat["KES"]).toBe("KE");
    expect(countryByFiat["USD"]).toBe("US");
    expect(countryByFiat["CAD"]).toBe("CA");
  });
});
