# GigChain Pay Connect - Documentation

This folder contains detailed documentation, troubleshooting guides, and setup instructions.

## 📚 Available Documentation

### Setup & Configuration

- **[KYC_STORAGE_SETUP.md](KYC_STORAGE_SETUP.md)** - Complete guide for setting up KYC storage buckets in Supabase
  - Storage bucket creation
  - RLS policy configuration
  - Troubleshooting upload issues
  - Security best practices

### Architecture & System Design

- **[current-system-architecture.md](current-system-architecture.md)** - Complete system architecture documentation
  - High-level architecture
  - Runtime topology
  - Frontend composition
  - API call catalog
  - End-to-end flows

## 🔗 Main Documentation Files

In the root directory, you'll find:

- **[README.md](../README.md)** - Project overview and quick start
- **[IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md)** - Complete implementation status (main doc)
- **[QUICK_REFERENCE.md](../QUICK_REFERENCE.md)** - Quick reference cheat sheet
- **[INTEGRATION_ROADMAP.md](../INTEGRATION_ROADMAP.md)** - Visual integration status
- **[LAUNCH_CHECKLIST.md](../LAUNCH_CHECKLIST.md)** - Pre-launch checklist
- **[currentstate.md](../currentstate.md)** - Detailed technical state

## 🐛 Troubleshooting Guides

### Common Issues

#### KYC Upload Failing
→ **See:** [KYC_STORAGE_SETUP.md](KYC_STORAGE_SETUP.md)
- Storage buckets not created
- RLS policies missing
- File size or MIME type errors

#### Authentication Issues
→ **See:** [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md#supabase-integration)
- Session management
- OAuth configuration
- Token refresh

#### Wallet Creation Errors
→ **See:** [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md#hedera-integration)
- Operator credentials
- HBAR prefunding
- USDC association

#### Deployment Problems
→ **See:** [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md#deployment-considerations)
- Environment variables
- Build optimization
- Security checklist

## 📖 How to Use This Documentation

1. **Getting Started:** Start with [README.md](../README.md)
2. **Quick Overview:** Check [QUICK_REFERENCE.md](../QUICK_REFERENCE.md)
3. **Detailed Info:** Refer to [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md)
4. **Fixing Issues:** Use guides in this folder (docs/)
5. **Pre-Launch:** Review [LAUNCH_CHECKLIST.md](../LAUNCH_CHECKLIST.md)

## 🆘 Need Help?

If you can't find what you're looking for:

1. Search across all documentation files
2. Check the troubleshooting sections
3. Review error messages in browser console
4. Check Supabase logs in dashboard
5. Verify environment variables in `.env.local`

---

Last Updated: March 10, 2026
