# GigChain Pay Connect - Integration Roadmap

Visual overview of all integrations and their current status.

Last Updated: March 10, 2026

---

## 🎨 Integration Status Dashboard

### 🟢 Fully Integrated & Working

```
┌─────────────────────────────────────────────────────────────┐
│  SUPABASE                                                   │
│  • Authentication (Email, Phone, Google OAuth)        ✅    │
│  • Database (PostgREST)                               ✅    │
│  • Storage (File uploads)                             ✅    │
│  • Edge Functions (2 deployed)                        ✅    │
│  • Real-time subscriptions                            ✅    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  HEDERA HASHGRAPH                                           │
│  • Account creation                                   ✅    │
│  • USDC token association                             ✅    │
│  • Balance queries (Mirror Node)                      ✅    │
│  • Transaction history                                ✅    │
│  • Key encryption & vault                             ✅    │
│  • Recovery file export                               ✅    │
│  • Network: Testnet ✅   Mainnet ⏳                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  MOONPAY (Primary On-Ramp)                                  │
│  • Widget integration                                 ✅    │
│  • USDC on Hedera support                             ✅    │
│  • 100+ fiat currencies                               ✅    │
│  • Card/Bank/Apple Pay/Google Pay                     ✅    │
│  • Built-in KYC                                       ✅    │
│  • Order tracking                                     ✅    │
│  • Environment: Sandbox ✅   Production ⏳                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  COINBASE ONRAMP                                            │
│  • Session JWT generation                             ✅    │
│  • Multi-blockchain support                           ✅    │
│  • Widget integration                                 ✅    │
│  • Quote API                                          ✅    │
│  • Bridge detection                                   ✅    │
│  • Environment: Sandbox ✅   Production ⏳                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  HASHPORT BRIDGE                                            │
│  • Ethereum ↔ Hedera                                  ✅    │
│  • Polygon ↔ Hedera                                   ✅    │
│  • Fee estimation                                     ✅    │
│  • Widget integration                                 ✅    │
│  • Instructions generator                             ✅    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SOLANA                                                     │
│  • Balance queries (SOL)                              ✅    │
│  • USDC balance queries                               ✅    │
│  • Multi-token support                                ✅    │
│  • React Query hooks                                  ✅    │
│  • Send/Swap                                          ⏳    │
└─────────────────────────────────────────────────────────────┘
```

---

### 🟡 Partially Integrated (Backend Ready, UI Pending)

```
┌─────────────────────────────────────────────────────────────┐
│  TRANSAK (Off-Ramp)                                         │
│  • Webhook endpoint                                   ✅    │
│  • Order status tracking                              ✅    │
│  • Widget code                                        ✅    │
│  • UI integration                                     ⏳    │
│  • User flow                                          ⏳    │
│  • Production testing                                 ⏳    │
│  Purpose: USDC → Fiat withdrawal                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PAYCREST (African Markets)                                 │
│  • API client                                         ✅    │
│  • Rate fetching                                      ✅    │
│  • Order creation                                     ✅    │
│  • UI integration                                     ⏳    │
│  • Payment flow                                       ⏳    │
│  • Supported: KES, UGX, TZS, etc.                          │
│  Purpose: Fiat → Crypto for Africa                         │
└─────────────────────────────────────────────────────────────┘
```

---

### 🔴 Planned / Not Started

```
┌─────────────────────────────────────────────────────────────┐
│  M-PESA (Priority: HIGH)                                    │
│  • API integration                                    ⏳    │
│  • USDC → KES conversion                              ⏳    │
│  • Mobile number verification                         ⏳    │
│  • Transaction limits                                 ⏳    │
│  • Webhook handling                                   ⏳    │
│  Purpose: Critical for Kenyan market cash-out              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  YELLOW CARD                                                │
│  • API integration                                    ⏳    │
│  • Payment flow                                       ⏳    │
│  • Order tracking                                     ⏳    │
│  • Webhook integration                                ⏳    │
│  Purpose: African market fiat on/off-ramp                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PAYCHANT                                                   │
│  • Full API integration                               ⏳    │
│  • Payment flow                                       ⏳    │
│  Purpose: Alternative payment provider                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Feature Completion Matrix

| Feature Category | Completion | Details |
|-----------------|-----------|---------|
| **Authentication** | 🟢 100% | Email, Phone, OAuth all working |
| **Wallet Management** | 🟢 95% | Create ✅, Send pending ⏳ |
| **On-Ramp (Buy)** | 🟢 90% | MoonPay ✅, Coinbase ✅, Others ⏳ |
| **Off-Ramp (Sell)** | 🟡 30% | Transak backend ✅, UI ⏳, M-Pesa ⏳ |
| **KYC/Compliance** | 🟢 85% | Upload ✅, Optional ✅, Mandatory ⏳ |
| **Transactions** | 🟡 60% | History ✅, Receive ✅, Send ⏳ |
| **Invoice System** | 🟢 100% | QR ✅, Signing ✅, Verification ✅ |
| **Multi-Chain** | 🟡 70% | Hedera ✅, Solana view ✅, Bridge ✅ |
| **UI/UX** | 🟢 90% | Landing ✅, App ✅, Dark mode ⏳ |
| **Testing** | 🟢 100% | 23/23 tests passing |

---

## 🎯 Priority Ranking

### P0 - Critical (Blocks Launch)
1. **Send Transaction Execution** - UI ready, chain execution needed
2. **HBAR Auto-Prefunding** - Required for user onboarding
3. **M-Pesa Integration** - Core value proposition for Kenya

### P1 - High Priority (Launch Soon After)
4. **Transak Off-Ramp UI** - Enable withdrawals to bank
5. **Phone → Wallet Lookup** - Core feature for ease of use
6. **Multi-Currency Send** - HBAR and other tokens
7. **Production Security** - Move operator keys to backend

### P2 - Medium Priority (Post-Launch)
8. **Paycrest UI Integration** - More on-ramp options
9. **Yellow Card Integration** - Alternative provider
10. **Wallet Import** - Recovery and migration
11. **Address Book** - Saved contacts
12. **Transaction Receipts** - PDF generation

### P3 - Low Priority (Future)
13. **Dark Mode** - UI enhancement
14. **i18n** - Swahili and other languages
15. **PWA** - Offline support
16. **Analytics** - User insights
17. **2FA/MFA** - Enhanced security

---

## 🔄 Integration Timeline

```
─────────────────────────────────────────────────────────
COMPLETED (Past)                        NOW (March 2026)
─────────────────────────────────────────────────────────
✅ Supabase                                    │
✅ Hedera                                      │
✅ MoonPay                                     │
✅ Coinbase                                    │
✅ Hashport                                    │
✅ Solana (read)                               │
✅ Invoice/QR                                  │
✅ KYC                                         │
✅ Testing                                     │
                                               │
─────────────────────────────────────────────────────────
PLANNED (Next 1-3 Months)
─────────────────────────────────────────────────────────
                                               │ ⏳ Send Execution
                                               │ ⏳ HBAR Prefunding
                                               │ ⏳ M-Pesa (1-2 mo)
                                               │ ⏳ Transak UI
                                               │ ⏳ Phone Lookup
                                               │ ⏳ Paycrest UI
                                               │ ⏳ Security Audit
                                               │
─────────────────────────────────────────────────────────
FUTURE (3+ Months)
─────────────────────────────────────────────────────────
                                               │ ⏳ Yellow Card
                                               │ ⏳ Wallet Import
                                               │ ⏳ Address Book
                                               │ ⏳ Dark Mode
                                               │ ⏳ i18n (Swahili)
                                               │ ⏳ PWA
                                               │ ⏳ 2FA
─────────────────────────────────────────────────────────
```

---

## 🌍 Geographic Coverage

### Current Markets
- 🇺🇸 **United States** - ✅ MoonPay, ✅ Coinbase
- 🇬🇧 **United Kingdom** - ✅ MoonPay, ✅ Coinbase
- 🇪🇺 **European Union** - ✅ MoonPay, ✅ Coinbase
- 🌍 **100+ Countries** - ✅ MoonPay support

### Target Markets (Kenya Focus)
- 🇰🇪 **Kenya** - ✅ MoonPay, ⏳ M-Pesa, ⏳ Paycrest
- 🇺🇬 **Uganda** - ⏳ Paycrest
- 🇹🇿 **Tanzania** - ⏳ Paycrest
- 🇷🇼 **Rwanda** - ⏳ Paycrest
- 🇿🇦 **South Africa** - ⏳ Yellow Card

---

## 💰 Payment Methods Supported

### On-Ramp (Buy Crypto)
- ✅ **Credit/Debit Card** (MoonPay, Coinbase)
- ✅ **Bank Transfer** (MoonPay, Coinbase)
- ✅ **Apple Pay** (MoonPay)
- ✅ **Google Pay** (MoonPay)
- ⏳ **M-Pesa** (Planned)
- ⏳ **Mobile Money** (Paycrest)

### Off-Ramp (Sell Crypto)
- ⏳ **Bank Transfer** (Transak - pending UI)
- ⏳ **M-Pesa** (Planned)
- ⏳ **Mobile Money** (Planned)

---

## 🔐 Security & Compliance

### Implemented
- ✅ Non-custodial architecture
- ✅ Client-side key encryption (PBKDF2 + AES-GCM)
- ✅ Recovery file backup
- ✅ KYC document upload
- ✅ Secure session management
- ✅ HTTPS enforced
- ✅ Input validation
- ✅ File type/size validation

### Pending
- ⏳ Backend key management (move operator keys)
- ⏳ Rate limiting
- ⏳ 2FA/MFA
- ⏳ Security audit
- ⏳ Penetration testing
- ⏳ SOC 2 compliance (future)

---

## 📈 Readiness Assessment

### Beta Launch Readiness: 70%

**Can Launch Beta With:**
- ✅ Signup/Login
- ✅ Wallet creation
- ✅ Receive USDC (via MoonPay)
- ✅ View balance
- ✅ View transaction history
- ✅ Generate invoices

**Blockers for Full Launch:**
- ⚠️ Send functionality not working
- ⚠️ No cash-out to M-Pesa
- ⚠️ No automated HBAR prefunding
- ⚠️ Security audit needed
- ⚠️ Bundle size optimization needed

### Recommendation
**Suitable for:** Closed beta with selected users (receive-only)  
**Not ready for:** Public launch with full send/withdraw functionality

---

## 🎓 Learning Resources

Each integration has documentation:
- **MoonPay:** https://docs.moonpay.com
- **Coinbase:** https://docs.cdp.coinbase.com/onramp
- **Hedera:** https://docs.hedera.com
- **Supabase:** https://supabase.com/docs
- **Transak:** https://docs.transak.com
- **Hashport:** https://docs.hashport.network

---

**Status Legend:**
- 🟢 Complete & Working
- 🟡 Partial / In Progress
- 🔴 Not Started
- ✅ Done
- ⏳ Pending
- ⚠️ Blocker

---

Last Updated: March 10, 2026  
For detailed documentation, see [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)
