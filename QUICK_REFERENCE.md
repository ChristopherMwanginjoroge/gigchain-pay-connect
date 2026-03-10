# GigChain Pay Connect - Quick Reference

Last Updated: March 10, 2026

## 🎯 Project Overview

**GigChain Pay Connect** is a non-custodial cryptocurrency payment platform for freelancers, with a focus on the Kenyan market. Users can receive, send, and manage USDC payments using their phone number as their wallet identity.

---

## ✅ What's Working (Completed)

### Core Features
- ✅ User authentication (Email, Phone, Google OAuth)
- ✅ Non-custodial wallet creation (Hedera)
- ✅ Encrypted key storage with recovery
- ✅ Wallet balance display (HBAR & USDC)
- ✅ Transaction history
- ✅ KYC document upload (optional)
- ✅ Invoice generation with QR codes
- ✅ Fiat on-ramp via MoonPay (Card/Bank → USDC)
- ✅ Fiat on-ramp via Coinbase (Multi-chain)
- ✅ Cross-chain bridging (Hashport)
- ✅ Solana balance viewing
- ✅ Landing page with animations
- ✅ Responsive mobile-first design

### Technical Infrastructure
- ✅ Supabase integration (Auth, DB, Storage, Edge Functions)
- ✅ Hedera SDK integration
- ✅ MoonPay widget integration
- ✅ Coinbase Onramp integration
- ✅ Comprehensive test suite (23/23 tests passing)
- ✅ TypeScript throughout
- ✅ Production build working

---

## 🚧 What's Pending (High Priority)

### Critical Features
- ⏳ **Send Transaction Execution** - UI ready, chain execution pending
- ⏳ **HBAR Auto-Prefunding** - Manual only, needs automation
- ⏳ **M-Pesa Cash-Out** - Not started, critical for Kenya
- ⏳ **Transak Off-Ramp UI** - Webhook ready, UI pending
- ⏳ **Phone → Wallet Lookup** - Infrastructure ready, needs exposure

### Important Features
- ⏳ Multi-currency support (HBAR, other HTS tokens)
- ⏳ Transaction memos/notes
- ⏳ Wallet import functionality
- ⏳ Address book / saved contacts
- ⏳ Transaction receipts
- ⏳ 2FA/MFA

### Nice-to-Have
- ⏳ Dark mode
- ⏳ Internationalization (Swahili priority)
- ⏳ PWA support
- ⏳ Analytics integration
- ⏳ Push notifications

---

## 🔌 Integrations Status

| Integration | Status | Purpose | Notes |
|------------|--------|---------|-------|
| **Supabase** | ✅ Complete | Backend, Auth, DB, Storage | Fully functional |
| **Hedera** | ✅ Complete | Primary blockchain | Read/write ready |
| **MoonPay** | ✅ Complete | Primary on-ramp | Fiat → USDC on Hedera |
| **Coinbase** | ✅ Complete | Secondary on-ramp | Multi-chain support |
| **Hashport** | ✅ Complete | Cross-chain bridge | Eth/Polygon ↔ Hedera |
| **Solana** | ✅ Read-only | Balance viewing | Send not implemented |
| **Transak** | 🚧 Partial | Off-ramp (sell) | Webhook ready, UI pending |
| **Paycrest** | 🚧 Partial | African markets | API ready, not connected |
| **Yellow Card** | ⏳ Planned | African markets | Placeholder only |
| **M-Pesa** | ⏳ Planned | Mobile money KE | Critical, not started |

---

## 🔑 Environment Variables

### Required
```bash
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Hedera
VITE_HEDERA_NETWORK=testnet
VITE_HEDERA_MIRROR_NODE_URL=
VITE_HEDERA_USDC_TOKEN_ID=
VITE_HEDERA_OPERATOR_ID=
VITE_HEDERA_OPERATOR_KEY=

# MoonPay
VITE_MOONPAY_API_KEY=
VITE_MOONPAY_ENVIRONMENT=sandbox

# App
VITE_APP_ENV=development
```

### Optional
```bash
# Coinbase
VITE_COINBASE_ONRAMP_API_KEY=
VITE_COINBASE_ONRAMP_API_SECRET=

# Transak
VITE_TRANSAK_API_KEY=
VITE_TRANSAK_ENVIRONMENT=

# Paycrest
VITE_PAYCREST_API_KEY=
VITE_PAYCREST_API_SECRET=
```

---

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── auth/         # Auth modal, protected routes
│   ├── landing/      # Landing page sections
│   ├── ui/           # Shadcn/ui components
│   └── app/          # App navigation
├── pages/            # Route pages
│   ├── Index.tsx     # Landing page
│   └── app/          # Protected app pages
├── lib/              # Business logic
│   ├── api/          # React Query hooks
│   ├── auth/         # Auth provider
│   ├── hedera/       # Hedera integration
│   ├── onramp/       # Payment providers
│   ├── wallet/       # Key management
│   ├── invoice/      # Invoice/QR system
│   └── supabase/     # Supabase client
└── hooks/            # Custom React hooks

supabase/
└── functions/        # Edge Functions
    ├── coinbase-session/
    └── transak-webhook/
```

---

## 🧪 Testing & Build

```bash
# Development
npm run dev

# Tests
npm test              # Run once
npm run test:watch    # Watch mode

# Build
npm run build         # Production build
npm run preview       # Preview build

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

**Current Test Status:** ✅ 23/23 tests passing

---

## ⚠️ Known Issues

1. **Bundle Size** - Several chunks >500KB, needs optimization
2. **Operator Keys Exposed** - Client-side, dev-only limitation
3. **No HBAR Prefunding** - Manual only, needs automation
4. **Send Not Implemented** - UI ready, execution pending
5. **No Off-Ramp UI** - Backend ready, frontend pending

---

## 🚀 Deployment Readiness

### Ready ✅
- Builds successfully
- Tests passing
- TypeScript clean
- Core flows functional

### Not Ready ⚠️
- Bundle size optimization needed
- Operator credentials need backend migration
- Critical features pending (send, M-Pesa)
- Security audit needed
- Performance testing needed

**Recommendation:** Suitable for beta testing with limited users. Not production-ready for full launch.

---

## 📊 User Flows

### Sign Up → First Deposit
1. User lands on homepage
2. Clicks "Get Started"
3. Signs up with email/phone/Google
4. Creates wallet with passphrase
5. Downloads recovery file
6. Navigates to deposit page
7. Opens MoonPay widget
8. Completes KYC + payment
9. Receives USDC in wallet
10. Views balance on dashboard

### Receive Invoice Payment
1. User generates invoice with amount
2. QR code displayed
3. Payer scans QR
4. Payment sent (pending implementation)
5. User sees transaction in activity

---

## 🔗 Quick Links

- **Full Documentation:** `IMPLEMENTATION_STATUS.md`
- **Architecture:** `docs/current-system-architecture.md`
- **Current State:** `currentstate.md`
- **Package Info:** `package.json`

---

## 📞 For Developers

### Getting Started
1. Clone repo
2. Copy `.env.example` to `.env.local`
3. Fill in environment variables
4. Run `npm install`
5. Run `npm run dev`
6. Visit `http://localhost:5173`

### Before Committing
```bash
npm run lint    # Check code quality
npm test        # Run tests
npm run build   # Verify build works
```

---

**Status:** Active Development  
**Version:** 1.0.0-beta  
**Maintainer:** GigChain Pay Team
