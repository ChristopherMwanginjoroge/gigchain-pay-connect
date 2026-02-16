import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

type AuthModalContextType = {
  openAuthModal: () => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const value = useMemo<AuthModalContextType>(
    () => ({
      openAuthModal: () => setOpen(true),
      closeAuthModal: () => setOpen(false),
    }),
    [],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal open={open} onOpenChange={setOpen} />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within AuthModalProvider.");
  }
  return context;
}
