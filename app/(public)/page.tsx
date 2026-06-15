import Link from "next/link";
import { TipCard, LoginTrigger } from "@/components/molecules";
import type { Tip } from "@/lib/types";

// Placeholder data — will come from API/DB
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
      <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
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
    <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col gap-12">
      {/* Palpites ao vivo */}
      <section>
        <SectionHeader title="Palpites ao vivo" href="/ao-vivo" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {LIVE_TIPS.map((tip) => (
            <TipCard key={tip.id} tip={tip} />
          ))}
          {/* Blur lock overlay hint for non-logged users */}
          <div className="flex-shrink-0 w-[220px] rounded-[12px] bg-[#111E0C]/60 border border-[#1F3014] flex flex-col items-center justify-center gap-3 p-6 backdrop-blur-sm">
            <span className="text-3xl">🔒</span>
            <p className="text-sm text-center text-[#ACACAC]">
              Faça login para ver todos os palpites
            </p>
            <LoginTrigger className="text-sm font-semibold text-[#58CC02] hover:underline">
              Entrar
            </LoginTrigger>
          </div>
        </div>
      </section>

      {/* Principais ligas */}
      <section>
        <h2 className="text-xl font-display font-semibold text-white mb-4">
          Principais ligas
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {LEAGUES.map((league) => (
            <Link
              key={league.id}
              href={`/ligas/${league.id}`}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
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

      {/* CTA para login */}
      <section className="rounded-[16px] bg-gradient-to-r from-[#58CC02]/20 to-[#040B00] border border-[#58CC02]/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-white mb-2">
            Acesse todos os palpites
          </h2>
          <p className="text-[#ACACAC] text-sm">
            Entre na plataforma para acompanhar palpites ao vivo, próximos jogos e muito mais.
          </p>
        </div>
        <LoginTrigger className="shrink-0 inline-flex items-center h-12 px-8 text-base rounded-full bg-[#58CC02] hover:bg-[#57CB01] text-[#040B00] font-semibold transition-colors">
          Acessar conta
        </LoginTrigger>
      </section>
    </div>
  );
}
