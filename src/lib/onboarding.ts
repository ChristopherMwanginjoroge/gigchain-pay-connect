import { KycRecord, Profile, WalletSetupStatus } from "@/types/supabase";

export interface OnboardingState {
  hasSubmittedKyc: boolean;
  hasWallet: boolean;
  usdcAssociated: boolean;
  status: WalletSetupStatus;
}

export function evaluateOnboardingState(
  profile: Profile | null | undefined,
  kycRecords: KycRecord[] | null | undefined,
): OnboardingState {
  const hasSubmittedKyc = !!kycRecords?.length;
  const hasWallet = !!profile?.hedera_account_id;
  const usdcAssociated = !!profile?.usdc_associated;

  if (!hasWallet) {
    return {
      hasSubmittedKyc,
      hasWallet,
      usdcAssociated,
      status: "ready_to_create",
    };
  }

  if (hasWallet && !usdcAssociated) {
    return {
      hasSubmittedKyc,
      hasWallet,
      usdcAssociated,
      status: "associate_failed",
    };
  }

  return {
    hasSubmittedKyc,
    hasWallet,
    usdcAssociated,
    status: "created",
  };
}
