"use client";

import { useState } from "react";
import { Plus, Lock } from "lucide-react";
import type { Tip } from "@/lib/types";
import { Badge } from "@/components/atoms";
import { useLoginModal } from "@/components/organisms/LoginModalProvider";
import { TipDetailModal } from "@/components/organisms/TipDetailModal";

interface TipCardProps {
  tip: Tip;
  onAddClick?: (tip: Tip) => void;
  /** Exibe o card borrado com cadeado + mensagem (para usuários deslogados). */
  locked?: boolean;
  lockedMessage?: string;
}

const BASE =
  "shrink-0 w-55 bg-black rounded-[12px] border border-border transition-colors";
const LAYOUT = "p-4 flex flex-col gap-3";

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
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-xs font-bold text-white/60">
            {tip.match.homeTeam.name.charAt(0)}
          </div>
          <div className="w-7 h-7 rounded-full bg-border flex items-center justify-center text-xs font-bold text-white/60 -ml-2">
            {tip.match.awayTeam.name.charAt(0)}
          </div>
        </div>
        {tip.isLive && tip.match.minute != null && (
          <span className="text-xs font-semibold text-[#58CC02]">
            {tip.match.minute}&apos;
          </span>
        )}
      </div>

      <p className="text-[10px] text-[#ACACAC] uppercase tracking-wide">
        {tip.match.league}
      </p>

      <h3 className="text-sm font-semibold text-white leading-tight">
        {tip.match.homeTeam.name} X {tip.match.awayTeam.name}
      </h3>

      <div>
        <p className="text-[10px] text-[#58CC02]">Palpite da partida</p>
        <p className="text-sm font-semibold text-[#58CC02]">
          {tip.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <Badge variant="green" className="text-xs">
            Odd {tip.odds.toFixed(2)}
          </Badge>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddClick?.(tip);
          }}
          className="w-7 h-7 rounded-full bg-[#1b1b1b] hover:bg-[#58CC02]/20 flex items-center justify-center text-white transition-colors"
          aria-label="Adicionar palpite"
        >
          <Plus size={12} strokeWidth={2.5} aria-hidden />
        </button>
      </div>
    </>
  );

  if (locked) {
    return (
      <article className={`${BASE} relative overflow-hidden`}>
        {/* Mesmo conteúdo, borrado e inerte */}
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
