import { getSession } from "@/lib/devAuth";
import { getOngoingTickets, getUpcomingTickets } from "@/lib/api";
import { ticketToTip } from "@/lib/mappers";
import { MatchCard } from "@/components/molecules";

export default async function JogosPage() {
  const session = await getSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [liveTickets, upcomingTickets] = await Promise.all([
    token ? getOngoingTickets(token) : [],
    token ? getUpcomingTickets(token) : [],
  ]);

  const liveTips = liveTickets.map((t) => ticketToTip(t, true));
  const upcomingTips = upcomingTickets
    .sort(
      (a, b) =>
        new Date(a.matches[0].startTime).getTime() -
        new Date(b.matches[0].startTime).getTime()
    )
    .map((t) => ticketToTip(t, false));

  const isEmpty = liveTips.length === 0 && upcomingTips.length === 0;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-display font-semibold text-black">
          Jogos
        </h1>
        <p className="text-sm text-[#ACACAC] mt-1">Acompanhe as partidas</p>
      </div>

      {isEmpty && (
        <p className="text-sm text-[#ACACAC] py-12 text-center">
          Nenhum jogo disponível no momento.
        </p>
      )}

      {upcomingTips.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-black mb-4">
            Próximos jogos
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTips.map((tip) => (
              <MatchCard key={tip.id} tip={tip} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
