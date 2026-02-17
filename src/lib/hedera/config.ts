export class HederaConfigError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "HederaConfigError";
    this.code = code;
  }
}

const HEDERA_ENTITY_ID_PATTERN = /^0\.0\.\d+$/;

const appEnv = import.meta.env.VITE_APP_ENV ?? import.meta.env.EXPO_PUBLIC_ENV ?? "development";
const network = import.meta.env.VITE_HEDERA_NETWORK ?? "testnet";
const mirrorNodeUrl = import.meta.env.VITE_HEDERA_MIRROR_NODE_URL ?? "https://testnet.mirrornode.hedera.com/api/v1";

export const HEDERA_APP_ENV = appEnv;
export const HEDERA_IS_DEV = appEnv === "development";
export const HEDERA_NETWORK = network;
export const HEDERA_MIRROR_NODE_URL = mirrorNodeUrl.replace(/\/$/, "");
export const HEDERA_OPERATOR_ID =
  import.meta.env.VITE_HEDERA_OPERATOR_ID ??
  import.meta.env.VITE_HEDERA_TESTNET_OPERATOR_ID ??
  import.meta.env.HEDERA_OPERATOR_ID ??
  "";
export const HEDERA_OPERATOR_KEY =
  import.meta.env.VITE_HEDERA_OPERATOR_KEY ??
  import.meta.env.VITE_HEDERA_TESTNET_OPERATOR_KEY ??
  import.meta.env.HEDERA_OPERATOR_KEY ??
  "";
export const HEDERA_USDC_TOKEN_ID = import.meta.env.VITE_HEDERA_USDC_TOKEN_ID ?? "";

export function isValidHederaEntityId(value: string | null | undefined) {
  return !!value && HEDERA_ENTITY_ID_PATTERN.test(value.trim());
}

export function assertHederaEntityId(value: string | null | undefined, label: string) {
  const normalized = value?.trim() ?? "";
  if (!normalized) {
    throw new HederaConfigError(`Missing ${label}.`, "MISSING_ENTITY_ID");
  }
  if (!isValidHederaEntityId(normalized)) {
    throw new HederaConfigError(
      `Invalid ${label}: "${normalized}". Expected format 0.0.<number> (no placeholders).`,
      "INVALID_ENTITY_ID",
    );
  }
}

export function assertDevEnvironment() {
  if (!HEDERA_IS_DEV) {
    throw new HederaConfigError("Hedera operator actions are disabled outside development.", "ENV_NOT_ALLOWED");
  }
}

export function assertHederaOperatorConfig() {
  assertDevEnvironment();
  if (!HEDERA_OPERATOR_ID || !HEDERA_OPERATOR_KEY) {
    throw new HederaConfigError("Missing Hedera operator credentials in environment.", "MISSING_OPERATOR_CONFIG");
  }
  assertHederaEntityId(HEDERA_OPERATOR_ID, "VITE_HEDERA_OPERATOR_ID/VITE_HEDERA_TESTNET_OPERATOR_ID");
}

export function assertUsdcTokenConfig() {
  assertHederaEntityId(HEDERA_USDC_TOKEN_ID, "VITE_HEDERA_USDC_TOKEN_ID");
}
