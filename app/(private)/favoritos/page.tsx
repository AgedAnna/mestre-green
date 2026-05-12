import { getAccessToken } from "@/lib/session";
import { apiMe, getTeams } from "@/lib/api";
import { FavoritesForm } from "./FavoritesForm";

export default async function FavoritosPage() {
  const token = await getAccessToken();
  if (!token) {
    return (
      <p className="text-sm text-[#ACACAC] py-12 text-center">Sessão expirada.</p>
    );
  }

  const [teams, me] = await Promise.all([
    getTeams(token),
    apiMe(token).catch(() => null),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-display font-semibold text-white">Times favoritos</h1>
        <p className="text-sm text-[#ACACAC] mt-1">
          Acompanhe palpites e jogos dos times que você marca como favoritos.
        </p>
      </header>

      <FavoritesForm
        teams={teams}
        initialFavoriteIds={me?.favoriteTeamIds ?? []}
      />
    </div>
  );
}
