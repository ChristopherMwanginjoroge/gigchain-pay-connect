# Coinbase Onramp Session Edge Function

This Supabase Edge Function generates One-Click-Buy URLs using Coinbase's CDP Platform API v2 `/platform/v2/onramp/sessions` endpoint. This creates a pre-filled URL with an embedded session token that takes users straight to the payment screen.

## Prerequisites

1. A Coinbase Developer Platform (CDP) project with Onramp enabled
2. An API key with **EC private key** (ES256 format)

## Getting Your Coinbase Credentials

1. Go to [Coinbase Developer Portal](https://portal.cdp.coinbase.com/)
2. Select your project → **API Keys**
3. Create a new API key or use an existing one
4. Download the **private key** (PEM format) - this is your `COINBASE_ONRAMP_API_SECRET`
5. Copy the **API Key Name** - this is your `COINBASE_ONRAMP_API_KEY`

The private key should look like:
```
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIBkg...
-----END EC PRIVATE KEY-----
```

## Setting Up Secrets

Set the secrets in your Supabase project:

```bash
# Set the API key name
supabase secrets set COINBASE_ONRAMP_API_KEY="your-api-key-name"

# Set the EC private key (paste the full PEM including headers)
supabase secrets set COINBASE_ONRAMP_API_SECRET="-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIBkg...
-----END EC PRIVATE KEY-----"
```

Or via the Supabase Dashboard:
1. Go to your project → **Edge Functions** → **Manage Secrets**
2. Add `COINBASE_ONRAMP_API_KEY` with your API key name
3. Add `COINBASE_ONRAMP_API_SECRET` with your EC private key (full PEM)

## Deploying the Function

```bash
# From project root
supabase functions deploy coinbase-session
```

## Testing Locally

```bash
# Start Supabase locally
supabase start

# Set local secrets
supabase secrets set --env-file ./supabase/.env.local

# Serve functions locally
supabase functions serve
```

Create `supabase/.env.local`:
```
COINBASE_ONRAMP_API_KEY=your-api-key-name
COINBASE_ONRAMP_API_SECRET=-----BEGIN EC PRIVATE KEY-----
...your key...
-----END EC PRIVATE KEY-----
```

## API

### POST /functions/v1/coinbase-session

Request:
```json
{
  "destinationAddress": "YourSolanaWalletAddress",
  "destinationNetwork": "solana",
  "purchaseCurrency": "USDC",
  "paymentAmount": "100.00",
  "paymentCurrency": "USD",
  "paymentMethod": "CARD",
  "country": "US",
  "partnerUserRef": "user-1234"
}
```

Response (One-Click-Buy URL with Quote):
```json
{
  "url": "https://pay.coinbase.com/buy?sessionToken=abc123F",
  "quote": {
    "paymentTotal": "100.75",
    "paymentSubtotal": "100.00",
    "paymentCurrency": "USD",
    "purchaseAmount": "100.000000",
    "purchaseCurrency": "USDC",
    "destinationNetwork": "solana",
    "fees": [
      {
        "type": "FEE_TYPE_EXCHANGE",
        "amount": "0.5",
        "currency": "USD"
      }
    ],
    "exchangeRate": "1"
  }
}
```

## Troubleshooting

### "Invalid key" error
- Make sure the private key is in PEM format with headers
- Ensure no extra whitespace or line breaks in the secret

### "Missing credentials" error
- Verify both `COINBASE_ONRAMP_API_KEY` and `COINBASE_ONRAMP_API_SECRET` are set
- Redeploy after setting secrets: `supabase functions deploy coinbase-session`

### CORS errors
- The function includes CORS headers for browser requests
- Make sure your Supabase URL is correctly configured in `.env.local`
