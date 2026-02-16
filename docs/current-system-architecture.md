# GigPay Web Current System Architecture and Implementation

This document describes the current implemented state of the website in this repository.

## 1. High-Level Architecture

GigPay Web is a client-only React SPA built with Vite. The browser directly calls:

- Supabase Auth REST (`/auth/v1/*`)
- Supabase PostgREST (`/rest/v1/*`)
- Supabase Storage REST (`/storage/v1/object/*`)
- Hedera Mirror Node REST
- Coinbase Onramp sandbox REST (dev-only)
- QR image generator API

There is no backend server in this repo and no Edge Function dependency in the current web flow.

## 2. Runtime Topology

```text
Browser (React SPA)
  |- AuthProvider (custom Supabase auth client)
  |- React Query data layer
  |- Route guards (ProtectedRoute)
  |- Feature pages (/app/*)
  |
  +--> Supabase Auth API
  +--> Supabase PostgREST API
  +--> Supabase Storage API
  +--> Hedera SDK (loaded from esm.sh at runtime)
  +--> Hedera Mirror Node API
  +--> Coinbase Onramp Sandbox API (dev-only)
  +--> QR image API (api.qrserver.com)
```

## 3. Frontend Composition

### 3.1 Provider Stack

`src/App.tsx` composes:

1. `QueryClientProvider`
2. `AuthProvider`
3. `TooltipProvider`
4. Toast providers
5. `BrowserRouter`
6. `AuthModalProvider`

### 3.2 Route Map

Public:

- `/` -> landing page (`src/pages/Index.tsx`)

Protected by `ProtectedRoute`:

- `/app/dashboard`
- `/app/kyc`
- `/app/activity`
- `/app/deposit`
- `/app/invoice`
- `/app/transactions/new`

Notes:

- Unauthenticated access to `/app/*` redirects to `/`.
- `OnboardingGate` exists (`src/components/auth/OnboardingGate.tsx`) but is not mounted in `src/App.tsx`, so KYC is not currently enforced as a route gate.

### 3.3 Conversion and Auth Entry Points

- Navbar has `Download App` and `Getting Started` CTAs (`src/components/Navbar.tsx`).
- Hero section also has `Getting Started` CTA (`src/components/HeroSection.tsx`).
- `Getting Started` opens `AuthModal` via `AuthModalProvider`.

## 4. Core Client Modules

### 4.1 Auth

- `src/lib/supabase/client.ts`: custom auth client wrapper over Supabase Auth REST.
- `src/lib/auth/AuthProvider.tsx`: session bootstrap, auth state subscription, auth action exposure.
- `src/components/auth/AuthModal.tsx`: sign in, sign up, OTP verification, resend, Google OAuth.

Session storage:

- Local storage key: `gigpay.supabase.session`

### 4.2 Supabase Data Access

- `src/lib/supabase/rest.ts`: generic REST helper + storage upload helper.
- `src/lib/api/profile.ts`
- `src/lib/api/kyc.ts`
- `src/lib/api/transactions.ts`
- `src/lib/api/wallet.ts`

### 4.3 Hedera and Wallet

- `src/lib/hedera/config.ts`: env guards and config.
- `src/lib/hedera/client.ts`: account create, token associate, HBAR prefund, signing helpers.
- `src/lib/hedera/mirror.ts`: read-only chain state and tx history.
- `src/lib/wallet/keys.ts`: key generation, PBKDF2 + AES-GCM encryption, local vault persistence/export.

### 4.4 Invoice and Onramp

- `src/lib/invoice/qr.ts`: signed invoice payload build/sign/verify and URI encode/decode.
- `src/lib/onramp/coinbase.ts`: sandbox quote/session creation and flow launch.

## 5. Environment Configuration

Primary client env keys currently used:

- `VITE_SUPABASE_URL` or fallback `EXPO_PUBLIC_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` or fallback `EXPO_PUBLIC_SUPABASE_KEY`
- `VITE_APP_ENV` or fallback `EXPO_PUBLIC_ENV`
- `VITE_HEDERA_OPERATOR_ID`
- `VITE_HEDERA_OPERATOR_KEY`
- `VITE_HEDERA_TESTNET_OPERATOR_ID` (alias fallback)
- `VITE_HEDERA_TESTNET_OPERATOR_KEY` (alias fallback)
- `VITE_HEDERA_USDC_TOKEN_ID`
- `VITE_HEDERA_NETWORK`
- `VITE_HEDERA_MIRROR_NODE_URL`
- `VITE_COINBASE_ONRAMP_API_BASE_URL`
- `VITE_COINBASE_ONRAMP_API_KEY`
- `VITE_COINBASE_ONRAMP_API_SECRET`
- `VITE_YELLOW_CARD_HOSTED_URL` (optional hosted checkout URL)
- `VITE_PAYCHANT_HOSTED_URL` (optional hosted checkout URL)

Guard behavior:

- Hedera operator tx and Coinbase onramp calls are blocked when app env is not `development`.

## 6. API Call Catalog

All calls below originate from the browser.

### 6.1 Supabase Auth API Calls

Base URL: `${SUPABASE_URL}/auth/v1`

- `POST /signup`
  - email signup body: `{ email, password }`
  - phone signup body: `{ phone, password }`
  - may return no session when OTP verification is required
- `POST /token?grant_type=password`
  - body: `{ email, password }` or `{ phone, password }`
- `POST /token?grant_type=refresh_token`
  - body: `{ refresh_token }`
- `GET /user`
  - bearer token required
- `POST /verify`
  - email verification body: `{ type: "signup", email, token }`
  - phone verification body: `{ type: "sms", phone, token }`
- `POST /resend`
  - email resend body: `{ type: "signup", email }`
  - phone resend body: `{ type: "sms", phone }`
- `POST /logout`
- `GET /authorize?provider=google&redirect_to=...`
  - OAuth callback is parsed from URL hash in `handleOAuthCallback()`

### 6.2 Supabase PostgREST Calls

Base URL: `${SUPABASE_URL}/rest/v1`

Profile:

- `GET /profiles?select=*&id=eq.{userId}&limit=1`
- `PATCH /profiles?id=eq.{userId}&select=*`

KYC:

- `GET /kyc?select=*&user_id=eq.{userId}&order=created_at.desc`
- `POST /kyc?select=*`
  - body includes `user_id`, `document_type`, `document_url`, `selfie_url`, `status: "pending"`

Transactions:

- `GET /transactions?select=*&user_id=eq.{userId}&order=created_at.desc`
- `POST /transactions?select=*`
  - body includes `user_id` and mapped transaction payload
- `PATCH /transactions?id=eq.{txId}&user_id=eq.{userId}&select=*`
  - used for user-side status updates in deposit monitor flow (e.g., `completed`/`failed`)

Wallet balance view:

- `GET /user_balances?select=user_id,balance,total_transactions,last_activity&user_id=eq.{userId}&limit=1`

### 6.3 Supabase Storage Calls

Base URL: `${SUPABASE_URL}/storage/v1/object`

- `POST /kyc-documents/{userId}/{timestamp}-{sanitizedName}`
- `POST /kyc-selfies/{userId}/{timestamp}-{sanitizedName}`

Headers:

- `Authorization: Bearer <access_token>`
- `apikey: <anon/publishable key>`
- `Content-Type: <file.mime>`
- `x-upsert: false`

### 6.4 Hedera and Mirror Calls

Hedera SDK dynamic import:

- `https://esm.sh/@hashgraph/sdk@2.68.0`

Mirror node base:

- `VITE_HEDERA_MIRROR_NODE_URL` (default testnet mirror)

Mirror endpoints:

- `GET /accounts/{accountId}`
- `GET /balances?account.id={accountId}&limit=1`
- `GET /transactions?account.id={accountId}&limit={n}&order=desc`

### 6.5 Coinbase Onramp Sandbox Calls (Dev Only)

Base:

- `VITE_COINBASE_ONRAMP_API_BASE_URL` (default `https://api.developer.coinbase.com`)

Endpoints:

- `POST /onramp/v1/buy/quote`
- `POST /onramp/v1/buy/session`

Headers:

- `x-api-key`
- `x-api-secret`

### 6.6 External QR Rendering

- `GET https://api.qrserver.com/v1/create-qr-code/?size=260x260&data={encodedInvoiceUri}`

## 7. Domain Payload Contracts

### 7.1 Transaction Insert Mapping

`src/lib/transactions.ts` maps UI form input to DB payload:

- flow `send` -> `type: debit`
- flow `deposit` -> `type: deposit`
- flow `withdrawal` -> `type: withdrawal`
- initial `status: pending`
- `currency` defaults to `USDC`
- `metadata`:
  - `source: "web"`
  - `flow`
  - `targetType`
  - `targetValue`
  - optional `note`

### 7.2 Invoice Payload

`src/lib/invoice/qr.ts` payload fields:

- `v`, `phone`, `amount`, `currency`, `note`, `exp`, `issuerAccountId`, `nonce`
- Signed payload includes:
  - `signature` (base64)
  - `algorithm: "Ed25519"`

## 8. End-to-End System Flows

### 8.1 Landing to Auth

1. User opens `/`.
2. Clicks `Getting Started` (Navbar or Hero).
3. `AuthModal` opens.
4. User chooses sign-in/sign-up with phone/email or Google.
5. Success navigates to `/app/dashboard`.

### 8.2 Signup With OTP Verify

1. User submits signup form in modal.
2. `POST /auth/v1/signup`.
3. If response has no session, modal transitions to `verify` step.
4. User enters 6-digit code.
5. `POST /auth/v1/verify`.
6. Session is stored and user navigates to dashboard.

### 8.3 KYC Submission

1. User chooses document type and files on `/app/kyc`.
2. Client validates mime and size (`src/lib/kyc.ts`).
3. Uploads document to `kyc-documents/{userId}/...`.
4. Uploads selfie to `kyc-selfies/{userId}/...`.
5. Inserts KYC row into `public.kyc` with `status=pending`.
6. KYC history query refreshes.

### 8.4 Wallet Setup on Dashboard

1. User enters passphrase and confirms backup checkbox.
2. Client checks dev guard (`HEDERA_IS_DEV`).
3. Generates ED25519 keypair.
4. Encrypts private key with PBKDF2 + AES-GCM.
5. Stores encrypted vault in localStorage and downloads recovery JSON.
6. Calls Hedera account create using operator credentials.
7. Updates profile with `hedera_account_id`, `hedera_public_key`, `wallet_created_at`.
8. Associates USDC token on Hedera.
9. Updates profile `usdc_associated=true`.
10. Dashboard polls Mirror Node every 10s for live chain state.

Failure behavior:

- Association failure: account remains linked, status set to association failed, retry available.

### 8.5 Transaction Request Creation

1. User fills `/app/transactions/new`.
2. Client validates amount and fields via Zod.
3. Client inserts pending record into `public.transactions`.
4. Activity page shows the new pending row from query refresh.
5. External systems can later update status to processing/completed/failed.

### 8.6 Coinbase Sandbox Onramp Launch

1. User opens `/app/deposit` and selects provider + amount.
2. Client records a pending deposit request in `public.transactions`.
3. For Coinbase, client creates quote then session via sandbox APIs.
4. Client launches hosted checkout in a new window.
5. Client polls Mirror Node every 5s for up to 2 minutes and marks request `completed` when USDC balance increases.

### 8.7 Invoice QR Generation

1. User enters phone, amount, note, expiry, passphrase.
2. Client decrypts local vault private key.
3. Builds and signs invoice payload.
4. Verifies signature against stored public key.
5. Encodes `gigpay://invoice?data=...`.
6. Renders QR image URL and allows URI copy.

## 9. Data and State Persistence

Browser local storage keys:

- `gigpay.supabase.session` (auth session)
- `gigpay.wallet.encrypted.{userId}` (encrypted wallet vault)

React Query manages network cache for:

- Profile
- KYC records
- Transactions
- User balance
- Hedera mirror overview/tokens/transactions

## 10. Current Behavior Notes and Gaps

1. KYC gate is not enforced globally right now because `OnboardingGate` is not wired in `src/App.tsx`.
2. `Kyc` UI explicitly states KYC is currently optional for wallet and transactions.
3. `src/lib/kyc.ts` sets selfie max to 5MB in code but error text says 2MB.
4. Operator key and Coinbase sandbox secrets are intentionally browser-exposed for dev/test; this is not production-safe.
5. Auth implementation is custom REST wrapper, not `@supabase/supabase-js`.
6. KYC storage uploads depend on storage policy path prefix matching authenticated `userId`.

## 11. Relevant Files Index

- Routing and app shell:
  - `src/App.tsx`
  - `src/pages/AppLayout.tsx`
- Auth:
  - `src/lib/auth/AuthProvider.tsx`
  - `src/lib/supabase/client.ts`
  - `src/components/auth/AuthModal.tsx`
  - `src/components/auth/ProtectedRoute.tsx`
  - `src/components/auth/OnboardingGate.tsx` (currently unused)
- Supabase API:
  - `src/lib/supabase/rest.ts`
  - `src/lib/api/profile.ts`
  - `src/lib/api/kyc.ts`
  - `src/lib/api/transactions.ts`
  - `src/lib/api/wallet.ts`
- Hedera and wallet:
  - `src/lib/hedera/config.ts`
  - `src/lib/hedera/client.ts`
  - `src/lib/hedera/mirror.ts`
  - `src/lib/wallet/keys.ts`
- Ramps and invoice:
  - `src/lib/onramp/coinbase.ts`
  - `src/lib/invoice/qr.ts`
- Feature pages:
  - `src/pages/app/Dashboard.tsx`
  - `src/pages/app/Kyc.tsx`
  - `src/pages/app/Activity.tsx`
  - `src/pages/app/Deposit.tsx`
  - `src/pages/app/NewTransaction.tsx`
  - `src/pages/app/Invoice.tsx`
- Supabase SQL:
  - `src/lib/supabase/migrations/schema.sql`
  - `src/lib/supabase/migrations/add_hedera_wallet_fields.sql`
  - `src/lib/supabase/migrations/fix_rls_policies.sql`
