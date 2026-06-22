"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Tip } from "@/lib/types";
import { wizardRain } from "@/lib/wizardRain";
import bgModal from "@/public/assets/bg-modal-palpite.webp";

/** Dispara a chuva de bruxinhos e então redireciona para a casa de aposta. */
function goToBet(href: string) {
  wizardRain(() => {
    window.location.href = href;
  });
}

function Crest({ name, logo }: { name: string; logo?: string }) {
  return (
    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden ring-2 ring-white/70 shrink-0">
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={56}
          height={56}
          className="w-12 h-12 object-contain"
        />
      ) : (
        <span className="text-xl font-bold text-[#040B00]">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
}

function OddPill({ value, onClick }: { value: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center min-w-[68px] h-9 px-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/80 transition-colors"
    >
      {value}
    </button>
  );
}

interface TipDetailModalProps {
  tip: Tip;
  onClose: () => void;
}

function TipDetailModal({ tip, onClose }: TipDetailModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const offers = tip.offers ?? [];

  // Fecha o modal (restaura o scroll do body e desmonta o overlay) antes de
  // disparar a chuva + redirecionar. Sem isso, a navegação não roda o cleanup
  // do useEffect e a tela volta travada ao usar o "voltar" do navegador.
  function handleBet(href: string) {
    onClose();
    goToBet(href);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="animate-modal-fade fixed inset-0 bg-black/50 backdrop-blur-md"
        aria-hidden
      />

      {/* Modal */}
      <div className="animate-modal-pop relative z-10 my-auto w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl shadow-black/50 bg-[#EAF6D4]">
        {/* Header verde com textura */}
        <div className="relative overflow-hidden bg-[#58CC02] px-6 pt-7 pb-8">
          <Image
            src={bgModal}
            alt=""
            sizes="(max-width: 768px) 100vw, 768px"
            className="pointer-events-none select-none absolute inset-x-0 top-0 w-full h-auto"
            aria-hidden
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/25 text-white flex items-center justify-center transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-4">
              <Crest name={tip.match.homeTeam.name} logo={tip.match.homeTeam.logo} />
              <span className="text-white text-lg font-semibold">X</span>
              <Crest name={tip.match.awayTeam.name} logo={tip.match.awayTeam.logo} />
            </div>

            <div>
              {tip.market && (
                <p className="text-xs uppercase tracking-wide text-white/70">
                  {tip.market}
                </p>
              )}
              <p className="text-sm text-white/80">Palpite da partida:</p>
              <h2 className="text-2xl font-semibold text-white leading-tight">
                {tip.description}
              </h2>
            </div>
          </div>
        </div>

        {/* Corpo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Esquerda — justificativa (motivation do bilhete) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[#58CC02] text-center">
              Porque acreditamos nesse palpite?
            </h3>
            <p className="text-[11px] leading-relaxed text-gray-600 text-center whitespace-pre-line">
              {tip.motivation?.trim()
                ? tip.motivation
                : "A análise deste palpite estará disponível em breve."}
            </p>
          </div>

          {/* Direita — casas de aposta e odd salva */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 px-1">
              <span className="text-xs font-medium text-gray-500">
                Casa de aposta
              </span>
              <span className="text-xs font-medium text-gray-500 text-center w-[68px]">
                Odd
              </span>
            </div>

            {offers.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                Nenhuma casa disponível para este palpite.
              </p>
            ) : (
              offers.map((offer) => (
                <div
                  key={offer.id}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3"
                >
                  <button
                    type="button"
                    onClick={() => handleBet(offer.ticketLink || "#")}
                    className="inline-flex items-center justify-center h-9 px-3 rounded-md text-xs font-extrabold tracking-tight truncate bg-[#040B00] text-white hover:opacity-90 transition-opacity"
                    aria-label={`Apostar na ${offer.betHouseName}`}
                  >
                    {offer.betHouseName}
                  </button>
                  <OddPill
                    value={offer.odd.toFixed(2)}
                    onClick={() => handleBet(offer.ticketLink || "#")}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { TipDetailModal };
export type { TipDetailModalProps };
