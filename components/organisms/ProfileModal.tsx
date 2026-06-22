"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  ArrowLeft,
  Settings,
  History,
  CircleDollarSign,
  Gem,
  Star,
  FileText,
  CircleHelp,
  ChevronRight,
  ChevronDown,
  Lock,
  UserRound,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { usePremiumModal } from "@/components/organisms/PremiumModalProvider";
import { MatchCard } from "@/components/molecules";
import type { Tip } from "@/lib/types";
import logo from "@/public/logos/LOGO_MESTREGREEN_HORIZONTAL_PRETO.webp";

interface ProfileUser {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  accountType?: string | null;
}

interface ProfileModalProps {
  user?: ProfileUser | null;
  onClose: () => void;
}

type View = "overview" | "settings" | "history" | "terms" | "help";

const TITLES: Record<View, string> = {
  overview: "Visão geral",
  settings: "Configurações de conta",
  history: "Histórico de palpites",
  terms: "Termos de uso",
  help: "Central de ajuda",
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

// FAQ da Central de ajuda. Perguntas baseadas no produto: o Mestre Green é uma
// plataforma de palpites/dicas de apostas esportivas (não é casa de apostas),
// com palpites ao vivo, próximos jogos, promoções de parceiros e plano Premium.
const FAQ = [
  {
    q: "O que é o Mestre Green?",
    a: "O Mestre Green é uma plataforma de palpites e dicas para apostas esportivas. Analisamos as partidas e sugerimos os melhores palpites, com as odds das casas de apostas parceiras.",
  },
  {
    q: "O Mestre Green é uma casa de apostas?",
    a: "Não. Não recebemos apostas nem pagamentos. Apenas indicamos palpites e direcionamos você para as casas de apostas parceiras, onde a aposta é de fato realizada.",
  },
  {
    q: "Os palpites são garantidos?",
    a: "Não existe garantia de acerto. Apostas esportivas envolvem risco e os palpites são análises e sugestões. Aposte sempre com responsabilidade e dentro do seu limite.",
  },
  {
    q: "O que está incluído no plano Premium?",
    a: "O Premium libera acesso a todos os palpites, palpites ao vivo ilimitados, análises completas das partidas e navegação sem anúncios.",
  },
  {
    q: "Como vejo os palpites ao vivo?",
    a: "Os palpites ao vivo ficam na seção “Ao vivo”. É preciso estar logado para acompanhar as partidas em tempo real e ver os palpites desbloqueados.",
  },
  {
    q: "Como funcionam as promoções?",
    a: "Na seção “Promoções” reunimos bônus e ofertas das casas de apostas parceiras. Ao abrir uma promoção, você vê os detalhes e o link para aproveitá-la na casa correspondente.",
  },
  {
    q: "Preciso ser maior de 18 anos?",
    a: "Sim. Apostas esportivas são permitidas apenas para maiores de 18 anos. Jogue com responsabilidade.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-gray-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-xs md:text-sm font-medium text-[#040B00]"
      >
        {q}
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          aria-hidden
          className={`shrink-0 text-[#58CC02] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open ? (
        <p className="px-5 pb-4 text-xs md:text-sm leading-relaxed text-[#5A5A5A]">
          {a}
        </p>
      ) : null}
    </div>
  );
}

// TODO: dados reais virão da API quando o backend expor stats/conquistas.
// Por enquanto são placeholders para montar a estrutura da tela.
const STATS = [
  { label: "Palpites", value: "592" },
  { label: "Acertos", value: "391" },
  { label: "Rank", value: "9º" },
];

// `unlocked` controla o quadro verde (conquistado) vs. cadeado.
const ACHIEVEMENTS = [
  { id: 1, unlocked: true },
  { id: 2, unlocked: true },
  { id: 3, unlocked: false },
  { id: 4, unlocked: false },
  { id: 5, unlocked: false },
];

// TODO: histórico real virá da API. Placeholder para montar a tela.
const crest = (id: number) =>
  `https://media.api-sports.io/football/teams/${id}.png`;

const HISTORY: Tip[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `h${i}`,
  match: {
    id: `hm${i}`,
    homeTeam: { name: "Liverpool", logo: crest(40) },
    awayTeam: { name: "Manchester United", logo: crest(33) },
    league: "Premier League",
    date: "17 Jan 2026",
    time: "14h",
  },
  market: "Palpite da partida",
  description: "+1.5 gols no primeiro tempo",
  odds: 3.45,
  isLive: false,
}));

const INPUT =
  "w-full rounded-xl bg-white px-4 py-3 text-xs md:text-sm text-[#040B00] outline-none ring-1 ring-gray-200 placeholder:text-gray-300 focus:ring-2 focus:ring-[#58CC02]";

function Field({
  label,
  className,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-xs md:text-sm font-medium text-[#040B00]">
        {label}
      </span>
      <input className={INPUT} {...props} />
    </label>
  );
}

function ProfileModal({ user, onClose }: ProfileModalProps) {
  const { openPremium } = usePremiumModal();
  const [view, setView] = useState<View>("overview");

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

  // Menu lateral. `view` troca a tela; `onClick` para ações pontuais; o resto
  // é placeholder visual até existirem as telas correspondentes.
  const menu: {
    label: string;
    icon: LucideIcon;
    view?: View;
    onClick?: () => void;
  }[] = [
    { label: "Configurações da conta", icon: Settings, view: "settings" },
    { label: "Histórico de palpites", icon: History, view: "history" },
    // { label: "Métodos de pagamento", icon: CircleDollarSign },
    // {
    //   label: "Adquirir o Premium",
    //   icon: Gem,
    //   onClick: () => {
    //     onClose();
    //     openPremium();
    //   },
    // },
    // { label: "Convidar um amigo", icon: Star },
    { label: "Termos de uso", icon: FileText, view: "terms" },
    { label: "Central de ajuda", icon: CircleHelp, view: "help" },
  ];

  const name = user?.name ?? "Usuário";
  const handle = user?.username ? `@${user.username}` : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md"
        aria-hidden
      />

      <div className="relative z-10 my-auto flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#F1F1F1] shadow-2xl shadow-black/50 md:grid md:h-[min(88vh,680px)] md:grid-cols-[268px_1fr]">
        {/* ─── Sidebar ─── (no mobile vai abaixo do conteúdo) */}
        <aside className="order-2 flex flex-col bg-white p-7 md:order-0 md:overflow-y-auto">
          <button
            type="button"
            onClick={() => setView("overview")}
            aria-label="Ir para a visão geral"
            className="mb-8 hidden w-fit md:block"
          >
            <Image src={logo} alt="Mestre Green" className="h-auto w-32" />
          </button>

          <nav className="flex flex-col">
            {menu.map(({ label, icon: Icon, view: target, onClick }) => {
              const isActive = !!target && target === view;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => (target ? setView(target) : onClick?.())}
                  className={`flex items-center gap-3 border-b border-gray-100 py-4 text-left text-xs md:text-sm transition-colors hover:text-[#040B00] ${
                    isActive ? "font-semibold text-[#040B00]" : "text-[#5A5A5A]"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden
                  />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ─── Conteúdo ─── */}
        <div className="order-1 flex flex-col md:order-0 md:overflow-hidden">
          {/* Cabeçalho fixo */}
          <div className="flex items-center justify-between px-8 pt-8 pb-4 md:px-10 md:pt-10">
            <div className="flex items-center gap-2">
              {view !== "overview" && (
                <button
                  type="button"
                  onClick={() => setView("overview")}
                  aria-label="Voltar para a visão geral"
                  className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#040B00] transition-colors hover:bg-black/10"
                >
                  <ArrowLeft size={20} strokeWidth={2.5} />
                </button>
              )}
              <h2 className="text-lg md:text-xl font-display font-semibold text-[#040B00]">
                {TITLES[view]}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#ACACAC] transition-colors hover:bg-black/10 hover:text-[#040B00]"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Corpo rolável */}
          <div className="flex flex-col gap-8 px-8 pb-8 md:min-h-0 md:flex-1 md:overflow-y-auto md:px-10 md:pb-10">
            {view === "overview" && (
              <>
                {/* Identidade */}
                <div className="flex items-center gap-5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-200">
                    {user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-gray-400">
                        <UserRound size={40} strokeWidth={2} aria-hidden />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold text-[#040B00] leading-tight">
                      {name}
                    </h3>
                    {handle ? (
                      <p className="mt-1 text-xs md:text-sm text-[#ACACAC]">
                        {handle}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-3 divide-x divide-white/15 rounded-2xl bg-[#040B00] py-7">
                  {STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-xl md:text-2xl font-display font-semibold text-[#58CC02]">
                        {stat.value}
                      </span>
                      <span className="text-xs md:text-sm text-white">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Conquistas */}
                {/* <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-between text-left"
                  >
                    <span className="text-xl font-display font-semibold text-[#040B00]">
                      Conquistas
                    </span>
                    <ChevronRight
                      size={22}
                      strokeWidth={2}
                      className="text-[#040B00]"
                      aria-hidden
                    />
                  </button>

                  <div className="flex gap-4">
                    {ACHIEVEMENTS.map((a) => (
                      <div
                        key={a.id}
                        className={`flex aspect-square w-full max-w-[120px] items-center justify-center rounded-2xl ${
                          a.unlocked ? "bg-[#58CC02]" : "bg-[#040B00]"
                        }`}
                      >
                        {a.unlocked ? null : (
                          <Lock
                            size={26}
                            strokeWidth={2.5}
                            className="text-[#58CC02]"
                            aria-hidden
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div> */}
              </>
            )}

            {view === "settings" && (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-7"
              >
                {/* Avatar + identidade */}
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[#58CC02]"
                  >
                    {user?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/15 text-[11px] font-medium text-white transition-colors group-hover:bg-black/30">
                      <Camera size={22} strokeWidth={2} aria-hidden />
                      Adicionar foto
                    </span>
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold text-[#040B00] leading-tight">
                      {name}
                    </h3>
                    {handle ? (
                      <p className="mt-1 text-xs md:text-sm text-[#ACACAC]">
                        {handle}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Field label="Nome" placeholder="Ex: Cristiano" />
                  <Field label="Sobrenome" placeholder="Ex: Ronaldo" />
                  <Field
                    label="Nome do usuário"
                    defaultValue={user?.username ?? ""}
                    className="sm:col-span-2"
                  />
                  <Field label="CPF" placeholder="123456789" />
                  <Field label="Número de contato" placeholder="123456789" />
                  <Field
                    label="Email"
                    type="email"
                    defaultValue={user?.email ?? ""}
                    className="sm:col-span-2"
                  />
                  <Field
                    label="Endereço"
                    placeholder="Rua, número, cidade"
                    className="sm:col-span-2"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 h-12 rounded-full bg-[#58CC02] font-semibold text-white transition-colors hover:bg-[#57CB01]"
                >
                  Salvar alterações
                </button>
              </form>
            )}

            {view === "history" && (
              <div className="flex flex-col gap-4">
                {HISTORY.map((tip) => (
                  <MatchCard key={tip.id} tip={tip} />
                ))}
              </div>
            )}

            {view === "terms" && (
              <div className="flex flex-col gap-5">
                <h3 className="text-xl md:text-2xl font-display font-semibold text-[#040B00]">
                  Termos e condições de uso
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-[#5A5A5A]">
                  {LOREM}
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-[#5A5A5A]">
                  {LOREM}
                </p>
                <p className="text-xs md:text-sm leading-relaxed text-[#5A5A5A]">
                  {LOREM}
                </p>
              </div>
            )}

            {view === "help" && (
              <div className="flex flex-col gap-3">
                {FAQ.map((item) => (
                  <FaqItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProfileModal };
export type { ProfileModalProps, ProfileUser };
