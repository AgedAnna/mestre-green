import { auth } from "@/auth";
import { getOngoingTickets, getUpcomingTickets, getOffers } from "@/lib/api";
import { TipCard } from "@/components/molecules";
import type { ApiTicket } from "@/lib/definitions";
import type { Tip } from "@/lib/types";

function ticketToTip(ticket: ApiTicket, isLive: boolean): Tip {
  const match = ticket.matches[0];
  const primaryOffer = ticket.offers?.[0];
  const startTime = new Date(match.startTime);
  const diffMinutes = Math.floor((Date.now() - startTime.getTime()) / 60000);

  return {
    id: String(ticket.id),
    match: {
      id: String(match.id),
      homeTeam: { name: match.teamHome.name, logo: match.teamHome.crestLink },
      awayTeam: { name: match.teamGuest.name, logo: match.teamGuest.crestLink },
      league: match.teamHome.league,
      minute: isLive && diffMinutes > 0 ? diffMinutes : undefined,
      date: startTime.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      time: startTime.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    },
    description: match.betChoices?.[0] ?? "Palpite da partida",
    odds: primaryOffer?.odd ?? 0,
    isLive,
    offers: ticket.offers,
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const token = (session as any)?.accessToken as string | undefined;
  const name = session?.user?.name?.split(" ")[0] ?? "Usuário";

  const [liveTickets, upcomingTickets, offers] = await Promise.all([
    token ? getOngoingTickets(token) : [],
    token ? getUpcomingTickets(token) : [],
    token ? getOffers(token) : [],
  ]);

  const liveTips = liveTickets.map((t) => ticketToTip(t, true));
  const upcomingTips = upcomingTickets
    .sort(
      (a, b) =>
        new Date(a.matches[0].startTime).getTime() -
        new Date(b.matches[0].startTime).getTime()
    )
    .map((t) => ticketToTip(t, false));

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-display font-semibold text-white">
          Olá, {name} 👋
        </h1>
        <p className="text-sm text-[#ACACAC] mt-1">Confira os palpites de hoje</p>
      </div>

      {/* Palpites ao vivo */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-white">
            Palpites ao vivo
          </h2>
          {liveTips.length > 0 && (
            <span className="text-xs text-[#58CC02] font-semibold">
              {liveTips.length} ao vivo
            </span>
          )}
        </div>

        {liveTips.length === 0 ? (
          <p className="text-sm text-[#ACACAC] py-6 text-center">
            Nenhum palpite ao vivo no momento.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {liveTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </section>

      {/* Próximos jogos */}
      <section>
        <h2 className="text-lg font-display font-semibold text-white mb-4">
          Próximos jogos
        </h2>

        {upcomingTips.length === 0 ? (
          <p className="text-sm text-[#ACACAC] py-6 text-center">
            Nenhum jogo agendado para hoje.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {upcomingTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </section>

      {/* Promoções */}
      {offers.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-white mb-4">
            Promoções
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {offers.map((offer) => (
              <a
                key={offer.id}
                href={offer.offerButtonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[240px] rounded-[12px] bg-[#58CC02] p-5 flex flex-col gap-2 hover:bg-[#57CB01] transition-colors"
              >
                <p className="font-semibold text-[#040B00] text-sm leading-snug">
                  {offer.name}
                </p>
                <p className="text-xs text-[#040B00]/70 line-clamp-2">
                  {offer.offerDescription}
                </p>
                <span className="mt-auto text-xs font-semibold text-[#040B00] underline">
                  Saiba mais
                </span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
