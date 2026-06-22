"use client";

import { useState } from "react";
import { Plus, Lock, X } from "lucide-react";
import type { Tip } from "@/lib/types";
import { Badge, TeamCrest } from "@/components/atoms";
import { useLoginModal } from "@/components/organisms/LoginModalProvider";
import { TipDetailModal } from "@/components/organisms/TipDetailModal";

interface TipCardProps {
  tip: Tip;
  onAddClick?: (tip: Tip) => void;
  locked?: boolean;
  lockedMessage?: string;
}

const BASE =
  "shrink-0 w-full max-w-72 bg-black rounded-[22px] border border-border transition-colors";
const LAYOUT = "p-5 flex flex-col gap-4";

function TipCard({
  tip,
  onAddClick,
  locked = false,
  lockedMessage = "Faça login para ver todos os palpites",
}: TipCardProps) {
  const { openLogin } = useLoginModal();
  const [detailOpen, setDetailOpen] = useState(false);

  const body = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TeamCrest
            name={tip.match.homeTeam.name}
            logo={tip.match.homeTeam.logo}
          />
          <X size={16} strokeWidth={2.5} className="text-white" aria-hidden />
          <TeamCrest
            name={tip.match.awayTeam.name}
            logo={tip.match.awayTeam.logo}
          />
        </div>
        {tip.isLive && tip.match.minute != null && (
          <span className="text-sm font-semibold text-[#58CC02]">
            {tip.match.minute}&apos;
          </span>
        )}
      </div>

      <p className="text-[11px] text-[#ACACAC] uppercase tracking-wide">
        {tip.match.league}
      </p>

      <h3 className="text-base font-semibold text-white leading-tight">
        {tip.match.homeTeam.name} X {tip.match.awayTeam.name}
      </h3>

      <div>
        <p className="text-[11px] text-[#ACACAC] uppercase tracking-wide">
          {tip.market ?? "Palpite da partida"}
        </p>
        <p className="text-base font-semibold text-[#58CC02]">
          {tip.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Badge variant="green" className="text-xs">
            Odd {tip.odds.toFixed(2)}
          </Badge>
        </div>
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.(tip);
          }}
          className="w-7 h-7 rounded-full bg-[#1b1b1b] hover:bg-[#58CC02]/20 flex items-center justify-center text-white transition-colors"
          aria-label="Adicionar palpite"
        >
          <Plus size={12} strokeWidth={2.5} aria-hidden />
        </button> */}
      </div>
    </>
  );

  if (locked) {
    return (
      <article className={`${BASE} relative overflow-hidden`}>
        <div
          className={`${LAYOUT} h-full blur-[3px] select-none pointer-events-none`}
          aria-hidden
        >
          {body}
        </div>

        <button
          type="button"
          onClick={() => openLogin()}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center bg-black/30 backdrop-blur-[2px] hover:bg-black/40 transition-colors"
        >
          <Lock
            size={26}
            strokeWidth={2.5}
            className="text-[#58CC02]"
            aria-hidden
          />
          <p className="text-sm font-medium text-white">{lockedMessage}</p>
        </button>
      </article>
    );
  }

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => setDetailOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setDetailOpen(true);
          }
        }}
        className={`${BASE} ${LAYOUT} cursor-pointer hover:border-[#58CC02]/30`}
      >
        {body}
      </article>

      {detailOpen && (
        <TipDetailModal tip={tip} onClose={() => setDetailOpen(false)} />
      )}
    </>
  );
}

export { TipCard };
export type { TipCardProps };
