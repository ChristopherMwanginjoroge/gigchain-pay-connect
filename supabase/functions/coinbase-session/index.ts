// NOTES:
// - Uses Deno.serve (no std/http import).
// - Expects COINBASE_ONRAMP_API_KEY (key name) and COINBASE_ONRAMP_API_SECRET (base64 64-byte key).
// - Ensures blockchains is an array, adds clientIp.

import { SignJWT, importJWK } from "https://deno.land/x/jose@v4.14.4/index.ts";
import * as base64 from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-forwarded-for",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SessionRequest {
  destinationAddress: string;
  destinationNetwork: string;
  purchaseCurrency: string;
  paymentAmount?: string;
  paymentCurrency?: string;
  paymentMethod?: string;
  country?: string;
  partnerUserRef?: string;
}

function base64UrlEncode(bytes: Uint8Array): string {
  // browser btoa approach
  const binary = Array.from(bytes).map((b) => String.fromCharCode(b)).join("");
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function importCoinbaseEd25519Key(base64Key: string) {
  const rawBytes = base64.decode(base64Key);
  if (rawBytes.length !== 64) {
    throw new Error(`Expected 64-byte Ed25519 key, got ${rawBytes.length} bytes`);
  }
  const privateKeyBytes = rawBytes.slice(0, 32);
  const publicKeyBytes = rawBytes.slice(32);
  const d = base64UrlEncode(privateKeyBytes);
  const x = base64UrlEncode(publicKeyBytes);

  const jwk = {
    kty: "OKP",
    crv: "Ed25519",
    d,
    x,
  };
  return await importJWK(jwk, "EdDSA");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKeyName = Deno.env.get("COINBASE_ONRAMP_API_KEY");
    const apiKeySecret = Deno.env.get("COINBASE_ONRAMP_API_SECRET");
    if (!apiKeyName || !apiKeySecret) throw new Error("Missing Coinbase API credentials");

    // parse and validate body
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const destinationAddress: string = body.destinationAddress || body.address;
    const destinationNetwork: string = body.destinationNetwork || body.network;
    const purchaseCurrency: string = body.purchaseCurrency || body.asset || "USDC";
    const paymentAmount: string | undefined = body.paymentAmount || (body.presetFiatAmount ? body.presetFiatAmount.toString() : undefined);
    const paymentCurrency: string = body.paymentCurrency || body.fiatCurrency || "USD";
    const paymentMethod: string = body.paymentMethod || body.defaultPaymentMethod || "CARD";
    const country: string = body.country || "US";
    const partnerUserRef: string | undefined = body.partnerUserRef || body.partnerUserId;

    if (!destinationAddress || !destinationNetwork || !purchaseCurrency) {
      return new Response(JSON.stringify({ error: "Missing required fields: destinationAddress, destinationNetwork, purchaseCurrency" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get client IP — prefer X-Forwarded-For set by CDN / proxy
    const xff = req.headers.get("x-forwarded-for");
    const clientIp = xff ? xff.split(",")[0].trim() : req.headers.get("x-real-ip") ?? "0.0.0.0";

    // Import key and sign JWT
    const privateKey = await importCoinbaseEd25519Key(apiKeySecret);
    const now = Math.floor(Date.now() / 1000);
    // Use correct CDP platform API endpoint
    const requestUri = "POST api.cdp.coinbase.com/platform/v2/onramp/sessions";
    const jwt = await new SignJWT({
      sub: apiKeyName,
      iss: "coinbase-cloud",
      aud: ["retail_rest_api_proxy"],
      uri: requestUri,
    })
      .setProtectedHeader({
        alg: "EdDSA",
        typ: "JWT",
        kid: apiKeyName,
      })
      .setIssuedAt(now)
      .setNotBefore(now)
      .setExpirationTime(now + 120)
      .sign(privateKey);

    // Build body according to CDP platform API structure
    const requestBody: any = {
      purchaseCurrency,
      destinationNetwork,
      destinationAddress,
      paymentCurrency,
      paymentMethod,
      country,
      clientIp, // REQUIRED for security validation
    };

    // Add optional parameters if provided
    if (paymentAmount) requestBody.paymentAmount = paymentAmount;
    if (partnerUserRef) requestBody.partnerUserRef = partnerUserRef;

    const coinbaseResp = await fetch("https://api.cdp.coinbase.com/platform/v2/onramp/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(requestBody),
    });

    const text = await coinbaseResp.text();
    const status = coinbaseResp.status;

    if (!coinbaseResp.ok) {
      // try parse JSON message
      let parsed = text;
      try { parsed = JSON.parse(text); } catch {}
      return new Response(JSON.stringify({ status, error: parsed }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = JSON.parse(text);
    // Extract the onrampUrl from the session object
    if (data.session && data.session.onrampUrl) {
      return new Response(JSON.stringify({ 
        url: data.session.onrampUrl,
        quote: data.quote 
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    // Return entire response if structure is different
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message || String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});