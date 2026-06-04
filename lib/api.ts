import type {
  ApiBetHouse,
  ApiBlogPost,
  ApiCampaignStats,
  ApiMarket,
  ApiMatchResponse,
  ApiNotification,
  ApiOffer,
  ApiPaymentMethod,
  ApiRankingEntry,
  ApiReferralDashboard,
  ApiTeam,
  ApiTicket,
  ApiUser,
  ApiVotesSummary,
  AuthTokenResponse,
  CheckoutPayload,
  DeviceRegisterPayload,
  LoginOutcome,
  MfaSetupResponse,
  PaginatedResponse,
  PaymentMethodPayload,
  RegistrationPayload,
  SocialProvider,
  TicketRequestPayload,
  WithdrawPayload,
} from "./definitions";

const API_BASE = process.env.API_BASE ?? "https://api.mestregreen.com";

function apiUrl(path: string) {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function qs(params: Record<string, string | number | boolean | undefined | null>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null
  );
  if (entries.length === 0) return "";
  const usp = new URLSearchParams();
  for (const [k, v] of entries) usp.set(k, String(v));
  return `?${usp.toString()}`;
}

const emptyPage = <T>(page = 0, size = 20): PaginatedResponse<T> => ({
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: page,
  size,
});

// ─── Public fetch (no auth) ───────────────────────────────────────────────────

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return res;
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────

export async function authFetch(token: string, path: string, init?: RequestInit) {
  return apiFetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export async function apiLogin(
  username: string,
  password: string
): Promise<string> {
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Credenciais inválidas.");
  }

  const json = await res.json();
  const token: string | undefined =
    json?.accessToken ?? json?.access_token ?? json?.token;

  if (!token) throw new Error("Resposta de login inválida.");
  return token;
}

export async function apiMe(token: string): Promise<ApiUser> {
  const res = await authFetch(token, "/auth/me");
  if (!res.ok) throw new Error("Sessão inválida.");
  return res.json();
}

export async function apiRegister(payload: RegistrationPayload): Promise<ApiUser> {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Falha no cadastro.");
  }
  return res.json();
}

export async function apiRefresh(): Promise<AuthTokenResponse | null> {
  const res = await apiFetch("/auth/refresh", { method: "POST" });
  if (!res.ok) return null;
  return res.json();
}

export async function apiLogout(token: string): Promise<boolean> {
  const res = await authFetch(token, "/auth/logout", { method: "POST" });
  return res.ok;
}

export async function apiRegisterDevice(
  token: string,
  payload: DeviceRegisterPayload
): Promise<boolean> {
  const res = await authFetch(token, "/auth/device/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.ok;
}

// ─── Auth: login with challenges, social, MFA, verification ──────────────────
// These mirror the mobile client (service/auth/auth-client-enhanced.ts) so the
// backend contract stays identical across clients. The UI layer drives them via
// NextAuth (see auth.ts) and the server actions in lib/actions/auth.ts.

/**
 * Full login that distinguishes the three backend outcomes by HTTP status:
 *   200 → success (token) · 202 → device_verification_required · 401+"MFA" → mfa_required.
 * Any other 401 (bad credentials) or non-OK status throws.
 * `mfaCode` is sent as a number; `deviceId` is optional (omit it to skip the
 * device-verification flow entirely — the backend only challenges known users
 * when a deviceId for an unrecognised device is supplied).
 */
export async function apiLoginOutcome(input: {
  username: string;
  password: string;
  mfaCode?: number | null;
  deviceId?: string | null;
}): Promise<LoginOutcome> {
  const body: Record<string, unknown> = {
    username: input.username,
    password: input.password,
  };
  if (input.mfaCode != null) body.mfaCode = input.mfaCode;
  if (input.deviceId) body.deviceId = input.deviceId;

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (res.status === 202) return { type: "device_verification_required" };

  // Verified against the backend: any auth failure — bad credentials, locked
  // account, OR "MFA required" — comes back as an EMPTY 403 (sometimes 401);
  // Spring Security swallows the message, so they're indistinguishable here. We
  // still scan the body for an "mfa" hint in case a backend version includes one.
  if (res.status === 401 || res.status === 403) {
    const text = await res.text().catch(() => "");
    if (text.toLowerCase().includes("mfa")) return { type: "mfa_required" };
    throw new Error(text || "Usuário ou senha incorretos.");
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Falha no login.");
  }

  const json = await res.json();
  const token: string | undefined =
    json?.accessToken ?? json?.access_token ?? json?.token;
  if (!token) throw new Error("Resposta de login inválida.");
  return { type: "success", token, expiresInSeconds: json?.expiresInSeconds };
}

/**
 * Exchanges a Google/Apple identity token for the backend access token. The
 * backend validates the token signature itself (reusing its existing
 * GOOGLE_CLIENT_IDS / Apple config — no OAuth client secret on our side), so the
 * UI only needs to obtain the provider idToken. `firstName`/`lastName` are used
 * by Apple sign-up when the e-mail is hidden.
 */
export async function apiSocialLogin(
  provider: SocialProvider,
  token: string,
  firstName?: string,
  lastName?: string
): Promise<string> {
  const body: Record<string, unknown> = { token };
  if (firstName) body.firstName = firstName;
  if (lastName) body.lastName = lastName;

  const res = await apiFetch(`/auth/${provider}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Falha no login social.");
  }
  const json = await res.json();
  const accessToken: string | undefined =
    json?.accessToken ?? json?.access_token ?? json?.token;
  if (!accessToken) throw new Error("Resposta de login social inválida.");
  return accessToken;
}

/** Starts MFA enrolment for the logged-in user → returns the TOTP secret + QR URL. */
export async function apiMfaSetup(token: string): Promise<MfaSetupResponse | null> {
  const res = await authFetch(token, "/auth/mfa/setup", { method: "POST" });
  if (!res.ok) return null;
  return res.json();
}

/** Confirms and activates MFA with the first 6-digit code from the authenticator app. */
export async function apiMfaVerify(token: string, mfaCode: number): Promise<boolean> {
  const res = await authFetch(token, "/auth/mfa/verify", {
    method: "POST",
    body: JSON.stringify({ mfaCode }),
  });
  return res.ok;
}

/** Confirms a newly-registered account with the 6-digit code e-mailed at sign-up. */
export async function apiConfirmAccount(email: string, code: string): Promise<boolean> {
  const res = await apiFetch("/auth/verification/confirm-account", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  return res.ok;
}

/** Trusts a new device after a 202 device-verification challenge. */
export async function apiConfirmDevice(
  email: string,
  code: string,
  deviceId: string
): Promise<boolean> {
  const res = await apiFetch("/auth/verification/confirm-device", {
    method: "POST",
    body: JSON.stringify({ email, code, deviceId }),
  });
  return res.ok;
}

/** Re-sends the account/device verification code to the user's e-mail. */
export async function apiResendVerification(email: string): Promise<boolean> {
  const res = await apiFetch("/auth/verification/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res.ok;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUsers(
  token: string,
  opts: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<ApiUser>> {
  const { page = 0, size = 50 } = opts;
  const res = await authFetch(token, `/users${qs({ page, size })}`);
  if (!res.ok) return emptyPage<ApiUser>(page, size);
  return res.json();
}

export type UpdateUserPayload = Partial<
  Pick<
    ApiUser,
    | "username"
    | "email"
    | "phone"
    | "fullName"
    | "companyName"
    | "birthDate"
    | "profilePictureUrl"
    | "favoriteTeamIds"
    | "accountType"
    | "roles"
  >
> & { password?: string; referralCode?: string };

export async function updateUser(
  token: string,
  id: string | number,
  payload: UpdateUserPayload
): Promise<ApiUser | null> {
  const res = await authFetch(token, `/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function deleteUser(token: string, id: string | number): Promise<boolean> {
  const res = await authFetch(token, `/users/${id}`, { method: "DELETE" });
  return res.ok;
}

export async function incrementUserClick(
  token: string,
  id: string | number
): Promise<boolean> {
  const res = await authFetch(token, `/users/${id}/click`, { method: "PATCH" });
  return res.ok;
}

export async function updateFavoriteTeams(
  token: string,
  teamIds: number[]
): Promise<ApiUser | null> {
  const res = await authFetch(token, "/users/me/favorites", {
    method: "PUT",
    body: JSON.stringify(teamIds),
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── User payment methods ────────────────────────────────────────────────────

export async function getPaymentMethods(token: string): Promise<ApiPaymentMethod[]> {
  const res = await authFetch(token, "/users/me/payment-methods");
  if (!res.ok) return [];
  return res.json();
}

export async function addPaymentMethod(
  token: string,
  payload: PaymentMethodPayload
): Promise<ApiPaymentMethod | null> {
  const res = await authFetch(token, "/users/me/payment-methods", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function removePaymentMethod(
  token: string,
  id: string | number
): Promise<boolean> {
  const res = await authFetch(token, `/users/me/payment-methods/${id}`, {
    method: "DELETE",
  });
  return res.ok;
}

export async function setDefaultPaymentMethod(
  token: string,
  id: string | number
): Promise<boolean> {
  const res = await authFetch(token, `/users/me/payment-methods/${id}/default`, {
    method: "PATCH",
  });
  return res.ok;
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

export async function getOngoingTickets(token: string): Promise<ApiTicket[]> {
  const res = await authFetch(token, "/tickets/ongoing");
  if (!res.ok) return [];
  return res.json();
}

export async function getUpcomingTickets(token: string): Promise<ApiTicket[]> {
  const res = await authFetch(token, "/tickets/upcoming");
  if (!res.ok) return [];
  return res.json();
}

export async function getFinishedTickets(token: string): Promise<ApiTicket[]> {
  const res = await authFetch(token, "/tickets/finished");
  if (!res.ok) return [];
  return res.json();
}

export async function getTodayTomorrowTickets(token: string): Promise<ApiTicket[]> {
  const res = await authFetch(token, "/tickets/today-tomorrow");
  if (!res.ok) return [];
  return res.json();
}

export async function getTicketHistory(
  token: string,
  opts: { page?: number; size?: number } = {}
): Promise<ApiTicket[]> {
  const { page = 0, size = 20 } = opts;
  const res = await authFetch(token, `/tickets/history${qs({ page, size })}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getVotesSummary(token: string): Promise<ApiVotesSummary | null> {
  const res = await authFetch(token, "/tickets/votes");
  if (!res.ok) return null;
  return res.json();
}

export async function postTicketClick(
  token: string,
  ticketId: string | number
): Promise<boolean> {
  const res = await authFetch(token, `/tickets/${ticketId}/click`, {
    method: "POST",
  });
  return res.ok;
}

// ─── Ticket requests (user submissions) ──────────────────────────────────────

export async function getMyTicketRequests(token: string): Promise<ApiTicket[]> {
  const res = await authFetch(token, "/tickets/requests/me");
  if (!res.ok) return [];
  return res.json();
}

export async function createTicketRequest(
  token: string,
  payload: TicketRequestPayload
): Promise<ApiTicket | null> {
  const res = await authFetch(token, "/tickets/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export async function getMatches(token: string): Promise<ApiMatchResponse[]> {
  const res = await authFetch(token, "/matches");
  if (!res.ok) return [];
  return res.json();
}

export async function getTodayTomorrowMatches(
  token: string
): Promise<ApiMatchResponse[]> {
  const res = await authFetch(token, "/matches/today-tomorrow");
  if (!res.ok) return [];
  return res.json();
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function getTeams(token: string): Promise<ApiTeam[]> {
  const res = await authFetch(token, "/teams");
  if (!res.ok) return [];
  return res.json();
}

// ─── Markets ─────────────────────────────────────────────────────────────────

export async function getMarkets(token: string): Promise<ApiMarket[]> {
  const res = await authFetch(token, "/markets");
  if (!res.ok) return [];
  return res.json();
}

// ─── Bet houses ──────────────────────────────────────────────────────────────

export async function getBetHouses(token: string): Promise<ApiBetHouse[]> {
  const res = await authFetch(token, "/bet-houses");
  if (!res.ok) return [];
  return res.json();
}

// ─── Offers / Promos ─────────────────────────────────────────────────────────

export async function getOffers(token: string): Promise<ApiOffer[]> {
  const res = await authFetch(token, "/offers");
  if (!res.ok) return [];
  return res.json();
}

/**
 * The backend has no `GET /offers/{id}` route — we fetch the full list and pick by id.
 * Mirrors what the mobile `PromoDetail` screen does.
 */
export async function getOffer(
  token: string,
  id: string | number
): Promise<ApiOffer | null> {
  const offers = await getOffers(token);
  const numericId = Number(id);
  return offers.find((o) => o.id === numericId) ?? null;
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogPosts(token: string): Promise<ApiBlogPost[]> {
  const res = await authFetch(token, "/blog-posts");
  if (!res.ok) return [];
  return res.json();
}

export async function getBlogPost(
  token: string,
  id: string | number
): Promise<ApiBlogPost | null> {
  const res = await authFetch(token, `/blog-posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getMyNotifications(
  token: string,
  opts: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<ApiNotification>> {
  const { page = 0, size = 20 } = opts;
  const res = await authFetch(token, `/notifications/mine${qs({ page, size })}`);
  if (!res.ok) return emptyPage<ApiNotification>(page, size);
  return res.json();
}

export async function getUnreadNotificationCount(token: string): Promise<number> {
  const res = await authFetch(token, "/notifications/unread-count");
  if (!res.ok) return 0;
  const value = await res.json();
  return typeof value === "number" ? value : Number(value) || 0;
}

export async function markNotificationRead(
  token: string,
  id: string | number
): Promise<boolean> {
  const res = await authFetch(token, `/notifications/${id}/read`, {
    method: "PUT",
  });
  return res.ok;
}

export async function markAllNotificationsRead(token: string): Promise<boolean> {
  const res = await authFetch(token, "/notifications/read-all", { method: "PUT" });
  return res.ok;
}

// Admin/manager only — list every campaign with delivery stats.
export async function getAllNotifications(
  token: string,
  opts: { page?: number; size?: number } = {}
): Promise<PaginatedResponse<ApiCampaignStats>> {
  const { page = 0, size = 20 } = opts;
  const res = await authFetch(token, `/notifications/all${qs({ page, size })}`);
  if (!res.ok) return emptyPage<ApiCampaignStats>(page, size);
  return res.json();
}

// ─── Ranking ─────────────────────────────────────────────────────────────────

export async function getRanking(
  token: string,
  opts: { company: string; page?: number; size?: number }
): Promise<PaginatedResponse<ApiRankingEntry>> {
  const { company, page = 0, size = 50 } = opts;
  const res = await authFetch(token, `/ranking${qs({ company, page, size })}`);
  if (!res.ok) return emptyPage<ApiRankingEntry>(page, size);
  return res.json();
}

// ─── Referrals ───────────────────────────────────────────────────────────────

export async function getReferralDashboard(
  token: string
): Promise<ApiReferralDashboard | null> {
  const res = await authFetch(token, "/referrals/dashboard");
  if (!res.ok) return null;
  return res.json();
}

export async function withdrawReferralBalance(
  token: string,
  payload: WithdrawPayload
): Promise<boolean> {
  const res = await authFetch(token, "/referrals/withdraw", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.ok;
}

// ─── Payments ────────────────────────────────────────────────────────────────

export async function createCheckout(
  token: string,
  payload: CheckoutPayload
): Promise<Record<string, unknown> | null> {
  const res = await authFetch(token, "/payments/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  return res.json();
}
