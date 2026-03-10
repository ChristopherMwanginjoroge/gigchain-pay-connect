import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";
import { supabaseClient } from "@/lib/supabase/client";

export class SupabaseRestError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status = 500, details: unknown = null) {
    super(message);
    this.name = "SupabaseRestError";
    this.status = status;
    this.details = details;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data as { message?: string; error?: string; msg?: string } | null)?.message ??
      (data as { error?: string; msg?: string } | null)?.error ??
      (data as { msg?: string } | null)?.msg ??
      "Supabase request failed";
    throw new SupabaseRestError(message, response.status, data);
  }

  return data as T;
}

export async function restRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { requireAuth?: boolean } = {},
): Promise<T> {
  const requiresAuth = options.requireAuth !== false;
  const token = requiresAuth ? await supabaseClient.getAccessToken() : null;
  if (requiresAuth && !token) {
    throw new SupabaseRestError("No active session. Please sign in again.", 401);
  }
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    ...((init.headers as Record<string, string>) ?? {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers,
  });
  return parseResponse<T>(response);
}

export async function storageUpload(bucket: string, filePath: string, file: File): Promise<void> {
  const token = await supabaseClient.getAccessToken();
  if (!token) {
    throw new SupabaseRestError("No active session", 401);
  }

  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type - let browser handle it for file uploads
      "x-upsert": "false",
    },
    body: file,
  });

  // Parse response to get detailed error if upload fails
  const result = await parseResponse<{ Key?: string; Id?: string }>(response);
  
  // Log the response for debugging
  console.log(`✅ Uploaded to ${bucket}/${filePath}`, result);
}
