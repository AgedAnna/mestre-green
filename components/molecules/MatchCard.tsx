"use client";

import { useState } from "react";
import { Trophy, Calendar } from "lucide-react";
import type { Tip } from "@/lib/types";
import { TeamCrest } from "@/components/atoms";
import { TipDetailModal } from "@/components/organisms/TipDetailModal";

interface MatchCardProps {
  tip: Tip;
}

function leagueAbbr(league: string) {
  const words = league.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function MatchCard({ tip }: MatchCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const { match } = tip;

  return (
    <>
      <article className="flex w-full flex-col overflow-hidden rounded-[15px] border border-border bg-black">
        {/* Topo — times + liga */}
        <div className="flex items-start justify-between gap-3 p-4 sm:p-5 bg-[#1D1D1D]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center">
              <TeamCrest
                name={match.homeTeam.name}
                logo={match.homeTeam.logo}
              />
              <TeamCrest
                name={match.awayTeam.name}
                logo={match.awayTeam.logo}
                className="-ml-2 ring-2 ring-black"
              />
            </div>
            <h3 className="text-sm font-semibold leading-tight text-white">
              {match.homeTeam.name} X {match.awayTeam.name}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 text-[#ACACAC]">
            <span className="text-xs font-medium">
              {leagueAbbr(match.league)}
            </span>
            <Trophy size={16} strokeWidth={2} aria-hidden />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="text-[11px] text-[#58CC02]">Palpite da partida</p>
            <p className="truncate text-base font-semibold text-[#58CC02]">
              {tip.description}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-[#ACACAC]">Odd:</p>
            <p className="text-base font-semibold text-[#58CC02]">
              {tip.odds.toFixed(2)}x
            </p>
          </div>
        </div>

        <div className="mx-4 border-t border-white/40 sm:mx-5" />

        <div className="flex flex-col items-stretch gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-2 text-xs text-[#ACACAC]">
            <Calendar size={14} strokeWidth={2} aria-hidden />
            <span className="whitespace-nowrap">
              {match.date}, {match.time}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="inline-flex h-9 w-full shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[#58CC02] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#57CB01] sm:w-auto"
          >
            Comparar odds
          </button>
        </div>
      </article>

      {detailOpen && (
        <TipDetailModal tip={tip} onClose={() => setDetailOpen(false)} />
      )}
    </>
  );
}

export { MatchCard };
export type { MatchCardProps };
