"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Crown, Check } from "lucide-react";
import bgModal from "@/public/assets/bg-modal.webp";
import mascote from "@/public/assets/mascote_2.webp";
import logo from "@/public/logos/LOGO_MESTREGREEN_HORIZONTAL_PRETO.webp";

const BENEFITS = [
  "Acesso a todos os palpites",
  "Palpites ao vivo ilimitados",
  "Análises completas das partidas",
  "Navegação sem anúncios",
];

interface PremiumModalProps {
  onClose: () => void;
}

function PremiumModal({ onClose }: PremiumModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        aria-hidden
      />

      <div className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/50 grid md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/25 text-[#040B00] flex items-center justify-center transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col gap-5 p-8">
          <Image src={logo} alt="Mestre Green" className="h-auto w-29" />

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#C9FF93] px-3 py-1 text-xs font-semibold text-[#040B00]">
            <Crown size={14} strokeWidth={2.5} color="#58CC02" aria-hidden />
            Premium
          </span>

          <div>
            <h2 className="text-2xl font-display font-semibold text-[#040B00] leading-tight">
              Desbloqueie todos os palpites
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sua conta ainda não é premium. Assine para ter acesso completo aos
              melhores palpites do Mestre Green.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-3 text-sm text-[#040B00]"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#58CC02]">
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="text-white"
                    aria-hidden
                  />
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <Link
            href="/premium"
            onClick={onClose}
            className="mt-2 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[#57CB01] hover:bg-[#57CB01]/90 text-white font-semibold transition-colors"
          >
            <Crown size={18} strokeWidth={2.5} aria-hidden />
            Quero ser premium
          </Link>
        </div>

        {/* Direita — painel decorativo */}
        <div className="relative hidden md:block bg-[#58CC02]">
          <Image
            src={bgModal}
            alt=""
            fill
            sizes="(max-width: 768px) 0px, 384px"
            className="object-cover"
            aria-hidden
          />
          <Image
            src={mascote}
            alt="Mascote Mestre Green"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5/6 h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}

export { PremiumModal };
export type { PremiumModalProps };
