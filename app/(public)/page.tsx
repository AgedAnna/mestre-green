import Link from "next/link";
import { TipCard, PromoCard } from "@/components/molecules";
import type { Tip } from "@/lib/types";
import type { Promo } from "@/components/molecules";
import mascote from "@/public/assets/mascote-mestregreen.webp";

// TODO: trocar `image` pela arte real de cada promoção (offerImageLink da API)
const PROMOS: Promo[] = [
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

const LIVE_TIPS: Tip[] = [
  {
    id: "1",
    match: {
      id: "m1",
      homeTeam: { name: "Barcelona", logo: "" },
      awayTeam: { name: "Real Madrid", logo: "" },
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
      homeTeam: { name: "Barcelona", logo: "" },
      awayTeam: { name: "Real Madrid", logo: "" },
      league: "La Liga",
      minute: 44,
    },
    description: "6.5 gols na partida",
    odds: 3.45,
    isLive: true,
  },
  {
    id: "3",
    match: {
      id: "m3",
      homeTeam: { name: "Barcelona", logo: "" },
      awayTeam: { name: "Real Madrid", logo: "" },
      league: "La Liga",
      minute: 44,
    },
    description: "6.5 gols na partida",
    odds: 3.45,
    isLive: true,
  },
];

const LEAGUES = [
  { id: "1", name: "Bundesliga", color: "#E32221" },
  { id: "2", name: "Serie A", color: "#1A3E6C" },
  { id: "3", name: "La Liga", color: "#EF4135" },
  { id: "4", name: "Premier League", color: "#380045" },
  { id: "5", name: "Champions League", color: "#003B82" },
  { id: "6", name: "Copa do Mundo", color: "#1A4087" },
  { id: "7", name: "Campeonato Brasileiro A", color: "#097A39" },
  { id: "8", name: "Conmebol Libertadores", color: "#1A1A1A" },
];

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

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-12">
      <section>
        <SectionHeader title="Promoções" href="/promocoes" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {PROMOS.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Palpites ao vivo" href="/ao-vivo" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {LIVE_TIPS.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
          <TipCard tip={LIVE_TIPS[0]} locked />
        </div>
      </section>

      <section>
        <SectionHeader title="Principais ligas" href="/ligas" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {LEAGUES.map((league) => (
            <Link
              key={league.id}
              href={`/ligas/${league.id}`}
              className="shrink-0 flex flex-col items-center gap-2 group"
            >
              <div
                className="w-16 h-16 rounded-[14px] flex items-center justify-center text-white font-bold text-xs text-center px-1 transition-transform group-hover:scale-105"
                style={{ backgroundColor: league.color }}
              >
                {league.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[10px] text-[#ACACAC] text-center w-16 leading-tight">
                {league.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Próximos jogos" href="/promocoes" />
      </section>
    </div>
  );
}
