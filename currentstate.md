# GigPay Web Current State

Last updated: 2026-02-18

## Overview

GigPay Web is a client-only React + Vite SPA using Supabase REST/Auth directly from the browser, plus Hedera testnet integrations and MoonPay fiat-to-USDC onramp.

## Stack

- Frontend: React 18, Vite, TypeScript, React Router
- Data/state: TanStack React Query
- Auth/data backend: Supabase Auth + PostgREST + Storage REST + Edge Functions
- Chain: Hedera SDK (dynamic import in browser) + Hedera Mirror Node
- Onramp: MoonPay widget (card/bank → USDC on Hedera)
- Offramp: Transak widget (USDC → fiat) [planned]

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
- Edge Functions:
  - `transak-webhook` - Receives Transak order status webhooks
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
- **Primary provider: MoonPay (Card/Bank → USDC on Hedera)**
  - Supports `usdc_hedera` - USDC directly on Hedera network
  - Iframe widget with built-in KYC
  - Supports 100+ fiat currencies and payment methods (card, bank, Apple/Google Pay)
  - Handles compliance, payment processing, and crypto delivery
  - Delivers USDC directly to user's Hedera wallet address
  - postMessage events for order tracking
- **Transak reserved for off-ramp (selling)** - isPayInAllowed: false for Hedera USDC
- Additional providers:
  - Yellow Card (hosted URL via env)
  - Paychant (hosted URL via env)
- Flow:
  1. Create pending `transactions` row with `externalTransactionId`
  2. Open MoonPay iframe with user's wallet address and email pre-filled
  3. User completes KYC (if needed), payment, and crypto purchase in widget
  4. MoonPay sends postMessage events for order status
  5. Mirror node polling detects USDC balance increase
  6. Transaction status updated to `completed`

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
- MoonPay (On-Ramp):
  - `VITE_MOONPAY_API_KEY` (Publishable key from dashboard)
  - `VITE_MOONPAY_ENVIRONMENT` (sandbox or production)
- Transak (Off-Ramp, planned):
  - `VITE_TRANSAK_API_KEY` (Partner API key from dashboard)
  - `VITE_TRANSAK_ENVIRONMENT` (STAGING or PRODUCTION)
- Optional hosted providers:
  - `VITE_YELLOW_CARD_HOSTED_URL`
  - `VITE_PAYCHANT_HOSTED_URL`

## Known Constraints

- Operator credentials are intentionally client-exposed for development/test usage.
- KYC storage upload depends on correct storage RLS policies and path format `{user_id}/{filename}`.
- If mirror data fails for an account, dashboard now shows a network/account mismatch hint.

## Automated Checks (2026-02-17)

- **Tests:** Vitest run completed successfully — **11 test files, 23 tests, 23 passed**. Test warnings were emitted from React Router about future flags (non-fatal).
- **Typecheck:** `tsc --noEmit` completed with no type errors.
- **Build:** `vite build` completed successfully. Notes from the build:
  - Production `dist/` was produced successfully.
  - Several JS chunks exceed 500 kB after minification (consider code-splitting / dynamic imports).
  - Large static images in `src/assets/` increase bundle size — consider optimizing or lazy-loading.
  - Browserslist data is stale (tool recommends running `npx update-browserslist-db@latest`).

## Current Status Summary

- **What works:**
  - Unit & component tests pass locally (24/24).
  - TypeScript typecheck passes locally.
  - Vite production build succeeds and produces deployable assets.
  - Key flows and modules covered by tests: onboarding, transactions, kyc, hedera config, invoice QR, wallet key vault, auth modal and routing guards.
  - MoonPay integration for fiat-to-USDC on Hedera (widget handles KYC and payments).

- **What doesn't / needs attention:**
  - **Bundle size warnings:** Several large chunks and large images may negatively impact initial load performance.
  - **React Router future-flag warnings** surfaced during tests — not breaking, but consider addressing before major upgrades.
  - **Browserslist** is out of date (non-blocking) — update recommended.
  - **Runtime validation:** MoonPay API key required in env vars.
  - **Off-ramp:** Transak off-ramp (sell USDC → fiat) not yet implemented.

## MoonPay Integration Details

MoonPay is a fiat-to-crypto onramp provider with excellent Hedera support. Key benefits:
- **USDC on Hedera** - Directly supports `usdc_hedera` currency code
- **Widget-based integration** - Handles KYC, compliance, and payment processing
- **Global coverage** - 100+ fiat currencies, 170+ countries
- **Multiple payment methods** - Cards, bank transfers, Apple Pay, Google Pay
- **Direct crypto delivery** - USDC delivered straight to user's Hedera wallet

Implementation files:
- `src/lib/onramp/moonpay.ts` - Widget URL builder, iframe manager, event listeners
- `src/pages/app/Deposit.tsx` - Deposit page with MoonPay as primary provider

Getting started with MoonPay:
1. Sign up at https://dashboard.moonpay.com/
2. Get your publishable API key from the dashboard
3. Set `VITE_MOONPAY_API_KEY` and `VITE_MOONPAY_ENVIRONMENT` in .env.local
4. For production, complete KYB verification
5. Docs: https://docs.moonpay.com/

## Transak Integration (Off-Ramp - Planned)

Transak will be used for off-ramp (selling USDC → fiat). Note: Transak has `isPayInAllowed: false` for USDC on Hedera, so it cannot be used for buying.

Implementation files:
- `src/lib/onramp/transak.ts` - Widget integration (currently unused)
- `supabase/functions/transak-webhook/index.ts` - Webhook handler for order status updates
