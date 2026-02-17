import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthProvider";

vi.mock("@/lib/auth/AuthProvider", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to landing page", async () => {
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
      <MemoryRouter initialEntries={["/app/dashboard"]}>
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Home")).toBeInTheDocument();
  });

  it("renders protected route for authenticated users", async () => {
    mockedUseAuth.mockReturnValue({
      user: { id: "123", email: "me@example.com" },
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
      <MemoryRouter initialEntries={["/app/dashboard"]}>
        <Routes>
          <Route path="/" element={<p>Home</p>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });
});
