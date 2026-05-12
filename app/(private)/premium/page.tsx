import { getAccessToken } from "@/lib/session";
import { apiMe } from "@/lib/api";
import { PlanPicker } from "./PlanPicker";

export default async function PremiumPage() {
  const token = await getAccessToken();
  const me = token ? await apiMe(token).catch(() => null) : null;
  const currentTier = me?.accountType ?? "FREEMIUM";

  return (
    <div className="flex flex-col gap-10">
      <header className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-[#58CC02]">
          Seu plano atual: {currentTier}
        </p>
        <h1 className="text-3xl font-display font-semibold text-white">
          Escolha o plano ideal para você
        </h1>
        <p className="text-sm text-[#ACACAC]">
          Suba de nível e libere acesso completo aos palpites do Mestre Green.
        </p>
      </header>

      <PlanPicker />
    </div>
  );
}
