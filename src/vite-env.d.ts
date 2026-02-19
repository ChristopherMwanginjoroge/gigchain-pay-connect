/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_HEDERA_OPERATOR_ID?: string;
  readonly VITE_HEDERA_OPERATOR_KEY?: string;
  readonly VITE_HEDERA_TESTNET_OPERATOR_ID?: string;
  readonly VITE_HEDERA_TESTNET_OPERATOR_KEY?: string;
  readonly VITE_HEDERA_USDC_TOKEN_ID?: string;
  readonly VITE_HEDERA_NETWORK?: string;
  readonly VITE_HEDERA_MIRROR_NODE_URL?: string;
  readonly HEDERA_OPERATOR_ID?: string;
  readonly HEDERA_OPERATOR_KEY?: string;
  readonly VITE_COINBASE_ONRAMP_API_BASE_URL?: string;
  readonly VITE_COINBASE_ONRAMP_API_KEY?: string;
  readonly VITE_COINBASE_ONRAMP_API_SECRET?: string;
  readonly VITE_COINBASE_ONRAMP_APP_ID?: string;
  readonly VITE_PAYCREST_API_KEY?: string;
  readonly VITE_PAYCREST_API_SECRET?: string;
  readonly VITE_PAYCREST_BASE_URL?: string;
  readonly VITE_PAYCREST_HOSTED_URL?: string;
  readonly VITE_TRANSAK_API_KEY?: string;
  readonly VITE_TRANSAK_ENVIRONMENT?: "STAGING" | "PRODUCTION";
  readonly VITE_MOONPAY_API_KEY?: string;
  readonly VITE_MOONPAY_ENVIRONMENT?: "sandbox" | "production";
  // Solana configuration
  readonly VITE_SOLANA_NETWORK?: "devnet" | "mainnet-beta" | "testnet";
  readonly VITE_SOLANA_RPC_URL?: string;
  readonly VITE_SOLANA_USDC_MINT?: string;
  readonly EXPO_PUBLIC_SUPABASE_URL?: string;
  readonly EXPO_PUBLIC_SUPABASE_KEY?: string;
  readonly EXPO_PUBLIC_ENV?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
