"use client";

import type { Tip } from "@/lib/types";
import { Badge } from "@/components/atoms";

interface TipCardProps {
  tip: Tip;
  onAddClick?: (tip: Tip) => void;
}

function TipCard({ tip, onAddClick }: TipCardProps) {
  return (
    <article className="flex-shrink-0 w-[220px] bg-[#111E0C] rounded-[12px] p-4 flex flex-col gap-3 border border-[#1F3014] hover:border-[#58CC02]/30 transition-colors">
      {/* Teams row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Home team avatar placeholder */}
          <div className="w-7 h-7 rounded-full bg-[#1F3014] flex items-center justify-center text-xs font-bold text-white/60">
            {tip.match.homeTeam.name.charAt(0)}
          </div>
          {/* Away team avatar placeholder */}
          <div className="w-7 h-7 rounded-full bg-[#1F3014] flex items-center justify-center text-xs font-bold text-white/60 -ml-2">
            {tip.match.awayTeam.name.charAt(0)}
          </div>
        </div>
        {tip.isLive && tip.match.minute != null && (
          <span className="text-xs font-semibold text-[#58CC02]">
            {tip.match.minute}&apos;
          </span>
        )}
      </div>

      {/* League */}
      <p className="text-[10px] text-[#ACACAC] uppercase tracking-wide">
        {tip.match.league}
      </p>

      {/* Match name */}
      <h3 className="text-sm font-semibold text-white leading-tight">
        {tip.match.homeTeam.name} X {tip.match.awayTeam.name}
      </h3>

      {/* Tip description */}
      <div>
        <p className="text-[10px] text-[#ACACAC]">Palpite da partida</p>
        <p className="text-sm font-semibold text-[#58CC02]">{tip.description}</p>
      </div>

      {/* Odds + action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Badge variant="green" className="text-xs">
            Odd {tip.odds.toFixed(2)}
          </Badge>
        </div>
        <button
          onClick={() => onAddClick?.(tip)}
          className="w-7 h-7 rounded-full bg-[#1F3014] hover:bg-[#58CC02]/20 flex items-center justify-center text-[#58CC02] transition-colors"
          aria-label="Adicionar palpite"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </article>
  );
}

export { TipCard };
export type { TipCardProps };
