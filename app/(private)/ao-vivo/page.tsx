import Link from "next/link";
import { getSession } from "@/lib/devAuth";
import { getOngoingTickets } from "@/lib/api";
import { ticketToTip } from "@/lib/mappers";
import { TipCard } from "@/components/molecules";

export default async function AoVivoPage() {
  const session = await getSession();
  const token = (session as any)?.accessToken as string | undefined;
  const name = session?.user?.name?.split(" ")[0] ?? "Usuário";

  const liveTickets = token ? await getOngoingTickets(token) : [];
  const liveTips = liveTickets.map((t) => ticketToTip(t, true));

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-display font-semibold text-black">
          Olá, {name} 👋
        </h1>
        <p className="text-sm text-[#ACACAC] mt-1">
          Palpites das partidas que estão rolando agora
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-black">
            Palpites ao vivo
          </h2>
          {liveTips.length > 0 && (
            <span className="text-xs text-[#58CC02] font-semibold">
              {liveTips.length} ao vivo
            </span>
          )}
        </div>

        {liveTips.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm text-[#ACACAC]">
              Nenhum palpite ao vivo no momento.
            </p>
            <Link
              href="/jogos"
              className="inline-flex items-center h-10 px-5 text-sm rounded-full bg-[#57CB01] hover:bg-[#57CB01]/90 text-white font-semibold transition-colors"
            >
              Ver próximos jogos
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {liveTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
