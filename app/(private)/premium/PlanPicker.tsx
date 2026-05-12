"use client";

import { useState, useTransition } from "react";
import { startCheckout } from "@/lib/actions/checkout";
import type { CheckoutFrequency, CheckoutTier } from "@/lib/definitions";

type Plan = {
  tier: CheckoutTier;
  name: string;
  tagline: string;
  perks: string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    tier: "PREMIUM",
    name: "Premium",
    tagline: "Acesso completo aos palpites e análises diárias.",
    perks: [
      "Palpites ao vivo ilimitados",
      "Histórico completo",
      "Notificações em tempo real",
    ],
  },
  {
    tier: "PRO",
    name: "Pro",
    tagline: "Para quem leva apostas a sério.",
    perks: [
      "Tudo do Premium",
      "Estatísticas avançadas por time",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  {
    tier: "BLACK",
    name: "Black",
    tagline: "Experiência completa, com mentoria e benefícios exclusivos.",
    perks: [
      "Tudo do Pro",
      "Análises personalizadas",
      "Acesso ao grupo VIP",
    ],
  },
];

export function PlanPicker() {
  const [frequency, setFrequency] = useState<CheckoutFrequency>("MONTHLY");
  const [pendingTier, setPendingTier] = useState<CheckoutTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleSelect = (tier: CheckoutTier) => {
    setError(null);
    setPendingTier(tier);
    startTransition(async () => {
      const result = await startCheckout({ tier, frequency });
      if (result.ok && result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }
      setError(result.message ?? "Erro inesperado.");
      setPendingTier(null);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="inline-flex self-center rounded-full border border-[#1F3014] bg-[#111E0C] p-1">
        {(["MONTHLY", "YEARLY"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFrequency(opt)}
            disabled={pendingTier !== null}
            className={[
              "h-9 px-5 rounded-full text-sm font-medium transition-colors",
              frequency === opt
                ? "bg-[#58CC02] text-[#040B00]"
                : "text-[#ACACAC] hover:text-white",
            ].join(" ")}
          >
            {opt === "MONTHLY" ? "Mensal" : "Anual"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const isLoading = pendingTier === plan.tier;
          return (
            <article
              key={plan.tier}
              className={[
                "rounded-[12px] border p-6 flex flex-col gap-4 bg-[#111E0C] transition-colors",
                plan.highlight
                  ? "border-[#58CC02]"
                  : "border-[#1F3014] hover:border-[#58CC02]/40",
              ].join(" ")}
            >
              <header className="flex items-center justify-between">
                <h2 className="text-lg font-display font-semibold text-white">
                  {plan.name}
                </h2>
                {plan.highlight && (
                  <span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-[#58CC02] text-[#040B00] font-semibold">
                    Mais escolhido
                  </span>
                )}
              </header>
              <p className="text-sm text-[#ACACAC]">{plan.tagline}</p>
              <ul className="flex flex-col gap-2 text-sm text-white/85">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="text-[#58CC02] mt-0.5">✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelect(plan.tier)}
                disabled={pendingTier !== null}
                className={[
                  "mt-2 h-11 rounded-full font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                  plan.highlight
                    ? "bg-[#58CC02] hover:bg-[#57CB01] text-[#040B00]"
                    : "border border-[#58CC02] text-[#58CC02] hover:bg-[#58CC02]/10",
                ].join(" ")}
              >
                {isLoading ? "Redirecionando..." : "Assinar"}
              </button>
            </article>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
