import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase/config";

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
  expires_at?: number;
  user?: AuthUser;
}

type AuthEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED";
type AuthListener = (event: AuthEvent, session: AuthSession | null) => void;

type VerifySignupCodeInput =
  | { channel: "email"; email: string; code: string }
  | { channel: "phone"; phone: string; code: string };

const SESSION_STORAGE_KEY = "gigpay.supabase.session";
const EXPIRY_MARGIN_SECONDS = 30;

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function buildAuthHeaders(accessToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

export class SupabaseAuthError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status = 500, details: unknown = null) {
    super(message);
    this.name = "SupabaseAuthError";
    this.status = status;
    this.details = details;
  }
}

class SupabaseClient {
  private listeners = new Set<AuthListener>();
  private inMemorySession: AuthSession | null = null;

  private emit(event: AuthEvent, session: AuthSession | null) {
    for (const listener of this.listeners) {
      listener(event, session);
    }
  }

  private readSessionFromStorage(): AuthSession | null {
    if (typeof window === "undefined") {
      return this.inMemorySession;
    }
    return safeParseJson<AuthSession>(window.localStorage.getItem(SESSION_STORAGE_KEY));
  }

  private saveSession(session: AuthSession | null) {
    this.inMemorySession = session;
    if (typeof window === "undefined") {
      return;
    }

    if (!session) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  private normalizeSession(partial: AuthSession): AuthSession {
    const normalized: AuthSession = { ...partial };
    if (!normalized.expires_at && normalized.expires_in) {
      normalized.expires_at = Math.floor(Date.now() / 1000) + normalized.expires_in;
    }
    return normalized;
  }

  private async authRequest<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${SUPABASE_URL}/auth/v1${path}`, init);
    const text = await response.text();
    const data = text ? safeParseJson<T>(text) : null;

    if (!response.ok) {
      const message =
        (data as { error_description?: string; msg?: string; message?: string } | null)?.error_description ??
        (data as { msg?: string; message?: string } | null)?.msg ??
        (data as { message?: string } | null)?.message ??
        "Supabase auth request failed";
      throw new SupabaseAuthError(message, response.status, data);
    }

    return data as T;
  }

  private async withRefresh(session: AuthSession): Promise<AuthSession | null> {
    if (!session.expires_at) {
      return session;
    }

    const now = Math.floor(Date.now() / 1000);
    const isExpiring = session.expires_at - now <= EXPIRY_MARGIN_SECONDS;
    if (!isExpiring) {
      return session;
    }

    if (!session.refresh_token) {
      this.saveSession(null);
      this.emit("SIGNED_OUT", null);
      return null;
    }

    const refreshed = await this.authRequest<AuthSession>("/token?grant_type=refresh_token", {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    });

    const normalized = this.normalizeSession(refreshed);
    this.saveSession(normalized);
    this.emit("TOKEN_REFRESHED", normalized);
    return normalized;
  }

  async getSession(): Promise<AuthSession | null> {
    const current = this.readSessionFromStorage();
    if (!current) {
      return null;
    }
    return this.withRefresh(current);
  }

  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.access_token ?? null;
  }

  async getUser(accessToken?: string): Promise<AuthUser> {
    const token = accessToken ?? (await this.getAccessToken());
    if (!token) {
      throw new SupabaseAuthError("No active session", 401);
    }
    return this.authRequest<AuthUser>("/user", {
      method: "GET",
      headers: buildAuthHeaders(token),
    });
  }

  async getAuthenticatedUserId(): Promise<string> {
    const token = await this.getAccessToken();
    if (!token) {
      throw new SupabaseAuthError("No active session", 401);
    }
    const user = await this.getUser(token);
    if (!user?.id) {
      throw new SupabaseAuthError("Authenticated user id is missing", 401);
    }
    return user.id;
  }

  async signUpWithEmail(email: string, password: string): Promise<AuthSession | null> {
    const data = await this.authRequest<AuthSession & { user?: AuthUser }>("/signup", {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!data.access_token) {
      return null;
    }

    const normalized = this.normalizeSession(data);
    this.saveSession(normalized);
    this.emit("SIGNED_IN", normalized);
    return normalized;
  }

  async signUpWithPhone(phone: string, password: string): Promise<AuthSession | null> {
    const data = await this.authRequest<AuthSession & { user?: AuthUser }>("/signup", {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify({ phone, password }),
    });

    if (!data.access_token) {
      return null;
    }

    const normalized = this.normalizeSession(data);
    this.saveSession(normalized);
    this.emit("SIGNED_IN", normalized);
    return normalized;
  }

  async signInWithPassword(params: { email?: string; phone?: string; password: string }): Promise<AuthSession> {
    const body = params.email
      ? { email: params.email, password: params.password }
      : { phone: params.phone, password: params.password };

    const data = await this.authRequest<AuthSession>("/token?grant_type=password", {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(body),
    });

    const normalized = this.normalizeSession(data);
    if (!normalized.user) {
      normalized.user = await this.getUser(normalized.access_token);
    }
    this.saveSession(normalized);
    this.emit("SIGNED_IN", normalized);
    return normalized;
  }

  async verifySignupCode(input: VerifySignupCodeInput): Promise<AuthSession> {
    const payload =
      input.channel === "email"
        ? {
            type: "signup",
            email: input.email,
            token: input.code,
          }
        : {
            type: "sms",
            phone: input.phone,
            token: input.code,
          };

    const data = await this.authRequest<AuthSession>("/verify", {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const normalized = this.normalizeSession(data);
    if (!normalized.user) {
      normalized.user = await this.getUser(normalized.access_token);
    }
    this.saveSession(normalized);
    this.emit("SIGNED_IN", normalized);
    return normalized;
  }

  async resendSignupCode(input: { channel: "email"; email: string } | { channel: "phone"; phone: string }) {
    const payload =
      input.channel === "email"
        ? { type: "signup", email: input.email }
        : { type: "sms", phone: input.phone };

    await this.authRequest<unknown>("/resend", {
      method: "POST",
      headers: buildAuthHeaders(),
      body: JSON.stringify(payload),
    });
  }

  signInWithGoogle(redirectTo: string) {
    const url = new URL(`${SUPABASE_URL}/auth/v1/authorize`);
    url.searchParams.set("provider", "google");
    url.searchParams.set("redirect_to", redirectTo);
    window.location.assign(url.toString());
  }

  async signOut() {
    const session = await this.getSession();
    if (session?.access_token) {
      try {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST",
          headers: buildAuthHeaders(session.access_token),
        });
      } catch {
        // local cleanup still needed even if remote call fails
      }
    }
    this.saveSession(null);
    this.emit("SIGNED_OUT", null);
  }

  async handleOAuthCallback(): Promise<AuthSession | null> {
    if (typeof window === "undefined") {
      return null;
    }

    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
    if (!hash) {
      return null;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const tokenType = params.get("token_type");
    const expiresIn = params.get("expires_in");
    const errorDescription = params.get("error_description");

    if (errorDescription) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      throw new SupabaseAuthError(errorDescription, 401);
    }

    if (!accessToken || !refreshToken || !tokenType) {
      return null;
    }

    const session: AuthSession = this.normalizeSession({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType,
      expires_in: expiresIn ? Number(expiresIn) : undefined,
    });
    session.user = await this.getUser(accessToken);
    this.saveSession(session);
    this.emit("SIGNED_IN", session);

    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    return session;
  }

  onAuthStateChange(listener: AuthListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const supabaseClient = new SupabaseClient();
