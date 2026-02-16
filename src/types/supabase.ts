export type KycStatus = "pending" | "under_review" | "verified" | "rejected";
export type DocumentType = "passport" | "national_id" | "military_id";
export type TransactionType = "credit" | "debit" | "yield" | "withdrawal" | "deposit";
export type TransactionStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";
export type WalletSetupStatus =
  | "locked_by_kyc"
  | "ready_to_create"
  | "creating"
  | "created"
  | "associate_failed";

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  country_code: string | null;
  created_at: string;
  updated_at: string;
  hedera_account_id: string | null;
  hedera_public_key: string | null;
  wallet_created_at: string | null;
  usdc_associated: boolean;
  usdc_prompt_dismissed: boolean;
}

export interface KycRecord {
  id: string;
  user_id: string;
  status: KycStatus;
  document_type: DocumentType;
  document_url: string;
  selfie_url: string;
  submitted_at: string;
  verified_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionRecord {
  id: string;
  user_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency: string;
  title: string;
  description: string | null;
  counterparty: string | null;
  location: string | null;
  hedera_tx_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface UserBalance {
  user_id: string;
  balance: string;
  total_transactions: number;
  last_activity: string | null;
}

export interface UserWalletOverview extends UserBalance {
  hedera_account_id: string | null;
  hedera_public_key: string | null;
  wallet_created_at: string | null;
  has_wallet: boolean;
}

export interface CreateTransactionInput {
  flow: "send" | "deposit" | "withdrawal";
  amount: number;
  targetType: string;
  targetValue: string;
  note?: string;
  currency?: string;
}

export interface SubmitKycInput {
  documentType: DocumentType;
  documentFile: File;
  selfieFile: File;
}

export interface TransactionMetadata {
  source: "web";
  flow: "send" | "deposit" | "withdrawal";
  targetType: string;
  targetValue: string;
  note?: string;
}

export interface HederaTokenBalance {
  token_id: string;
  balance: string;
  symbol?: string;
}

export interface HederaAccountOverview {
  account: string;
  balanceTinybar: string;
  balanceHbar: string;
  evm_address?: string;
}

export interface HederaChainTx {
  id: string;
  type: string;
  status: "SUCCESS" | "FAILED" | "UNKNOWN";
  consensusTimestamp: string;
  memo?: string;
  amount?: string;
  asset?: string;
}

export interface InvoicePayload {
  v: 1;
  phone: string;
  amount: number;
  currency: "USDC";
  note?: string;
  exp: number;
  issuerAccountId: string;
  nonce: string;
}

export interface SignedInvoicePayload {
  payload: InvoicePayload;
  signature: string;
  algorithm: "Ed25519";
}

export interface CoinbaseOnrampSession {
  provider: "coinbase";
  referenceId: string;
  launchUrl: string;
  status: "created" | "failed";
}
