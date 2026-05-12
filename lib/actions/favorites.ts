"use server";

import { revalidatePath } from "next/cache";
import { getAccessToken } from "@/lib/session";
import { updateFavoriteTeams } from "@/lib/api";

export async function saveFavoriteTeams(teamIds: number[]): Promise<{
  ok: boolean;
  message?: string;
}> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sessão expirada." };

  const updated = await updateFavoriteTeams(token, teamIds);
  if (!updated) return { ok: false, message: "Falha ao salvar favoritos." };

  revalidatePath("/favoritos");
  revalidatePath("/dashboard");
  return { ok: true };
}
