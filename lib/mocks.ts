import type { ApiOffer, ApiTicket, ApiUser } from "./definitions";

/**
 * Mocks de desenvolvimento.
 *
 * Quando `MOCK_AUTH_ENABLED` é verdadeiro (DEV_FAKE_AUTH=true e fora de
 * produção), o `lib/api.ts` usa estes dados no lugar de bater na API real —
 * permitindo desenvolver as telas logadas sem backend. O login continua
 * sendo necessário: só as credenciais em `MOCK_CREDENTIALS` "logam".
 *
 * Para desligar: remova/zere `DEV_FAKE_AUTH` no `.env.local`.
 */
export const MOCK_AUTH_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.DEV_FAKE_AUTH === "true";

/** Token fake usado quando os mocks estão ligados. */
export const MOCK_TOKEN = "dev-mock-token";

/** Credenciais que "logam" no modo mock. Ajuste como quiser. */
export const MOCK_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export const mockUser: ApiUser = {
  id: 1,
  username: "admin",
  roles: ["user"],
  email: "dev@mestregreen.com",
  fullName: "Dev Tester",
  phone: "+55 11 99999-0000",
  accountType: "free",
  ticketClickCount: 12,
  clickCount: 48,
  createdAt: "2025-01-15T10:00:00.000Z",
};

// ─── Times reutilizáveis ────────────────────────────────────────────────────

/** Escudo do time pelo CDN público da API-Sports. */
const crest = (crestId: number) =>
  `https://media.api-sports.io/football/teams/${crestId}.png`;

const team = (
  id: number,
  name: string,
  league: string,
  crestId: number
): ApiTicket["matches"][number]["teamHome"] => ({
  id,
  name,
  crestLink: crest(crestId),
  league,
});

const offerFor = (
  id: number,
  betHouseName: string,
  odd: number
): ApiTicket["offers"][number] => ({
  id,
  betHouseId: id,
  betHouseName,
  betHouseImageLink: "",
  odd,
  ticketLink: "https://example.com/aposta",
});

// Datas relativas ao "agora" para os jogos parecerem reais
const minutesAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();
const minutesAhead = (m: number) => new Date(Date.now() + m * 60000).toISOString();

export const mockOngoingTickets: ApiTicket[] = [
  {
    id: 101,
    betAmount: 50,
    profitable: null,
    earlyPayment: false,
    matches: [
      {
        id: 1001,
        startTime: minutesAgo(32),
        estimatedEndTime: minutesAhead(58),
        teamHome: team(1, "Flamengo", "Brasileirão Série A", 127),
        teamGuest: team(2, "Palmeiras", "Brasileirão Série A", 121),
        betTypes: ["Resultado Final"],
        betChoices: ["Flamengo vence"],
      },
    ],
    offers: [offerFor(1, "Bet365", 1.85)],
  },
  {
    id: 102,
    betAmount: 30,
    profitable: null,
    earlyPayment: false,
    matches: [
      {
        id: 1002,
        startTime: minutesAgo(12),
        estimatedEndTime: minutesAhead(78),
        teamHome: team(3, "Real Madrid", "La Liga", 541),
        teamGuest: team(4, "Barcelona", "La Liga", 529),
        betTypes: ["Ambas Marcam"],
        betChoices: ["Ambas as equipes marcam"],
      },
    ],
    offers: [offerFor(2, "Betano", 2.1)],
  },
];

export const mockUpcomingTickets: ApiTicket[] = [
  {
    id: 201,
    betAmount: 40,
    profitable: null,
    earlyPayment: false,
    matches: [
      {
        id: 2001,
        startTime: minutesAhead(120),
        estimatedEndTime: minutesAhead(210),
        teamHome: team(5, "Manchester City", "Premier League", 50),
        teamGuest: team(6, "Liverpool", "Premier League", 40),
        betTypes: ["Total de Gols"],
        betChoices: ["Mais de 2.5 gols"],
      },
    ],
    offers: [offerFor(3, "Bet365", 1.72)],
  },
  {
    id: 202,
    betAmount: 25,
    profitable: null,
    earlyPayment: false,
    matches: [
      {
        id: 2002,
        startTime: minutesAhead(300),
        estimatedEndTime: minutesAhead(390),
        teamHome: team(7, "Corinthians", "Brasileirão Série A", 131),
        teamGuest: team(8, "São Paulo", "Brasileirão Série A", 126),
        betTypes: ["Dupla Chance"],
        betChoices: ["Corinthians ou empate"],
      },
    ],
    offers: [offerFor(4, "Betano", 1.45)],
  },
  {
    id: 203,
    betAmount: 60,
    profitable: null,
    earlyPayment: false,
    matches: [
      {
        id: 2003,
        startTime: minutesAhead(480),
        estimatedEndTime: minutesAhead(570),
        teamHome: team(9, "Bayern de Munique", "Bundesliga", 157),
        teamGuest: team(10, "Borussia Dortmund", "Bundesliga", 165),
        betTypes: ["Resultado Final"],
        betChoices: ["Bayern vence"],
      },
    ],
    offers: [offerFor(5, "KTO", 1.6)],
  },
];

export const mockOffers: ApiOffer[] = [
  {
    id: 1,
    name: "Bônus de 100% até R$200",
    offerDescription:
      "Faça seu primeiro depósito e dobre seu saldo para apostar nos melhores palpites.",
    offerImageLink: "",
    offerButtonLink: "https://example.com/promo-1",
  },
  {
    id: 2,
    name: "Aposta grátis de R$50",
    offerDescription:
      "Cadastre-se hoje e ganhe uma aposta grátis para usar em qualquer partida.",
    offerImageLink: "",
    offerButtonLink: "https://example.com/promo-2",
  },
  {
    id: 3,
    name: "Cashback semanal de 10%",
    offerDescription:
      "Receba parte das suas apostas de volta toda semana, sem complicação.",
    offerImageLink: "",
    offerButtonLink: "https://example.com/promo-3",
  },
];
