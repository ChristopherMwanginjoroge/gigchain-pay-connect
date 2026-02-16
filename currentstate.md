# GigPay Web Current State

Last updated: 2026-02-16

## Overview

GigPay Web is a client-only React + Vite SPA using Supabase REST/Auth directly from the browser, plus Hedera testnet integrations and Coinbase sandbox onramp.

## Stack

- Frontend: React 18, Vite, TypeScript, React Router
- Data/state: TanStack React Query
- Auth/data backend: Supabase Auth + PostgREST + Storage REST (custom client wrappers)
- Chain: Hedera SDK (dynamic import in browser) + Hedera Mirror Node
- Onramp: Coinbase sandbox API flow (hosted launch)

## Routes

Public:

- `/` landing page

Protected:

- `/app/dashboard`
- `/app/kyc`
- `/app/activity`
- `/app/deposit`
- `/app/invoice`
- `/app/transactions/new`

## Auth and Session

- Auth methods: email/password, phone/password, Google OAuth
- Signup verification: 6-digit code flow is implemented in `AuthModal`
- Session storage key: `gigpay.supabase.session`
- App guard: unauthenticated users are redirected from `/app/*` to `/`

## Supabase Integration (Current)

- Uses REST calls to:
  - `/auth/v1/*`
  - `/rest/v1/*`
  - `/storage/v1/object/*`
- `profiles` fetch now has resilience:
  - If profile row is missing, client upserts it from auth user (`id/email/phone`)
- Wallet lookup now uses fallback chain:
  - `rpc/get_user_wallet` first
  - `user_balances` view fallback

## Wallet and Hedera (Current)

- Existing wallet detection:
  - Dashboard/Deposit use effective account id from:
    1. `profiles.hedera_account_id`
    2. `get_user_wallet.hedera_account_id` fallback
- Wallet creation:
  - client-side keypair generation
  - encrypted vault storage in IndexedDB (localStorage fallback) + recovery file download
  - operator-signed Hedera account creation (dev-only)
- USDC association:
  - deferred until wallet has HBAR
  - manual retry action in dashboard
  - retry loop on association attempts
  - checks mirror node association first, then associates only when needed
- No auto HBAR prefund in current flow

## KYC (Current Behavior)

- KYC submission flow is implemented (`/app/kyc`)
- KYC status is fetched and displayed
- KYC is currently optional for wallet creation (non-blocking)
- Validation limits:
  - document max 5MB
  - selfie max 2MB

## Deposit / Ramping (Current)

- Dedicated deposit page at `/app/deposit`
- Supports provider selection:
  - Coinbase
  - Yellow Card (hosted URL via env)
  - Paychant (hosted URL via env)
- Flow:
  1. Create pending `transactions` row
  2. Launch provider flow
  3. Poll mirror node every 5s for up to 2 minutes
  4. Update transaction status to `completed` when USDC balance increases, else timeout to `failed`

## Required Env Keys (Current)

- Supabase:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- App env:
  - `VITE_APP_ENV`
- Hedera:
  - `VITE_HEDERA_NETWORK`
  - `VITE_HEDERA_MIRROR_NODE_URL`
  - `VITE_HEDERA_USDC_TOKEN_ID`
  - `VITE_HEDERA_OPERATOR_ID` or `VITE_HEDERA_TESTNET_OPERATOR_ID`
  - `VITE_HEDERA_OPERATOR_KEY` or `VITE_HEDERA_TESTNET_OPERATOR_KEY`
- Coinbase:
  - `VITE_COINBASE_ONRAMP_API_BASE_URL`
  - `VITE_COINBASE_ONRAMP_API_KEY`
  - `VITE_COINBASE_ONRAMP_API_SECRET`
- Optional hosted providers:
  - `VITE_YELLOW_CARD_HOSTED_URL`
  - `VITE_PAYCHANT_HOSTED_URL`

## Known Constraints

- Operator and Coinbase credentials are intentionally client-exposed for development/test usage.
- KYC storage upload depends on correct storage RLS policies and path format `{user_id}/{filename}`.
- If mirror data fails for an account, dashboard now shows a network/account mismatch hint.
