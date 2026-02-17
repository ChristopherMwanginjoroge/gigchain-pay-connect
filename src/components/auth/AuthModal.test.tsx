import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/auth/AuthProvider";

vi.mock("@/lib/auth/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("AuthModal", () => {
  it("switches between phone and email methods", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signInWithEmail: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithPhone: vi.fn(),
      signOut: vi.fn(),
      signUpWithEmail: vi.fn(),
      signUpWithPhone: vi.fn(),
      verifySignupCode: vi.fn(),
      resendSignupCode: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthModal open onOpenChange={vi.fn()} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Phone Number")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Email" }));
    expect(await screen.findByLabelText("Email")).toBeInTheDocument();
  });

  it("moves to confirm signup screen after signup requires verification", async () => {
    const signUpWithPhone = vi.fn().mockResolvedValue(null);
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      loading: false,
      signInWithEmail: vi.fn(),
      signInWithGoogle: vi.fn(),
      signInWithPhone: vi.fn(),
      signOut: vi.fn(),
      signUpWithEmail: vi.fn(),
      signUpWithPhone,
      verifySignupCode: vi.fn(),
      resendSignupCode: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AuthModal open onOpenChange={vi.fn()} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign Up" }));
    fireEvent.change(screen.getByPlaceholderText("+254712345678"), { target: { value: "+254712345678" } });
    fireEvent.change(screen.getByLabelText("Password", { selector: "input[type=\"password\"]" }), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign Up with Phone" }));

    expect(await screen.findByText("Confirm Your Signup")).toBeInTheDocument();
  });
});
