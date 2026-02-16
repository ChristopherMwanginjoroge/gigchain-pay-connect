import { describe, expect, it } from "vitest";
import { buildTransactionInsertPayload } from "@/lib/transactions";

describe("buildTransactionInsertPayload", () => {
  it("maps send flow into debit pending payload", () => {
    const payload = buildTransactionInsertPayload({
      flow: "send",
      amount: 12.5,
      targetType: "phone",
      targetValue: "+254712345678",
      note: "Invoice 102",
    });

    expect(payload.type).toBe("debit");
    expect(payload.status).toBe("pending");
    expect(payload.amount).toBe("12.500000");
    expect(payload.currency).toBe("USDC");
    expect(payload.counterparty).toBe("+254712345678");
    expect(payload.metadata).toEqual({
      source: "web",
      flow: "send",
      targetType: "phone",
      targetValue: "+254712345678",
      note: "Invoice 102",
    });
  });

  it("maps withdrawal flow and builds default description when note is omitted", () => {
    const payload = buildTransactionInsertPayload({
      flow: "withdrawal",
      amount: 1.25,
      targetType: "bank",
      targetValue: "KE123456",
    });

    expect(payload.type).toBe("withdrawal");
    expect(payload.description).toContain("Withdrawal request");
    expect(payload.metadata).toEqual({
      source: "web",
      flow: "withdrawal",
      targetType: "bank",
      targetValue: "KE123456",
    });
  });
});
