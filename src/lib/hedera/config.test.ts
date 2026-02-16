import { describe, expect, it } from "vitest";
import {
  assertHederaOperatorConfig,
  HEDERA_OPERATOR_ID,
  HEDERA_OPERATOR_KEY,
  isValidHederaEntityId,
} from "@/lib/hedera/config";

describe("hedera entity id validation", () => {
  it("accepts numeric Hedera ids", () => {
    expect(isValidHederaEntityId("0.0.429274")).toBe(true);
  });

  it("rejects placeholder Hedera ids", () => {
    expect(isValidHederaEntityId("0.0.xxxxx")).toBe(false);
  });
});

describe("hedera config guard", () => {
  it("matches guard behavior for current environment", () => {
    const hasUsableOperatorConfig = Boolean(
      HEDERA_OPERATOR_ID && HEDERA_OPERATOR_KEY && isValidHederaEntityId(HEDERA_OPERATOR_ID),
    );
    if (hasUsableOperatorConfig) {
      expect(() => assertHederaOperatorConfig()).not.toThrow();
      return;
    }
    expect(() => assertHederaOperatorConfig()).toThrow();
  });
});
