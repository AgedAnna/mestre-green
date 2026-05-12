"use client";

import { useState, useTransition } from "react";
import type { ApiTeam } from "@/lib/definitions";
import { saveFavoriteTeams } from "@/lib/actions/favorites";

interface Props {
  teams: ApiTeam[];
  initialFavoriteIds: number[];
}

export function FavoritesForm({ teams, initialFavoriteIds }: Props) {
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(initialFavoriteIds)
  );
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setFeedback(null);
    startTransition(async () => {
      const result = await saveFavoriteTeams([...selected]);
      setFeedback(result.ok ? "Favoritos salvos!" : result.message ?? "Erro ao salvar.");
    });
  };

  const grouped = teams.reduce<Record<string, ApiTeam[]>>((acc, team) => {
    const league = team.league || "Outros";
    (acc[league] ??= []).push(team);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between sticky top-16 z-30 bg-[#040B00] py-3 -mx-6 px-6 border-b border-[#1F3014]">
        <p className="text-sm text-[#ACACAC]">
          {selected.size} {selected.size === 1 ? "time selecionado" : "times selecionados"}
        </p>
        <div className="flex items-center gap-3">
          {feedback && (
            <span className="text-xs text-[#58CC02]">{feedback}</span>
          )}
          <button
            onClick={handleSave}
            disabled={pending}
            className="h-9 px-5 rounded-full bg-[#58CC02] hover:bg-[#57CB01] text-[#040B00] font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([league, leagueTeams]) => (
        <section key={league} className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-wide text-[#ACACAC]">
            {league}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {leagueTeams.map((team) => {
              const isSelected = selected.has(team.id);
              return (
                <button
                  key={team.id}
                  onClick={() => toggle(team.id)}
                  type="button"
                  className={[
                    "flex items-center gap-3 p-3 rounded-[12px] border transition-colors text-left",
                    isSelected
                      ? "border-[#58CC02] bg-[#58CC02]/10"
                      : "border-[#1F3014] bg-[#111E0C] hover:border-[#58CC02]/30",
                  ].join(" ")}
                >
                  {team.crestLink ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={team.crestLink} alt="" className="w-8 h-8 object-contain" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1F3014]" />
                  )}
                  <span className="text-sm font-medium text-white truncate flex-1">
                    {team.name}
                  </span>
                  {isSelected && (
                    <span className="text-[#58CC02] text-sm">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
