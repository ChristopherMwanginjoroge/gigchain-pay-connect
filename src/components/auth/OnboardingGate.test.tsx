import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import OnboardingGate from "@/components/auth/OnboardingGate";
import { useKycQuery } from "@/lib/api/kyc";

vi.mock("@/lib/api/kyc", () => ({
  useKycQuery: vi.fn(),
}));

const mockedUseKycQuery = vi.mocked(useKycQuery);

describe("OnboardingGate", () => {
  it("redirects users without KYC to /app/kyc", async () => {
    mockedUseKycQuery.mockReturnValue({
      data: [],
      isLoading: false,
    } as unknown as ReturnType<typeof useKycQuery>);

    render(
      <MemoryRouter initialEntries={["/app/dashboard"]}>
        <Routes>
          <Route path="/app/kyc" element={<p>KYC Page</p>} />
          <Route element={<OnboardingGate />}>
            <Route path="/app/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("KYC Page")).toBeInTheDocument();
  });

  it("allows users with KYC submissions", async () => {
    mockedUseKycQuery.mockReturnValue({
      data: [{ id: "kyc-1" }],
      isLoading: false,
    } as unknown as ReturnType<typeof useKycQuery>);

    render(
      <MemoryRouter initialEntries={["/app/dashboard"]}>
        <Routes>
          <Route path="/app/kyc" element={<p>KYC Page</p>} />
          <Route element={<OnboardingGate />}>
            <Route path="/app/dashboard" element={<p>Dashboard</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });
});
