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

// ─── Auth integration types (login / social / MFA / device verification) ─────

export type SocialProvider = "google" | "apple";

// Mirrors the mobile login flow (auth-client-enhanced.ts). The backend signals:
//   200 → success · 202 → device_verification_required · 401 + "MFA" → mfa_required
export type LoginOutcome =
  | { type: "success"; token: string; expiresInSeconds?: number }
  | { type: "device_verification_required" }
  | { type: "mfa_required" };

// Surfaced to the UI through NextAuth's CredentialsSignin `code`.
export type LoginChallenge = "mfa_required" | "device_verification_required";

// Response of POST /auth/mfa/setup.
export type MfaSetupResponse = { secret: string; qrCodeUrl: string };

// ─── Form state types ──────────────────────────────────────────────────────────

export type LoginFormState =
  | {
      errors?: { username?: string[]; password?: string[] };
      message?: string;
      // When the backend asks for a second step, the UI can branch on this.
      challenge?: LoginChallenge;
    }
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

// ─── API entity types (mirroring backend swagger) ────────────────────────────

// Spring-style paginated wrapper.
export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type AccountType = "FREEMIUM" | "PREMIUM" | "PRO" | "BLACK";

// Mirrors UserResponseDTO from /auth/me, /users/me, /users (paged), /users/{id} (PUT)
export type ApiUser = {
  id: number;
  username: string;
  companyName?: string | null;
  roles: string[];
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  birthDate?: string;
  profilePictureUrl?: string | null;
  favoriteTeamIds?: number[];
  accountType?: AccountType;
  ticketClickCount?: number;
  createdAt?: string;
  daysSinceLastLogin?: number;
  loginCount?: number;
  loginSince?: string;
  clickCount?: number;
  lastClick?: string;
  stateUf?: string;
};

export type ApiTeam = {
  id: number;
  name: string;
  crestLink: string;
  league: string;
};

// MatchDTO — embedded inside ticket responses
export type ApiMatch = {
  id: number;
  startTime: string;
  estimatedEndTime: string;
  teamHome: ApiTeam;
  teamGuest: ApiTeam;
  betTypes: string[];
  betChoices: string[];
};

// MatchResponseDTO — standalone /matches endpoint (no embedded teams; team IDs only)
export type ApiMatchResponse = {
  id: number;
  teamHomeId: number;
  teamGuestId: number;
  startTime: string;
  estimatedEndTime: string;
  betTypes: string[];
  betChoices: string[];
  ownerUsername?: string;
};

export type ApiTicketOffer = {
  id: number;
  betHouseId: number;
  betHouseName: string;
  betHouseImageLink: string;
  odd: number;
  ticketLink?: string;
};

// Mirrors TicketRequestResponseDTO — what /tickets/* endpoints actually return.
// `profitable` can be null while the result is pending.
export type ApiTicket = {
  id: number;
  matchIds?: number[];
  matches: ApiMatch[];
  betAmount: number;
  offers: ApiTicketOffer[];
  profitable: boolean | null;
  earlyPayment: boolean;
  motivation?: string;
  status?: string;
  ownerUsername?: string;
  reviewerUsername?: string;
  reviewerComment?: string;
  createdAt?: string;
  reviewedAt?: string;
};

export type ApiOffer = {
  id: number;
  name: string;
  offerDescription: string;
  offerImageLink: string;
  offerButtonLink: string;
  rulesTitle?: string;
  rulesSubTitle?: string;
  rulesParagraphs?: string[];
  rulesGIFLinks?: string[];
  gradientStartColor?: string;
  gradientEndColor?: string;
  isActive?: boolean;
};

export type ApiBlogPost = {
  id: number;
  title: string;
  excerpt?: string;
  imageLink?: string;
  content: string[];
  isPublished: boolean;
  publishedAt?: string;
  updatedAt?: string;
  ownerUsername?: string;
};

export type ApiNotificationType = "SYSTEM" | "OFFER" | "GAME" | string;

export type ApiNotification = {
  id: number;
  title: string;
  message: string;
  link: string | null;
  createdAt: string;
  read: boolean;
  type?: ApiNotificationType;
};

export type ApiCampaignStats = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  link?: string;
  totalSent: number;
  totalRead: number;
  readPercentage: number;
};

export type ApiBetHouse = {
  id: number;
  name: string;
  imageLink: string;
};

export type ApiMarket = {
  id: number;
  name: string;
  choices: string[];
  ownerUsername?: string;
};

export type ApiVotesSummary = {
  profitableCount: number;
  notProfitableCount: number;
};

export type ApiRankingEntry = {
  id: number;
  username: string;
  consecutiveLoginDays: number;
  clickCount: number;
  score: number;
  rank: number;
};

export type ApiReferralHistoryEntry = {
  id: number;
  name: string;
  email: string;
  date: string;
  avatar: string;
};

export type ApiReferralDashboard = {
  referralCode: string;
  shareableLink: string;
  currentBalance: number;
  totalReferrals: number;
  subs7: number;
  clicks7: number;
  history: ApiReferralHistoryEntry[];
};

export type ApiPaymentMethod = {
  id: number;
  paymentType: string;
  maskedNumber: string;
  brand: string;
  expirationMonth: number;
  expirationYear: number;
  pixKey?: string;
  createdAt: string;
  default: boolean;
};

// ─── Request payload types ───────────────────────────────────────────────────

export type RegistrationPayload = {
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  birthDate: string;
  roles?: string[];
  companyName?: string;
  profilePictureUrl?: string;
  favoriteTeamIds?: number[];
  accountType?: AccountType;
  referralCode?: string;
};

export type CheckoutTier = "FREEMIUM" | "PREMIUM" | "PRO" | "BLACK";
export type CheckoutFrequency = "MONTHLY" | "YEARLY";

export type CheckoutPayload = {
  tier: CheckoutTier;
  frequency: CheckoutFrequency;
};

export type WithdrawPayload = {
  amount: number;
  pixKey: string;
  pixKeyType: string;
};

export type PaymentMethodPayload = {
  paymentType: string;
  gatewayToken: string;
  maskedNumber: string;
  brand: string;
  expirationMonth: number;
  expirationYear: number;
  pixKey?: string;
  default: boolean;
};

export type TicketRequestPayload = {
  matchIds: number[];
  betAmount: number;
  offers: ApiTicketOffer[];
  earlyPayment: boolean;
};

export type DeviceRegisterPayload = {
  deviceDetails: string;
  pushToken: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  expiresInSeconds: number;
};

// ─── Session user (stored in NextAuth JWT) ───────────────────────────────────

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  roles: string[];
  accountType: string;
};
