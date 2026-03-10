# GigChain Pay Connect | Global Payment Platform

GigChain Pay Connect is a non-custodial global payment platform built for freelancers and gig workers. It enables users to receive, send, and manage cryptocurrency payments (primarily USDC) using just their phone number as their payment identity.

## 🌟 Key Features

- **Phone Number = Wallet**: No need to remember complex crypto addresses
- **Non-Custodial**: You own your keys and control your funds
- **Multi-Chain Support**: Hedera, Solana, and cross-chain bridging
- **Mobile-First**: Designed for M-Pesa-ready markets
- **Fiat On-Ramp**: Buy USDC with card, bank, Apple Pay, Google Pay
- **Compliance-Ready**: Built-in KYC and regulatory compliance

## 📚 Documentation

We have comprehensive documentation for different purposes:

- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 5-minute overview and cheat sheet
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - Complete implementation documentation
- **[INTEGRATION_ROADMAP.md](INTEGRATION_ROADMAP.md)** - Visual integration status dashboard
- **[LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)** - Pre-launch checklist and timeline
- **[currentstate.md](currentstate.md)** - Detailed technical state
- **[docs/current-system-architecture.md](docs/current-system-architecture.md)** - Architecture deep dive

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- MoonPay API key (for fiat on-ramp)

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_GIT_URL>
   cd gigchain-pay-connect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **UI Components**: Shadcn/ui (Radix UI + Tailwind)
- **State Management**: TanStack React Query
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Blockchain**: Hedera Hashgraph, Solana
- **On-Ramp**: MoonPay, Coinbase Onramp
- **Testing**: Vitest, Testing Library

## 📊 Current Status

**Overall Completion: ~75%**

### ✅ What's Working
- User authentication (Email, Phone, Google OAuth)
- Wallet creation and management
- Fiat → USDC via MoonPay and Coinbase
- Balance viewing and transaction history
- KYC document upload
- Invoice generation with QR codes
- Cross-chain bridging (Hashport)

### 🚧 In Progress
- Send transaction execution (UI ready, chain execution pending)
- M-Pesa integration (critical for Kenya)
- Transak off-ramp UI (withdrawal to bank)
- HBAR auto-prefunding

See [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md) for complete details.

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Type checking
npx tsc --noEmit

# Build
npm run build
```

**Current Test Status**: ✅ 23/23 tests passing

## 🌍 Integrations

### Fully Integrated ✅
- Supabase (Auth, DB, Storage)
- Hedera Hashgraph (Wallet, USDC)
- MoonPay (Primary on-ramp)
- Coinbase Onramp
- Hashport Bridge
- Solana (Read-only)

### Partially Integrated 🟡
- Transak (Off-ramp webhook ready)
- Paycrest (API ready, UI pending)

### Planned ⏳
- M-Pesa (High priority for Kenya)
- Yellow Card
- Additional payment providers

See [INTEGRATION_ROADMAP.md](INTEGRATION_ROADMAP.md) for visual status.

## 📦 Project Structure

```
src/
├── components/       # React components
│   ├── auth/        # Authentication
│   ├── landing/     # Landing page
│   ├── ui/          # UI components (Shadcn)
│   └── app/         # App navigation
├── pages/           # Route pages
│   ├── Index.tsx    # Landing page
│   └── app/         # Protected pages
├── lib/             # Business logic
│   ├── api/         # React Query hooks
│   ├── hedera/      # Hedera integration
│   ├── onramp/      # Payment providers
│   ├── wallet/      # Key management
│   └── supabase/    # Supabase client
└── hooks/           # Custom React hooks
```

## 🔐 Security

- Non-custodial architecture (users control their keys)
- Client-side encryption (PBKDF2 + AES-GCM)
- Recovery file backup system
- Secure session management
- Input validation and sanitization

**Note**: Currently in development/testnet mode. Production deployment requires additional security measures (see [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)).

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check the [documentation](IMPLEMENTATION_STATUS.md)
- Review the [FAQ](IMPLEMENTATION_STATUS.md#known-issues--constraints)

---

**Built for the future of global transactions** 🌍💰

Last Updated: March 10, 2026 4aa3d48a46cf5da241083c4d8e77adf2fa8f4b59
