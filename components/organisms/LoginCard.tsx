"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { LoginForm } from "@/components/organisms/LoginForm";
import { SignupForm } from "@/components/organisms/SignupForm";
import { ResetPasswordForm } from "@/components/organisms/ResetPasswordForm";
import logoPreto from "@/public/logos/LOGO_MESTREGREEN_HORIZONTAL_PRETO.webp";
import mascote from "@/public/assets/mascote-mestregreen.webp";
import bgModal from "@/public/assets/bg-modal.webp";

type AuthMode = "login" | "signup" | "reset";

interface LoginCardProps {
  onClose?: () => void;
  initialMode?: AuthMode;
}

function LoginCard({ onClose, initialMode = "login" }: LoginCardProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  return (
    <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col sm:flex-row">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#040B00] flex items-center justify-center transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      )}

      {/* Left panel — brand */}
      <div className="relative sm:w-[45%] bg-[#58CC02] flex flex-col items-center justify-start gap-4 sm:gap-6 px-8 py-6 sm:pt-6 sm:pb-8 min-h-0 sm:min-h-80 overflow-hidden">
        <Image
          src={bgModal}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 45vw"
          className="object-cover pointer-events-none select-none"
          aria-hidden
        />

        <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-6">
          <Image
            src={logoPreto}
            alt="Mestre Green"
            fetchPriority="high"
            className="h-10 sm:h-12 w-auto"
          />
          <Image
            src={mascote}
            alt="Mascote Mestre Green"
            className="w-36 sm:w-56 h-auto"
          />
          <p className="font-display font-semibold text-[#040B00] text-2xl text-center leading-tight">
            HOJE É DIA DE
            <br />
            <span className="text-4xl">GREEEN!</span>
          </p>
        </div>
      </div>

      {/* Right panel — form (varies by mode) */}
      <div className="flex-1 bg-white flex flex-col justify-center p-6 sm:p-8">
        {mode === "login" && <LoginForm onModeChange={setMode} />}
        {mode === "signup" && <SignupForm onModeChange={setMode} />}
        {mode === "reset" && <ResetPasswordForm onModeChange={setMode} />}
      </div>
    </div>
  );
}

export { LoginCard };
export type { AuthMode };
