import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AuthSession, AuthUser, supabaseClient } from "@/lib/supabase/client";

type AuthContextType = {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<AuthSession | null>;
  signUpWithPhone: (phone: string, password: string) => Promise<AuthSession | null>;
  signInWithEmail: (email: string, password: string) => Promise<AuthSession>;
  signInWithPhone: (phone: string, password: string) => Promise<AuthSession>;
  signInWithGoogle: () => void;
  verifySignupCode: (
    input: { channel: "email"; email: string; code: string } | { channel: "phone"; phone: string; code: string },
  ) => Promise<AuthSession>;
  resendSignupCode: (input: { channel: "email"; email: string } | { channel: "phone"; phone: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await supabaseClient.handleOAuthCallback();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Google sign-in failed.");
      }

      try {
        const currentSession = await supabaseClient.getSession();
        if (!mounted) {
          return;
        }
        setSession(currentSession);
        if (currentSession?.user) {
          setUser(currentSession.user);
        } else if (currentSession?.access_token) {
          const authUser = await supabaseClient.getUser(currentSession.access_token);
          if (mounted) {
            setUser(authUser);
          }
        } else {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    const unsubscribe = supabaseClient.onAuthStateChange((event, changedSession) => {
      setSession(changedSession);
      if (event === "SIGNED_OUT" || !changedSession) {
        setUser(null);
        return;
      }

      if (changedSession.user) {
        setUser(changedSession.user);
        return;
      }

      supabaseClient
        .getUser(changedSession.access_token)
        .then(setUser)
        .catch(() => setUser(null));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      loading,
      signUpWithEmail: (email, password) => supabaseClient.signUpWithEmail(email, password),
      signUpWithPhone: (phone, password) => supabaseClient.signUpWithPhone(phone, password),
      signInWithEmail: (email, password) => supabaseClient.signInWithPassword({ email, password }),
      signInWithPhone: (phone, password) => supabaseClient.signInWithPassword({ phone, password }),
      signInWithGoogle: () => supabaseClient.signInWithGoogle(`${window.location.origin}/app/dashboard`),
      verifySignupCode: (input) => supabaseClient.verifySignupCode(input),
      resendSignupCode: (input) => supabaseClient.resendSignupCode(input),
      signOut: () => supabaseClient.signOut(),
    }),
    [loading, session, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
