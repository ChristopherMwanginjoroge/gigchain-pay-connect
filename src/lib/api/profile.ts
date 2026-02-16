import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Profile } from "@/types/supabase";
import { restRequest } from "@/lib/supabase/rest";
import { supabaseClient } from "@/lib/supabase/client";

const profileKey = ["profile", "current"] as const;

async function requireUserId() {
  const userId = await supabaseClient.getAuthenticatedUserId();
  if (!userId) {
    throw new Error("No authenticated user found.");
  }
  return userId;
}

async function ensureProfileRow(userId: string): Promise<Profile | null> {
  const authUser = await supabaseClient.getUser();
  const rows = await restRequest<Profile[]>(
    "profiles?select=*",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        id: userId,
        email: authUser.email ?? null,
        phone: authUser.phone ?? null,
      }),
    },
  );
  return rows[0] ?? null;
}

export async function fetchCurrentProfile(): Promise<Profile | null> {
  const userId = await requireUserId();
  const rows = await restRequest<Profile[]>(`profiles?select=*&id=eq.${userId}&limit=1`);
  if (rows[0]) {
    return rows[0];
  }
  return ensureProfileRow(userId);
}

export async function updateCurrentProfile(
  input: Partial<
    Pick<
      Profile,
      | "full_name"
      | "country_code"
      | "avatar_url"
      | "hedera_account_id"
      | "hedera_public_key"
      | "wallet_created_at"
      | "usdc_associated"
      | "usdc_prompt_dismissed"
    >
  >,
) {
  const userId = await requireUserId();
  const rows = await restRequest<Profile[]>(
    `profiles?id=eq.${userId}&select=*`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(input),
    },
  );

  return rows[0] ?? null;
}

export function useProfileQuery() {
  return useQuery({
    queryKey: profileKey,
    queryFn: fetchCurrentProfile,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCurrentProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileKey, profile);
    },
  });
}
