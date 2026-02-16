import {
  assertHederaEntityId,
  assertDevEnvironment,
  assertHederaOperatorConfig,
  assertUsdcTokenConfig,
  HEDERA_NETWORK,
  HEDERA_OPERATOR_ID,
  HEDERA_OPERATOR_KEY,
  HEDERA_USDC_TOKEN_ID,
} from "@/lib/hedera/config";

type HederaSdk = {
  Client: {
    forTestnet: () => unknown;
    forMainnet: () => unknown;
    forPreviewnet: () => unknown;
  };
  AccountId: {
    fromString: (value: string) => unknown;
  };
  TokenId: {
    fromString: (value: string) => unknown;
  };
  PrivateKey: {
    fromString: (value: string) => unknown;
    fromStringECDSA: (value: string) => unknown;
    generateED25519: () => {
      toString: () => string;
      publicKey: {
        toString: () => string;
      };
      sign: (message: Uint8Array) => Uint8Array;
    };
  };
  PublicKey: {
    fromString: (value: string) => unknown;
  };
  Hbar: new (value: number) => unknown;
  AccountCreateTransaction: new () => unknown;
  TokenAssociateTransaction: new () => unknown;
  TransferTransaction: new () => unknown;
};

export class HederaClientError extends Error {
  code: string;
  details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = "HederaClientError";
    this.code = code;
    this.details = details;
  }
}

function assertWalletAccountId(accountId: string) {
  try {
    assertHederaEntityId(accountId, "wallet account id");
  } catch (error) {
    throw new HederaClientError(
      error instanceof Error ? error.message : "Invalid wallet account id.",
      "INVALID_ACCOUNT_ID",
      error,
    );
  }
}

let sdkPromise: Promise<HederaSdk> | null = null;

export async function loadHederaSdk(): Promise<HederaSdk> {
  if (!sdkPromise) {
    sdkPromise = import(/* @vite-ignore */ "https://esm.sh/@hashgraph/sdk@2.68.0")
      .then((mod) => mod as unknown as HederaSdk)
      .catch((error) => {
        sdkPromise = null;
        throw new HederaClientError("Unable to load Hedera SDK in browser.", "SDK_LOAD_FAILED", error);
      });
  }
  return sdkPromise;
}

function getNetworkClient(sdk: HederaSdk) {
  if (HEDERA_NETWORK === "mainnet") {
    return sdk.Client.forMainnet();
  }
  if (HEDERA_NETWORK === "previewnet") {
    return sdk.Client.forPreviewnet();
  }
  return sdk.Client.forTestnet();
}

function parseOperatorPrivateKey(sdk: HederaSdk) {
  const rawKey = HEDERA_OPERATOR_KEY.startsWith("0x")
    ? HEDERA_OPERATOR_KEY.slice(2)
    : HEDERA_OPERATOR_KEY;
  try {
    if (HEDERA_OPERATOR_KEY.startsWith("0x")) {
      return sdk.PrivateKey.fromStringECDSA(rawKey);
    }
    return sdk.PrivateKey.fromString(rawKey);
  } catch {
    return sdk.PrivateKey.fromStringECDSA(rawKey);
  }
}

async function createConfiguredClient() {
  assertHederaOperatorConfig();
  const sdk = await loadHederaSdk();
  const client = getNetworkClient(sdk) as {
    setOperator: (accountId: unknown, privateKey: unknown) => void;
  };

  const operatorId = sdk.AccountId.fromString(HEDERA_OPERATOR_ID);
  const operatorKey = parseOperatorPrivateKey(sdk);
  client.setOperator(operatorId, operatorKey);
  return { sdk, client, operatorId };
}

export async function assertDevOperatorEnabled() {
  assertDevEnvironment();
  assertHederaOperatorConfig();
  await loadHederaSdk();
}

export async function createWalletKeypair() {
  assertDevEnvironment();
  const sdk = await loadHederaSdk();
  const privateKey = sdk.PrivateKey.generateED25519();
  return {
    privateKey: privateKey.toString(),
    publicKey: privateKey.publicKey.toString(),
  };
}

export async function signMessageWithPrivateKey(privateKey: string, message: Uint8Array) {
  const sdk = await loadHederaSdk();
  const signer = sdk.PrivateKey.fromString(privateKey) as { sign: (payload: Uint8Array) => Uint8Array };
  return signer.sign(message);
}

export async function verifyMessageWithPublicKey(publicKey: string, message: Uint8Array, signature: Uint8Array) {
  const sdk = await loadHederaSdk();
  const verifier = sdk.PublicKey.fromString(publicKey) as {
    verify: (payload: Uint8Array, signature: Uint8Array) => boolean;
  };
  return verifier.verify(message, signature);
}

export async function createAccountFromPublicKey(publicKey: string): Promise<{ accountId: string; txId: string }> {
  const { sdk, client } = await createConfiguredClient();
  try {
    const transaction = new sdk.AccountCreateTransaction() as {
      setKey: (key: unknown) => {
        setInitialBalance: (balance: unknown) => {
          execute: (client: unknown) => Promise<{
            transactionId?: { toString: () => string };
            getReceipt: (client: unknown) => Promise<{ accountId?: { toString: () => string } }>;
          }>;
        };
      };
    };
    const executable = transaction.setKey(sdk.PublicKey.fromString(publicKey)).setInitialBalance(new sdk.Hbar(0));
    const response = await executable.execute(client);
    const receipt = await response.getReceipt(client);
    const accountId = receipt.accountId?.toString();
    if (!accountId) {
      throw new HederaClientError("Missing account id in account creation receipt.", "CREATE_ACCOUNT_RECEIPT_MISSING");
    }
    return {
      accountId,
      txId: response.transactionId?.toString() ?? "unknown",
    };
  } catch (error) {
    throw new HederaClientError("Failed to create Hedera account.", "CREATE_ACCOUNT_FAILED", error);
  }
}

export async function associateUsdc(accountId: string, privateKey: string): Promise<{ txId: string }> {
  assertUsdcTokenConfig();
  assertWalletAccountId(accountId);
  const { sdk, client } = await createConfiguredClient();
  try {
    const userKey = sdk.PrivateKey.fromString(privateKey);
    const associationTx = new sdk.TokenAssociateTransaction() as {
      setAccountId: (id: unknown) => {
        setTokenIds: (ids: unknown[]) => {
          freezeWith: (client: unknown) => Promise<{
            sign: (key: unknown) => Promise<{
              execute: (client: unknown) => Promise<{
                transactionId?: { toString: () => string };
                getReceipt: (client: unknown) => Promise<unknown>;
              }>;
            }>;
          }>;
        };
      };
    };
    const frozenTx = await associationTx
      .setAccountId(sdk.AccountId.fromString(accountId))
      .setTokenIds([sdk.TokenId.fromString(HEDERA_USDC_TOKEN_ID)])
      .freezeWith(client);
    const signed = await frozenTx.sign(userKey);
    const response = await signed.execute(client);
    await response.getReceipt(client);
    return { txId: response.transactionId?.toString() ?? "unknown" };
  } catch (error) {
    throw new HederaClientError("Failed to associate USDC token.", "ASSOCIATE_USDC_FAILED", error);
  }
}

export async function prefundHbar(accountId: string, amountTinybar: number): Promise<{ txId: string }> {
  assertWalletAccountId(accountId);
  const { sdk, client, operatorId } = await createConfiguredClient();
  try {
    const hbarAmount = amountTinybar / 100_000_000;
    const transaction = new sdk.TransferTransaction() as {
      addHbarTransfer: (id: unknown, amount: unknown) => {
        addHbarTransfer: (id: unknown, amount: unknown) => {
          execute: (client: unknown) => Promise<{
            transactionId?: { toString: () => string };
            getReceipt: (client: unknown) => Promise<unknown>;
          }>;
        };
      };
    };
    const executable = transaction
      .addHbarTransfer(operatorId, new sdk.Hbar(-hbarAmount))
      .addHbarTransfer(sdk.AccountId.fromString(accountId), new sdk.Hbar(hbarAmount));
    const response = await executable.execute(client);
    await response.getReceipt(client);
    return { txId: response.transactionId?.toString() ?? "unknown" };
  } catch (error) {
    throw new HederaClientError("Failed to prefund account with HBAR.", "PREFUND_FAILED", error);
  }
}
