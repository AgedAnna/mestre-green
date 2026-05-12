import type { ApiTicketOffer } from "./definitions";

// UI-layer types (mapped from API responses)

export type TeamUI = {
  name: string;
  logo: string;
};

export type MatchUI = {
  id: string;
  homeTeam: TeamUI;
  awayTeam: TeamUI;
  league: string;
  minute?: number;
  date?: string;
  time?: string;
};

export type Tip = {
  id: string;
  match: MatchUI;
  description: string;
  odds: number;
  isLive?: boolean;
  offers?: ApiTicketOffer[];
};
