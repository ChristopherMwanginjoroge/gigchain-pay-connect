// Supabase Edge Function: Transak Webhook Handler
// Receives webhook events when Transak order status changes
// Docs: https://docs.transak.com/docs/webhooks

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-transak-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Transak webhook payload structure
 */
interface TransakWebhookPayload {
  webhookData: {
    id: string;
    walletAddress: string;
    createdAt: string;
    status: TransakStatus;
    fiatCurrency: string;
    userId: string;
    cryptoCurrency: string;
    isBuyOrSell: "BUY" | "SELL";
    fiatAmount: number;
    amountPaid?: number;
    paymentOptionId?: string;
    addressAdditionalData?: boolean;
    network: string;
    conversionPrice?: number;
    cryptoAmount?: number;
    totalFeeInFiat?: number;
    fiatAmountInUsd?: number;
    partnerOrderId?: string;
    partnerCustomerId?: string;
    referenceCode?: number;
    transactionHash?: string;
    transactionLink?: string;
    completedAt?: string;
    fromWalletAddress?: string;
    autoRefundReason?: string;
    statusHistories?: Array<{
      status: TransakStatus;
      createdAt: string;
      message?: string;
      isEmailSentToUser?: boolean;
      partnerEventId?: string;
    }>;
  };
  eventID: string;
  createdAt: string;
}

type TransakStatus =
  | "AWAITING_PAYMENT_FROM_USER"
  | "PAYMENT_DONE_MARKED_BY_USER"
  | "PROCESSING"
  | "PENDING_DELIVERY_FROM_TRANSAK"
  | "ON_HOLD_PENDING_DELIVERY_FROM_TRANSAK"
  | "COMPLETED"
  | "CANCELLED"
  | "FAILED"
  | "REFUNDED"
  | "EXPIRED";

/**
 * Map Transak status to our internal transaction status
 */
function mapTransakStatusToInternal(status: TransakStatus): string {
  switch (status) {
    case "AWAITING_PAYMENT_FROM_USER":
    case "PAYMENT_DONE_MARKED_BY_USER":
    case "PROCESSING":
    case "PENDING_DELIVERY_FROM_TRANSAK":
    case "ON_HOLD_PENDING_DELIVERY_FROM_TRANSAK":
      return "pending";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "FAILED":
    case "REFUNDED":
    case "EXPIRED":
      return "failed";
    default:
      return "pending";
  }
}

/**
 * Verify Transak webhook signature using HMAC-SHA256
 * Transak signs the payload with your webhook secret
 */
async function verifyTransakSignature(
  rawBody: string,
  signature: string,
  webhookSecret: string
): Promise<boolean> {
  try {
    // Transak uses HMAC-SHA512 for webhook signatures
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(webhookSecret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(rawBody)
    );

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedSignature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const transakWebhookSecret = Deno.env.get("TRANSAK_WEBHOOK_SECRET");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    // Read raw body for signature verification
    const rawBody = await req.text();
    
    // Verify webhook signature if secret is configured
    if (transakWebhookSecret) {
      const signature = req.headers.get("x-transak-signature") || "";
      const isValid = await verifyTransakSignature(rawBody, signature, transakWebhookSecret);
      
      if (!isValid) {
        console.error("Invalid Transak webhook signature");
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Parse webhook payload
    const payload: TransakWebhookPayload = JSON.parse(rawBody);
    const { webhookData, eventID } = payload;

    console.log(`Transak webhook received: order=${webhookData.id}, status=${webhookData.status}, event=${eventID}`);

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find the transaction by partnerOrderId (our transaction ID)
    if (!webhookData.partnerOrderId) {
      console.log("No partnerOrderId in webhook, skipping transaction update");
      return new Response(
        JSON.stringify({ success: true, message: "Webhook received, no partnerOrderId" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const newStatus = mapTransakStatusToInternal(webhookData.status);

    // Build metadata update
    const metadata: Record<string, unknown> = {
      transak_order_id: webhookData.id,
      transak_status: webhookData.status,
      transak_last_event_id: eventID,
      transak_last_update: new Date().toISOString(),
    };

    // Add additional fields from completed orders
    if (webhookData.cryptoAmount) {
      metadata.crypto_amount = webhookData.cryptoAmount;
    }
    if (webhookData.transactionHash) {
      metadata.transaction_hash = webhookData.transactionHash;
      metadata.transaction_link = webhookData.transactionLink;
    }
    if (webhookData.conversionPrice) {
      metadata.conversion_rate = webhookData.conversionPrice;
    }
    if (webhookData.totalFeeInFiat) {
      metadata.total_fee = webhookData.totalFeeInFiat;
    }
    if (webhookData.completedAt) {
      metadata.completed_at = webhookData.completedAt;
    }
    if (webhookData.autoRefundReason) {
      metadata.refund_reason = webhookData.autoRefundReason;
    }

    // Update transaction in database
    const { data, error } = await supabase
      .from("transactions")
      .update({
        status: newStatus,
        metadata: metadata,
        updated_at: new Date().toISOString(),
      })
      .eq("id", webhookData.partnerOrderId)
      .select()
      .single();

    if (error) {
      console.error("Failed to update transaction:", error);
      // Don't throw - return success to Transak so they don't retry
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Transaction not found",
          partnerOrderId: webhookData.partnerOrderId 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Transaction ${webhookData.partnerOrderId} updated to ${newStatus}`);

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: webhookData.partnerOrderId,
        newStatus,
        transakOrderId: webhookData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Webhook processing error:", error);
    
    // Return 200 to prevent Transak from retrying
    // Log error for debugging but don't fail the webhook
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
