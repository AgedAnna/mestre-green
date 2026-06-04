"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken, getSessionUser } from "@/lib/session";
import { updateUser, type UpdateUserPayload } from "@/lib/api";

/** Updates the logged-in user's profile (PUT /users/{id}). */
export async function updateProfile(
  payload: UpdateUserPayload
): Promise<{ ok: boolean; message?: string }> {
  const token = await getAccessToken();
  const user = await getSessionUser();
  if (!token || !user) return { ok: false, message: "Sessão expirada." };

  const updated = await updateUser(token, user.id, payload);
  if (!updated) return { ok: false, message: "Falha ao atualizar o perfil." };

  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Updates only the avatar. The UI turns the picked file into a data URL
 * (`data:image/jpeg;base64,…`) — exactly what the mobile app sends — and passes
 * it here; image picking itself stays in the UI layer.
 */
export async function updateProfilePicture(
  profilePictureUrl: string
): Promise<{ ok: boolean; message?: string }> {
  return updateProfile({ profilePictureUrl });
}
