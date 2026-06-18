import type { ApiTicket } from "./definitions";
import type { Tip } from "./types";

const MESES = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

/**
 * Converte um ticket da API no formato `Tip` usado pela UI (TipCard etc.).
 * `isLive` marca o palpite como "ao vivo" e calcula o minuto da partida.
 */
export function ticketToTip(ticket: ApiTicket, isLive: boolean): Tip {
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
      date: `${startTime.getDate()} ${MESES[startTime.getMonth()]} ${startTime.getFullYear()}`,
      time: `${String(startTime.getHours()).padStart(2, "0")}h`,
    },
    description: match.betChoices?.[0] ?? "Palpite da partida",
    odds: primaryOffer?.odd ?? 0,
    isLive,
    offers: ticket.offers,
  };
}
