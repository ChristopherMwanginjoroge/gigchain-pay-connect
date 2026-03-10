import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { buildStoragePath, validateKycPayload } from "@/lib/kyc";
import { restRequest, storageUpload } from "@/lib/supabase/rest";
import { supabaseClient } from "@/lib/supabase/client";
import { KycRecord, SubmitKycInput } from "@/types/supabase";

const kycKey = ["kyc", "records"] as const;

async function requireUserId() {
  const userId = await supabaseClient.getAuthenticatedUserId();
  if (!userId) {
    throw new Error("No authenticated user found.");
  }
  return userId;
}

export async function fetchKycRecords(): Promise<KycRecord[]> {
  const userId = await requireUserId();
  return restRequest<KycRecord[]>(`kyc?select=*&user_id=eq.${userId}&order=created_at.desc`);
}

export async function submitKyc(payload: SubmitKycInput): Promise<KycRecord> {
  validateKycPayload(payload);
  const userId = await requireUserId();
  const now = Date.now();

  const documentPath = buildStoragePath(userId, payload.documentFile.name, now);
  const selfiePath = buildStoragePath(userId, payload.selfieFile.name, now + 1);

  console.log("🔍 KYC Upload Debug:");
  console.log("  User ID:", userId);
  console.log("  Document Path:", documentPath);
  console.log("  Selfie Path:", selfiePath);
  console.log("  Document File:", payload.documentFile.name, payload.documentFile.type, payload.documentFile.size);
  console.log("  Selfie File:", payload.selfieFile.name, payload.selfieFile.type, payload.selfieFile.size);

  try {
    await storageUpload("kyc-documents", documentPath, payload.documentFile);
    console.log("✅ Document uploaded successfully");
  } catch (error) {
    console.error("❌ Document upload failed:", error);
    throw new Error(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    await storageUpload("kyc-selfies", selfiePath, payload.selfieFile);
    console.log("✅ Selfie uploaded successfully");
  } catch (error) {
    console.error("❌ Selfie upload failed:", error);
    throw new Error(`Failed to upload selfie: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const rows = await restRequest<KycRecord[]>(
    "kyc?select=*",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id: userId,
        document_type: payload.documentType,
        document_url: `kyc-documents/${documentPath}`,
        selfie_url: `kyc-selfies/${selfiePath}`,
        status: "pending",
      }),
    },
  );

  if (!rows[0]) {
    throw new Error("Failed to create KYC record.");
  }

  return rows[0];
}

export function useKycQuery() {
  return useQuery({
    queryKey: kycKey,
    queryFn: fetchKycRecords,
  });
}

export function useSubmitKycMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kycKey });
    },
  });
}
