import Link from "next/link";
import { TipCard, MatchCard } from "@/components/molecules";
import { PremiumPromos } from "@/components/organisms";
import type { Tip } from "@/lib/types";
import type { Promo } from "@/components/molecules";
import type { ApiOffer } from "@/lib/definitions";
import mascote from "@/public/assets/mascote-mestregreen.webp";
import { getSession } from "@/lib/devAuth";
import { getOngoingTickets, getUpcomingTickets, getOffers } from "@/lib/api";
import { ticketToTip } from "@/lib/mappers";

// ─── Fallbacks (teaser) ────────────────────────────────────────────────────────
// Exibidos para visitantes DESLOGADOS (sem token para chamar a API) ou enquanto
// não há dados reais. Quando logado, as seções abaixo usam os dados da API.

// TODO: trocar `image` pela arte real de cada promoção (offerImageLink da API)
const FALLBACK_PROMOS: Promo[] = [
  {
    id: "1",
    title: "50% de desconto na sua assinatura anual.",
    href: "/premium",
    image: mascote,
  },
  {
    id: "2",
    title: "Ganhe 7 dias premium grátis.",
    href: "/premium",
    image: mascote,
  },
];

const crest = (id: number) =>
  `https://media.api-sports.io/football/teams/${id}.png`;

const FALLBACK_LIVE_TIPS: Tip[] = [
  {
    id: "1",
    match: {
      id: "m1",
      homeTeam: { name: "Barcelona", logo: crest(529) },
      awayTeam: { name: "Real Madrid", logo: crest(541) },
      league: "La Liga",
      minute: 44,
    },
    description: "6.5 gols na partida",
    odds: 3.45,
    isLive: true,
  },
  {
    id: "2",
    match: {
      id: "m2",
      homeTeam: { name: "Liverpool", logo: crest(40) },
      awayTeam: { name: "Manchester City", logo: crest(50) },
      league: "Premier League",
      minute: 31,
    },
    description: "Ambas as equipes marcam",
    odds: 2.1,
    isLive: true,
  },
  {
    id: "3",
    match: {
      id: "m3",
      homeTeam: { name: "Flamengo", logo: crest(127) },
      awayTeam: { name: "Palmeiras", logo: crest(121) },
      league: "Brasileirão Série A",
      minute: 12,
    },
    description: "Mais de 2.5 gols",
    odds: 1.85,
    isLive: true,
  },
];

const FALLBACK_UPCOMING_TIPS: Tip[] = [
  {
    id: "u1",
    match: {
      id: "um1",
      homeTeam: { name: "Liverpool", logo: crest(40) },
      awayTeam: { name: "Manchester City", logo: crest(50) },
      league: "Premier League",
      date: "17 Jun 2026",
      time: "14h",
    },
    description: "+1.5 gols no primeiro tempo",
    odds: 3.45,
    isLive: false,
  },
  {
    id: "u2",
    match: {
      id: "um2",
      homeTeam: { name: "Barcelona", logo: crest(529) },
      awayTeam: { name: "Real Madrid", logo: crest(541) },
      league: "La Liga",
      date: "18 Jun 2026",
      time: "16h",
    },
    description: "Ambas as equipes marcam",
    odds: 2.1,
    isLive: false,
  },
  {
    id: "u3",
    match: {
      id: "um3",
      homeTeam: { name: "Flamengo", logo: crest(127) },
      awayTeam: { name: "Palmeiras", logo: crest(121) },
      league: "Brasileirão Série A",
      date: "19 Jun 2026",
      time: "21h",
    },
    description: "Mais de 2.5 gols",
    odds: 1.85,
    isLive: false,
  },
];

// Converte uma offer da API no formato `Promo`. A imagem fica no mascote
// (placeholder) até existir arte real + o domínio liberado no next.config.
function offerToPromo(o: ApiOffer): Promo {
  return {
    id: o.id,
    title: o.name,
    href: `/promocoes/${o.id}`,
    image: mascote,
  };
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-display font-semibold text-black">{title}</h2>
      <Link
        href={href}
        className="text-sm text-[#58CC02] hover:text-[#C9FF93] transition-colors"
      >
        Ver mais
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const session = await getSession();
  const token = (session as any)?.accessToken as string | undefined;
  const isLoggedIn = !!token;

  // Logado: puxa dados reais da API. Deslogado: arrays vazios → cai no teaser.
  const [liveTickets, upcomingTickets, offers] = token
    ? await Promise.all([
        getOngoingTickets(token),
        getUpcomingTickets(token),
        getOffers(token),
      ])
    : [[], [], []];

  const liveFromApi = liveTickets.map((t) => ticketToTip(t, true));
  const upcomingFromApi = upcomingTickets
    .sort(
      (a, b) =>
        new Date(a.matches[0].startTime).getTime() -
        new Date(b.matches[0].startTime).getTime()
    )
    .map((t) => ticketToTip(t, false));
  const promosFromApi = offers.map(offerToPromo);

  // Usa os dados reais quando existem; senão, mantém o teaser.
  const liveTips = liveFromApi.length ? liveFromApi.slice(0, 6) : FALLBACK_LIVE_TIPS;
  const upcomingTips = upcomingFromApi.length
    ? upcomingFromApi.slice(0, 6)
    : FALLBACK_UPCOMING_TIPS;
  const promos = promosFromApi.length ? promosFromApi : FALLBACK_PROMOS;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-12">
      <section>
        <SectionHeader title="Promoções" href="/promocoes" />
        <PremiumPromos promos={promos} />
      </section>

      <section>
        <SectionHeader title="Palpites ao vivo" href="/ao-vivo" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Deslogado: até 3 liberados, o resto bloqueado. Logado: todos liberados. */}
          {liveTips.map((tip, i) => (
            <TipCard key={tip.id} tip={tip} locked={!isLoggedIn && i >= 3} />
          ))}
          {!isLoggedIn && <TipCard tip={liveTips[0]} locked />}
        </div>
      </section>

      <section>
        <SectionHeader title="Próximos jogos" href="/jogos" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upcomingTips.map((tip) => (
            <MatchCard key={tip.id} tip={tip} />
          ))}
        </div>
      </section>
    </div>
  );
}
