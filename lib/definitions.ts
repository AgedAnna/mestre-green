import { z } from "zod";

// ─── Auth schemas ──────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  // The API uses "username" field — we accept email format from the UI
  username: z
    .string()
    .min(1, { message: "E-mail obrigatório." })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Senha obrigatória." })
    .trim(),
});

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres." })
    .trim(),
  email: z
    .string()
    .email({ message: "E-mail inválido." })
    .trim(),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres." })
    .trim(),
});

// ─── Form state types ──────────────────────────────────────────────────────────

export type LoginFormState =
  | { errors?: { username?: string[]; password?: string[] }; message?: string }
  | undefined;

export type RegisterFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

// ─── API entity types (mirroring backend) ─────────────────────────────────────

export type ApiUser = {
  id: number;
  username: string;
  roles: string[];
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  accountType?: string; // "free" | "premium" | "vip"
  ticketClickCount?: number;
  clickCount?: number;
  createdAt?: string;
};

export type ApiTeam = {
  id: number;
  name: string;
  crestLink: string;
  league: string;
};

export type ApiMatch = {
  id: number;
  startTime: string;
  estimatedEndTime: string;
  teamHome: ApiTeam;
  teamGuest: ApiTeam;
  betTypes: string[];
  betChoices: string[];
};

export type ApiTicketOffer = {
  id: number;
  betHouseId: number;
  betHouseName: string;
  betHouseImageLink: string;
  odd: number;
  ticketLink?: string;
};

export type ApiTicket = {
  id: number;
  betAmount: number;
  profitable: boolean | null;
  earlyPayment: boolean;
  matches: ApiMatch[];
  offers: ApiTicketOffer[];
};

export type ApiOffer = {
  id: number;
  name: string;
  offerDescription: string;
  offerImageLink: string;
  offerButtonLink: string;
};

export type ApiNotification = {
  id: number;
  read: boolean;
  title?: string;
  body?: string;
  createdAt?: string;
};

// ─── Session user (stored in JWT) ─────────────────────────────────────────────

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  roles: string[];
  accountType: string;
};
