# GigChain Pay Connect - Implementation Status & Documentation

**Last Updated:** March 10, 2026

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Completed Integrations](#completed-integrations)
4. [Pending Integrations](#pending-integrations)
5. [Implemented Features](#implemented-features)
6. [Pending Features](#pending-features)
7. [Environment Configuration](#environment-configuration)
8. [Architecture Overview](#architecture-overview)
9. [Testing Status](#testing-status)
10. [Known Issues & Constraints](#known-issues--constraints)
11. [Deployment Considerations](#deployment-considerations)

---

## 🎯 Overview

**GigChain Pay Connect** is a non-custodial global payment platform designed for freelancers and gig workers, particularly focused on the Kenyan market. The application enables users to receive, send, and manage cryptocurrency payments (primarily USDC) using just their phone number as their payment identity.

### Key Value Propositions
- **Phone Number = Wallet Address**: No need to remember complex crypto addresses
- **Non-Custodial**: Users control their own keys and funds
- **Multi-Chain Support**: Hedera, Solana, and bridging capabilities
- **Mobile-First**: Designed for M-Pesa-ready regional cash-out flows
- **Compliance-Ready**: Built-in KYC and regulatory compliance features

---

## 🛠 Tech Stack

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **React Router v6** - Client-side routing
- **TanStack React Query** - Asynchronous state management

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Reusable component library (built on Radix UI)
- **Lucide React** - Icon library
- **Cobe** - Interactive 3D globe visualization
- **Recharts** - Chart and data visualization library

### Backend & Data
- **Supabase** - Backend-as-a-Service
  - Supabase Auth (REST API)
  - PostgREST (database REST API)
  - Supabase Storage (file storage)
  - Supabase Edge Functions (serverless functions)

### Blockchain & Crypto
- **Hedera SDK (@hashgraph/sdk)** - Hedera Hashgraph integration
- **Solana Web3.js** - Solana blockchain integration
- **SPL Token** - Solana token program

### Testing
- **Vitest** - Unit testing framework
- **Testing Library (React)** - Component testing
- **jsdom** - DOM simulation for tests

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS & Autoprefixer** - CSS processing

---

## ✅ Completed Integrations

### 1. **Supabase Integration** ✓
**Status:** Fully Integrated

**Components:**
- ✅ Authentication (Email, Phone, Google OAuth)
- ✅ Profile management
- ✅ KYC data storage
- ✅ Transaction history
- ✅ User balances view
- ✅ File storage (KYC documents, selfies)
- ✅ Edge Functions (2 deployed)

**Files:**
- `src/lib/supabase/client.ts` - Auth client wrapper
- `src/lib/supabase/rest.ts` - REST API helpers
- `src/lib/auth/AuthProvider.tsx` - Auth state management
- `src/components/auth/AuthModal.tsx` - Auth UI
- `src/lib/api/profile.ts` - Profile queries
- `src/lib/api/kyc.ts` - KYC queries
- `src/lib/api/transactions.ts` - Transaction queries
- `src/lib/api/wallet.ts` - Wallet queries

**Endpoints Used:**
- `/auth/v1/*` - Authentication
- `/rest/v1/*` - Database access
- `/storage/v1/object/*` - File uploads
- `/functions/v1/*` - Edge Functions

**Edge Functions:**
1. `coinbase-session` - JWT session creation for Coinbase onramp
2. `transak-webhook` - Webhook handler for Transak order updates

---

### 2. **Hedera Integration** ✓
**Status:** Fully Integrated

**Capabilities:**
- ✅ Account creation (ED25519 keypair generation)
- ✅ USDC token association
- ✅ Balance checking via Mirror Node
- ✅ Transaction history via Mirror Node
- ✅ Key vault encryption (PBKDF2 + AES-GCM)
- ✅ Recovery file export/download
- ✅ Wallet detection and fallback logic

**Files:**
- `src/lib/hedera/config.ts` - Configuration and env guards
- `src/lib/hedera/client.ts` - Account operations, token association
- `src/lib/hedera/mirror.ts` - Read-only chain state
- `src/lib/wallet/keys.ts` - Key generation and encryption
- `src/lib/api/hedera.ts` - React Query hooks

**Mirror Node Endpoints:**
- `GET /accounts/{accountId}` - Account details
- `GET /balances?account.id={accountId}` - Balance queries
- `GET /transactions?account.id={accountId}` - Transaction history

**Current Flow:**
1. User creates wallet with passphrase
2. Client generates ED25519 keypair
3. Private key encrypted with user passphrase
4. Encrypted vault stored in localStorage (with recovery file download)
5. Operator creates Hedera account (dev mode only)
6. USDC token association (when HBAR balance sufficient)
7. Profile updated with Hedera account ID

---

### 3. **MoonPay Integration (Primary On-Ramp)** ✓
**Status:** Fully Integrated

**Type:** Fiat → USDC on Hedera

**Capabilities:**
- ✅ Widget-based integration (iframe)
- ✅ Direct USDC on Hedera support (`usdc_hedera`)
- ✅ Built-in KYC within widget
- ✅ 100+ fiat currencies supported
- ✅ Multiple payment methods (card, bank, Apple Pay, Google Pay)
- ✅ PostMessage event tracking
- ✅ Transaction status monitoring

**Files:**
- `src/lib/onramp/moonpay.ts` - Widget URL builder, iframe manager
- `src/pages/app/Deposit.tsx` - Deposit page

**Flow:**
1. User navigates to `/app/deposit`
2. MoonPay widget opens with pre-filled wallet address
3. User completes KYC (if needed) and payment in widget
4. MoonPay delivers USDC directly to Hedera wallet
5. Mirror node polling detects balance increase
6. Transaction status updated to `completed`

**Environment Variables:**
- `VITE_MOONPAY_API_KEY` - Publishable API key
- `VITE_MOONPAY_ENVIRONMENT` - "sandbox" or "production"

**Documentation:** https://docs.moonpay.com/

---

### 4. **Coinbase Onramp Integration** ✓
**Status:** Fully Integrated (Sandbox)

**Type:** Fiat → Crypto (Multi-chain including Solana)

**Capabilities:**
- ✅ Session token generation via Edge Function
- ✅ Sandbox quote/session creation
- ✅ Multi-blockchain support
- ✅ Country-based fiat currency mapping
- ✅ Widget URL generation
- ✅ Bridge detection for Hedera conversion

**Files:**
- `src/lib/onramp/coinbase.ts` - Session creation, widget launcher
- `src/lib/onramp/coinbase.test.ts` - Unit tests
- `supabase/functions/coinbase-session/index.ts` - JWT signing Edge Function

**Flow:**
1. User selects Coinbase as onramp provider
2. Client calls Edge Function to create signed JWT session
3. Session includes destination address and purchase details
4. Widget opens with session token
5. User completes purchase
6. If Hedera selected, may require Hashport bridge

**Environment Variables:**
- `VITE_COINBASE_ONRAMP_API_BASE_URL`
- `VITE_COINBASE_ONRAMP_API_KEY`
- `VITE_COINBASE_ONRAMP_API_SECRET` (Edge Function)

**Documentation:** https://docs.cdp.coinbase.com/onramp/

---

### 5. **Solana Integration** ✓
**Status:** Read-Only Integration

**Capabilities:**
- ✅ Balance queries (SOL and USDC)
- ✅ React Query hooks for data fetching
- ✅ Multi-token balance aggregation
- ✅ Wallet data composition

**Files:**
- `src/lib/api/solana.ts` - React Query hooks
- `src/lib/solana/` - Solana utilities

**Hooks:**
- `useSolanaBalanceQuery(address)` - Get SOL balance
- `useSolanaUsdcBalanceQuery(address)` - Get USDC balance
- `useSolanaBalancesQuery(address)` - Get all token balances
- `useSolanaWalletData(address)` - Combined wallet data

**Note:** Write operations (sending, swapping) are not yet implemented.

---

### 6. **Hashport Bridge Integration** ✓
**Status:** Fully Integrated

**Type:** Cross-chain token bridging

**Capabilities:**
- ✅ Bridge URL generation
- ✅ Ethereum ↔ Hedera bridging
- ✅ Polygon ↔ Hedera bridging
- ✅ Fee estimation
- ✅ Bridge instructions generator
- ✅ Support detection

**Files:**
- `src/lib/bridge/hashport.ts` - Bridge utilities

**Supported Chains:**
- Ethereum (Mainnet)
- Polygon (Mainnet)
- Hedera (Mainnet/Testnet)

**Functions:**
- `buildHashportBridgeUrl()` - Generate bridge widget URL
- `getBridgeInstructions()` - Get human-readable instructions
- `estimateBridgeFee()` - Calculate bridge fees
- `openHashportBridge()` - Launch bridge interface

**Documentation:** https://www.hashport.network/

---

### 7. **Paycrest Integration** ✓
**Status:** API Integration Ready (Not UI-Connected)

**Type:** Fiat → Crypto for African markets

**Capabilities:**
- ✅ Rate fetching
- ✅ Order creation
- ✅ Multi-currency support (KES, UGX, TZS)
- ✅ Multi-network support (Solana, Hedera)
- ✅ Payment method selection

**Files:**
- `src/lib/onramp/paycrest.ts` - API integration

**Supported Fiat Currencies:**
- KES (Kenyan Shilling)
- UGX (Ugandan Shilling)
- TZS (Tanzanian Shilling)
- And more African currencies

**Environment Variables:**
- `VITE_PAYCREST_API_KEY`
- `VITE_PAYCREST_API_SECRET`
- `VITE_PAYCREST_BASE_URL`

**Documentation:** https://docs.paycrest.io/

---

### 8. **Invoice & QR System** ✓
**Status:** Fully Integrated

**Capabilities:**
- ✅ Signed invoice payload generation
- ✅ QR code generation
- ✅ Invoice URI encoding/decoding
- ✅ Signature verification (Ed25519)
- ✅ Expiration handling
- ✅ Nonce-based replay protection

**Files:**
- `src/lib/invoice/qr.ts` - Invoice utilities
- `src/lib/invoice/qr.test.ts` - Unit tests
- `src/pages/app/Invoice.tsx` - Invoice page

**Invoice Payload Fields:**
- Version (`v`)
- Phone number
- Amount
- Currency (USDC default)
- Note/memo
- Expiration timestamp
- Issuer account ID
- Nonce
- Signature (Ed25519)

**QR Service:**
- External API: `https://api.qrserver.com/v1/create-qr-code/`

---

### 9. **KYC System** ✓
**Status:** Fully Integrated

**Capabilities:**
- ✅ Document upload (passport, ID, driver's license)
- ✅ Selfie upload
- ✅ File validation (type, size)
- ✅ Supabase Storage integration
- ✅ KYC status tracking
- ✅ History view

**Files:**
- `src/lib/kyc.ts` - KYC utilities and validation
- `src/lib/kyc.test.ts` - Unit tests
- `src/lib/api/kyc.ts` - React Query hooks
- `src/pages/app/Kyc.tsx` - KYC submission page

**Validation:**
- Document max size: 5MB
- Selfie max size: 2MB
- Accepted types: JPEG, PNG, PDF

**Storage Paths:**
- Documents: `kyc-documents/{userId}/{timestamp}-{filename}`
- Selfies: `kyc-selfies/{userId}/{timestamp}-{filename}`

**KYC Status:**
- `pending` - Awaiting review
- `approved` - Verified
- `rejected` - Denied

**Note:** KYC is currently **optional** for wallet creation (non-blocking).

---

### 10. **Testing Infrastructure** ✓
**Status:** Comprehensive Test Suite

**Test Results (Latest Run):**
- ✅ 11 test files
- ✅ 23 tests total
- ✅ 23 passed (100% pass rate)
- ✅ TypeScript typecheck passes
- ✅ Production build succeeds

**Test Coverage:**
- Onboarding logic (`src/lib/onboarding.test.ts`)
- Transaction mapping (`src/lib/transactions.test.ts`)
- KYC validation (`src/lib/kyc.test.ts`)
- Invoice QR generation (`src/lib/invoice/qr.test.ts`)
- Coinbase integration (`src/lib/onramp/coinbase.test.ts`)
- Auth modal component (`src/components/auth/AuthModal.test.tsx`)
- Protected routes (`src/components/auth/ProtectedRoute.test.tsx`)
- Onboarding gate (`src/components/auth/OnboardingGate.test.tsx`)

**Test Commands:**
```bash
npm test          # Run tests once
npm run test:watch # Watch mode
```

---

## 🚧 Pending Integrations

### 1. **Transak Off-Ramp** 🔄
**Status:** Partially Integrated (Webhook Ready)

**Purpose:** USDC → Fiat conversion

**What's Done:**
- ✅ Widget integration code (`src/lib/onramp/transak.ts`)
- ✅ Webhook Edge Function (`supabase/functions/transak-webhook/`)
- ✅ Order status tracking

**What's Pending:**
- ⏳ UI integration in Deposit/Withdraw page
- ⏳ Production API credentials
- ⏳ User flow implementation
- ⏳ Testing with live API

**Reason:** Transak has `isPayInAllowed: false` for Hedera USDC, so it's reserved for selling (off-ramp) only.

**Environment Variables Needed:**
- `VITE_TRANSAK_API_KEY`
- `VITE_TRANSAK_ENVIRONMENT`

---

### 2. **Yellow Card Integration** 🔄
**Status:** Placeholder Only

**Purpose:** African market fiat on/off-ramp

**What's Done:**
- ✅ Hosted URL support in env variables
- ✅ Basic link generation

**What's Pending:**
- ⏳ Full API integration
- ⏳ Payment flow implementation
- ⏳ Order tracking
- ⏳ Webhook integration

**Environment Variables:**
- `VITE_YELLOW_CARD_HOSTED_URL`

---

### 3. **Paychant Integration** 🔄
**Status:** Placeholder Only

**Purpose:** Alternative payment provider

**What's Done:**
- ✅ Hosted URL support in env variables
- ✅ Basic link generation

**What's Pending:**
- ⏳ Full API integration
- ⏳ Payment flow implementation

**Environment Variables:**
- `VITE_PAYCHANT_HOSTED_URL`

---

### 4. **M-Pesa Integration** ⏳
**Status:** Not Started

**Purpose:** Mobile money cash-out for Kenya

**What's Needed:**
- Safaricom M-Pesa API integration
- USDC → KES conversion
- Mobile money transfer
- Transaction reconciliation
- Webhook handling

**Priority:** High (Core feature for Kenyan market)

---

### 5. **Push Notifications** ⏳
**Status:** Not Started

**Purpose:** Real-time transaction alerts

**What's Needed:**
- Firebase Cloud Messaging or similar
- Notification permissions
- Service worker for background notifications
- Notification preferences UI

---

### 6. **2FA / Multi-Factor Authentication** ⏳
**Status:** Not Started

**Purpose:** Enhanced account security

**What's Needed:**
- TOTP implementation
- QR code for authenticator app setup
- Backup codes generation
- Recovery flow

---

## ✨ Implemented Features

### Authentication & User Management
- ✅ Email/password signup and login
- ✅ Phone number signup and login
- ✅ Google OAuth
- ✅ 6-digit OTP verification
- ✅ OTP resend functionality
- ✅ Session persistence (localStorage)
- ✅ Auto-refresh tokens
- ✅ Logout functionality
- ✅ Protected routes with redirect

### Wallet Management
- ✅ Non-custodial wallet creation
- ✅ ED25519 keypair generation
- ✅ Passphrase-based encryption (PBKDF2 + AES-GCM)
- ✅ Encrypted vault storage (localStorage + IndexedDB fallback)
- ✅ Recovery file download (JSON)
- ✅ Hedera account creation
- ✅ USDC token association
- ✅ Wallet detection (multiple fallback sources)
- ✅ Balance display (HBAR and USDC)

### Transactions
- ✅ Transaction history view
- ✅ Send flow (UI ready, pending chain execution)
- ✅ Deposit flow (MoonPay, Coinbase)
- ✅ Transaction status tracking
- ✅ Transaction metadata storage
- ✅ Mirror node polling

### KYC / Compliance
- ✅ Document upload (ID, passport, driver's license)
- ✅ Selfie verification upload
- ✅ File validation (type, size limits)
- ✅ KYC status tracking
- ✅ KYC history view
- ✅ Optional KYC (non-blocking)

### Invoice System
- ✅ Payment request creation
- ✅ QR code generation
- ✅ Signed invoice payloads
- ✅ Invoice URI encoding
- ✅ Signature verification
- ✅ Expiration handling

### User Interface
- ✅ Responsive design (mobile-first)
- ✅ Landing page with sections:
  - Hero with CTA
  - Problem statement
  - Solution (with animated globe)
  - How it works
  - Pricing
  - Trust indicators
  - School section
  - Footer
- ✅ Dashboard with wallet overview
- ✅ Activity/transaction history page
- ✅ Deposit page
- ✅ KYC page
- ✅ Invoice generation page
- ✅ Navigation with auth state
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ Modal dialogs
- ✅ Form validation

### Developer Experience
- ✅ TypeScript throughout
- ✅ ESLint configuration
- ✅ Comprehensive test suite
- ✅ Hot module replacement (Vite)
- ✅ Environment variable management
- ✅ Development/production builds

---

## 🎯 Pending Features

### High Priority

#### 1. **Actual Send Transaction Execution** ⏳
**Current Status:** UI and form ready, chain execution pending

**What's Needed:**
- Transaction signing with user's private key
- Hedera transfer execution
- Error handling for insufficient balance
- Transaction confirmation UI
- Success/failure notifications

---

#### 2. **HBAR Prefunding Flow** ⏳
**Current Status:** Manual operator funding in dev mode

**What's Needed:**
- Automated HBAR prefunding for new accounts
- Minimum balance maintenance
- Gas fee estimation
- Balance alerts

---

#### 3. **Withdrawal to Bank (Off-Ramp)** ⏳
**Current Status:** Transak webhook ready, UI not implemented

**What's Needed:**
- Withdraw page UI
- Transak widget integration
- Bank account collection
- Withdrawal history
- Status tracking

---

#### 4. **M-Pesa Cash-Out** ⏳
**Current Status:** Not started

**What's Needed:**
- M-Pesa API integration
- USDC → KES conversion rate API
- Mobile number verification
- Transaction limits
- Compliance checks

---

#### 5. **Phone Number → Wallet Lookup** ⏳
**Current Status:** Infrastructure ready, not exposed

**What's Needed:**
- Public phone → wallet resolution endpoint
- Privacy considerations
- Opt-in/opt-out settings
- Rate limiting
- Search UI in send flow

---

### Medium Priority

#### 6. **Multi-Currency Support** ⏳
**Current Status:** USDC only

**What's Needed:**
- HBAR send/receive
- Other HTS tokens
- Currency selection in UI
- Exchange rate display
- Multi-currency balance view

---

#### 7. **Transaction Notes/Memos** ⏳
**Current Status:** Metadata field exists, not enforced

**What's Needed:**
- Memo field in Hedera transactions
- Note display in history
- Search/filter by notes

---

#### 8. **Wallet Import** ⏳
**Current Status:** Can create new wallets only

**What's Needed:**
- Import from recovery file
- Import from private key
- Import from mnemonic phrase
- Passphrase validation
- Conflict resolution

---

#### 9. **Address Book / Contacts** ⏳
**Current Status:** Manual address entry only

**What's Needed:**
- Saved contacts list
- Phone number contacts
- Edit/delete contacts
- Search/autocomplete in send flow

---

#### 10. **Transaction Receipts** ⏳
**Current Status:** Basic status only

**What's Needed:**
- Printable receipts
- PDF generation
- Email receipts
- Share functionality

---

### Low Priority

#### 11. **Dark Mode** ⏳
**Current Status:** Light mode only

**What's Needed:**
- Dark theme styles
- Theme toggle in UI
- System preference detection
- Persistent theme preference

---

#### 12. **Internationalization (i18n)** ⏳
**Current Status:** English only

**What's Needed:**
- Translation framework (react-i18next)
- Swahili translations (priority)
- Language selector
- Date/number formatting
- Currency formatting

---

#### 13. **Analytics & Tracking** ⏳
**Current Status:** No tracking

**What's Needed:**
- Google Analytics or similar
- User behavior tracking
- Conversion funnels
- Error tracking (Sentry)

---

#### 14. **PWA Support** ⏳
**Current Status:** Not a PWA

**What's Needed:**
- Service worker
- Offline functionality
- App manifest
- Install prompt
- Cache strategy

---

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Environment
VITE_APP_ENV=development  # or production

# Hedera
VITE_HEDERA_NETWORK=testnet  # or mainnet
VITE_HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
VITE_HEDERA_USDC_TOKEN_ID=0.0.12345678
VITE_HEDERA_OPERATOR_ID=0.0.12345
VITE_HEDERA_OPERATOR_KEY=302e...private-key
# OR for testnet-specific:
VITE_HEDERA_TESTNET_OPERATOR_ID=0.0.12345
VITE_HEDERA_TESTNET_OPERATOR_KEY=302e...private-key

# MoonPay (Primary On-Ramp)
VITE_MOONPAY_API_KEY=pk_test_...
VITE_MOONPAY_ENVIRONMENT=sandbox  # or production

# Coinbase Onramp
VITE_COINBASE_ONRAMP_API_BASE_URL=https://api.developer.coinbase.com
VITE_COINBASE_ONRAMP_API_KEY=your-api-key
VITE_COINBASE_ONRAMP_API_SECRET=your-api-secret (for Edge Function)

# Transak (Off-Ramp - Optional)
VITE_TRANSAK_API_KEY=your-partner-key
VITE_TRANSAK_ENVIRONMENT=STAGING  # or PRODUCTION

# Paycrest (Optional)
VITE_PAYCREST_API_KEY=your-api-key
VITE_PAYCREST_API_SECRET=your-api-secret
VITE_PAYCREST_BASE_URL=https://api.paycrest.io/v1

# Optional Hosted Providers
VITE_YELLOW_CARD_HOSTED_URL=https://...
VITE_PAYCHANT_HOSTED_URL=https://...
```

### Environment File Setup

Create `.env.local` in project root:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

**⚠️ Important:** Never commit `.env.local` to version control.

---

## 🏗 Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA (Browser)                  │
│  ┌───────────┬────────────┬──────────┬────────────┐    │
│  │  Auth     │  Wallet    │   UI     │  API       │    │
│  │  Provider │  Manager   │  Layer   │  Clients   │    │
│  └───────────┴────────────┴──────────┴────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │    Hedera    │  │  On-Ramp     │
│              │  │   Hashgraph  │  │  Providers   │
│ ┌──────────┐ │  │              │  │              │
│ │   Auth   │ │  │ ┌──────────┐ │  │ ┌──────────┐ │
│ │ PostgREST│ │  │ │  Mirror  │ │  │ │ MoonPay  │ │
│ │  Storage │ │  │ │   Node   │ │  │ │ Coinbase │ │
│ │Functions │ │  │ │   SDK    │ │  │ │ Transak  │ │
│ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Data Flow

**Authentication Flow:**
```
User Input → AuthModal → Supabase Auth API → Session → AuthProvider → App
```

**Wallet Creation Flow:**
```
Passphrase → Key Generation → Encryption → Local Storage
                                         → Recovery Download
                                         → Hedera Account Creation
                                         → Profile Update
                                         → USDC Association
```

**Deposit Flow (MoonPay):**
```
Deposit Page → MoonPay Widget → User Payment → USDC Delivery
                                             → Mirror Node Polling
                                             → Balance Update
                                             → Transaction Record
```

**Transaction Flow:**
```
Send Form → Validation → Signing (pending) → Hedera SDK (pending)
                                            → Transaction Confirmed
                                            → DB Update
                                            → UI Refresh
```

### Route Structure

```
/ (Public Landing)
│
├── /app (Protected - Auth Required)
│   ├── /dashboard (Wallet overview)
│   ├── /activity (Transaction history)
│   ├── /deposit (Fiat → USDC)
│   ├── /kyc (Identity verification)
│   ├── /invoice (Payment requests)
│   └── /transactions/new (Send money)
```

### Component Hierarchy

```
App
├── QueryClientProvider (TanStack Query)
├── AuthProvider (Supabase Auth)
│   └── BrowserRouter (React Router)
│       ├── AuthModalProvider
│       │   ├── Navbar
│       │   └── Routes
│       │       ├── Index (Landing)
│       │       └── ProtectedRoute
│       │           └── AppLayout
│       │               ├── AppNav
│       │               └── Page Components
└── Toaster (Notifications)
```

---

## 🧪 Testing Status

### Test Coverage Summary

| Module | File | Tests | Status |
|--------|------|-------|--------|
| Onboarding | `src/lib/onboarding.test.ts` | 3 | ✅ Pass |
| Transactions | `src/lib/transactions.test.ts` | 3 | ✅ Pass |
| KYC | `src/lib/kyc.test.ts` | 2 | ✅ Pass |
| Invoice QR | `src/lib/invoice/qr.test.ts` | 5 | ✅ Pass |
| Coinbase | `src/lib/onramp/coinbase.test.ts` | 4 | ✅ Pass |
| Auth Modal | `src/components/auth/AuthModal.test.tsx` | 2 | ✅ Pass |
| Protected Route | `src/components/auth/ProtectedRoute.test.tsx` | 2 | ✅ Pass |
| Onboarding Gate | `src/components/auth/OnboardingGate.test.tsx` | 2 | ✅ Pass |

**Total: 23/23 tests passing (100%)**

### Build Status

- ✅ TypeScript compilation succeeds
- ✅ Vite production build succeeds
- ✅ No type errors
- ⚠️ Bundle size warnings (see Known Issues)

### Test Commands

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Type checking
npx tsc --noEmit

# Build
npm run build
```

---

## ⚠️ Known Issues & Constraints

### Bundle Size Warnings

**Issue:** Several JavaScript chunks exceed 500 kB after minification.

**Impact:** May negatively affect initial load performance, especially on slow mobile connections.

**Recommendation:**
- Implement code-splitting for routes
- Lazy load heavy components
- Use dynamic imports for large libraries
- Optimize/compress images in `src/assets/`

**Files to optimize:**
- Large static images
- Hedera SDK (loaded from CDN, could be tree-shaken)
- Chart libraries (Recharts)

---

### React Router Future Flags

**Issue:** Tests emit warnings about React Router v7 future flags.

**Impact:** Non-breaking, but should be addressed before major React Router upgrade.

**Warning Example:**
```
Unsupported future flags passed: v7_startTransition, v7_relativeSplatPath
```

**Recommendation:** Review React Router migration guide and enable future flags progressively.

---

### Browserslist Outdated

**Issue:** Browserslist database is stale.

**Impact:** Minimal - may affect CSS autoprefixer accuracy.

**Fix:**
```bash
npx update-browserslist-db@latest
```

---

### Operator Credentials Client-Side

**Issue:** Hedera operator credentials are exposed in client-side env variables.

**Impact:** Security risk for production. Currently acceptable for development/testnet only.

**Recommendation:**
- Move account creation to backend/Edge Function for production
- Use account delegation or sponsorship model
- Implement proper key management service

---

### KYC Currently Optional

**Issue:** KYC is not enforced as a blocking step.

**Impact:** Compliance risk depending on jurisdiction.

**Current State:** `OnboardingGate` component exists but is not mounted.

**Recommendation:**
- Determine compliance requirements
- Mount `OnboardingGate` in router if KYC should be mandatory
- Implement tiered limits (unverified vs verified users)

---

### No Production HBAR Prefunding

**Issue:** New accounts need HBAR to operate, but no automated prefunding exists.

**Impact:** Users cannot transact immediately after wallet creation.

**Current Workaround:** Manual operator funding in development.

**Recommendation:**
- Implement automated HBAR prefunding service
- Consider faucet integration for testnet
- Account sponsorship for mainnet

---

### Transaction Send Not Fully Functional

**Issue:** Send flow UI exists but actual blockchain transaction execution is pending.

**Impact:** Users cannot send funds yet.

**Status:** High priority pending feature.

---

### No Off-Ramp UI

**Issue:** Transak webhook is ready but withdrawal UI is not implemented.

**Impact:** Users cannot cash out to fiat.

**Status:** Medium priority pending feature.

---

### KYC Storage Buckets May Not Be Configured

**Issue:** Storage buckets for KYC documents may not be created or RLS policies may not be applied in Supabase.

**Impact:** Users cannot upload KYC documents and will see upload errors.

**Current State:** SQL migrations exist but must be manually run in Supabase.

**Fix:** See detailed guide in [docs/KYC_STORAGE_SETUP.md](docs/KYC_STORAGE_SETUP.md)

**Required Buckets:**
- `kyc-documents` (5MB limit, JPG/PNG/PDF)
- `kyc-selfies` (2MB limit, JPG/PNG)

**Required RLS Policies:**
- Users can upload/view/delete own files only
- Path format: `{user_uuid}/{timestamp}-{filename}`

**Quick Fix:**
```sql
-- Run in Supabase SQL Editor
-- See docs/KYC_STORAGE_SETUP.md for complete SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('kyc-documents', 'kyc-documents', false, 5242880, 
   ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']),
  ('kyc-selfies', 'kyc-selfies', false, 2097152, 
   ARRAY['image/jpeg', 'image/png', 'image/jpg'])
ON CONFLICT DO NOTHING;
```

---

## 🚀 Deployment Considerations

### Pre-Deployment Checklist

#### Environment
- [ ] All production environment variables set
- [ ] MoonPay production API key obtained
- [ ] Coinbase production API credentials configured
- [ ] Hedera mainnet operator account created
- [ ] Supabase production project configured
- [ ] Domain/subdomain configured

#### Security
- [ ] Remove or secure operator credentials
- [ ] Enable RLS policies in Supabase
- [ ] Configure CORS properly
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add CSP headers

#### Performance
- [ ] Optimize bundle size (code-splitting)
- [ ] Compress images
- [ ] Enable Vite build optimizations
- [ ] Configure CDN for static assets
- [ ] Enable Gzip/Brotli compression
- [ ] Implement caching strategy

#### Compliance
- [ ] Legal review of terms of service
- [ ] Privacy policy in place
- [ ] Cookie consent implementation
- [ ] GDPR compliance (if applicable)
- [ ] KYC/AML procedures documented
- [ ] Decide if KYC should be mandatory

#### Monitoring
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics (Google Analytics, Mixpanel, etc.)
- [ ] Performance monitoring (Web Vitals)
- [ ] Uptime monitoring
- [ ] Transaction monitoring
- [ ] Alert system for critical errors

#### Testing
- [ ] End-to-end tests for critical paths
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Load testing
- [ ] Security audit
- [ ] Penetration testing

### Deployment Platforms

**Recommended Platforms:**

1. **Vercel** (Recommended)
   - Automatic deployments from Git
   - Edge network (fast global delivery)
   - Preview deployments for PRs
   - Environment variable management
   - Built-in analytics

2. **Netlify**
   - Similar features to Vercel
   - Edge functions support
   - Form handling
   - Split testing

3. **AWS Amplify**
   - Full AWS integration
   - Custom domains
   - CI/CD pipeline
   - Monitoring and logs

4. **Cloudflare Pages**
   - Free tier generous
   - Global CDN
   - Workers for serverless functions

### Deployment Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint before deploy
npm run lint

# Test before deploy
npm test
```

### Post-Deployment

1. **Verify Critical Paths:**
   - [ ] User signup/login works
   - [ ] Wallet creation works
   - [ ] MoonPay widget loads
   - [ ] Transaction history loads
   - [ ] KYC upload works

2. **Monitor Metrics:**
   - [ ] Page load times
   - [ ] Error rates
   - [ ] Conversion funnel
   - [ ] User retention

3. **Gradual Rollout:**
   - [ ] Beta testing with small user group
   - [ ] Collect feedback
   - [ ] Fix critical issues
   - [ ] Scale up gradually

---

## 📚 Additional Resources

### Documentation Links

- **Supabase:** https://supabase.com/docs
- **Hedera:** https://docs.hedera.com
- **MoonPay:** https://docs.moonpay.com
- **Coinbase Onramp:** https://docs.cdp.coinbase.com/onramp
- **Transak:** https://docs.transak.com
- **Hashport:** https://docs.hashport.network
- **Solana:** https://docs.solana.com
- **React Query:** https://tanstack.com/query/latest
- **Shadcn/ui:** https://ui.shadcn.com

### Project Files

- `currentstate.md` - Detailed technical state
- `docs/current-system-architecture.md` - Architecture deep dive
- `README.md` - Project overview
- `package.json` - Dependencies and scripts

---

## 📞 Contact & Support

For questions about implementation, integrations, or deployment, refer to the documentation above or contact the development team.

**Last Updated:** March 10, 2026
**Version:** 1.0.0
**Status:** Beta - Active Development
