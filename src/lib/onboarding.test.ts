import { describe, expect, it } from "vitest";
import { evaluateOnboardingState } from "@/lib/onboarding";
import { KycRecord, Profile } from "@/types/supabase";

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: "user-1",
    email: "me@example.com",
    phone: "+254700000000",
    full_name: null,
    avatar_url: null,
    country_code: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hedera_account_id: null,
    hedera_public_key: null,
    wallet_created_at: null,
    usdc_associated: false,
    usdc_prompt_dismissed: false,
    ...overrides,
  };
}

function makeKycRecord(): KycRecord {
  return {
    id: "kyc-1",
    user_id: "user-1",
    status: "pending",
    document_type: "passport",
    document_url: "doc",
    selfie_url: "selfie",
    submitted_at: new Date().toISOString(),
    verified_at: null,
    reviewed_at: null,
    reviewed_by: null,
    rejection_reason: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

describe("evaluateOnboardingState", () => {
  it("returns ready_to_create when no submission exists because KYC is optional", () => {
    const state = evaluateOnboardingState(makeProfile(), []);
    expect(state.status).toBe("ready_to_create");
    expect(state.hasSubmittedKyc).toBe(false);
  });

  it("returns ready_to_create after KYC submission with no wallet", () => {
    const state = evaluateOnboardingState(makeProfile(), [makeKycRecord()]);
    expect(state.status).toBe("ready_to_create");
  });

  it("returns created when wallet and usdc association are present", () => {
    const state = evaluateOnboardingState(
      makeProfile({
        hedera_account_id: "0.0.12345",
        hedera_public_key: "pub",
        usdc_associated: true,
      }),
      [makeKycRecord()],
    );
    expect(state.status).toBe("created");
  });
});
