import type { ApiOffer, ApiTicket, ApiUser } from "./definitions";
import {
  MOCK_AUTH_ENABLED,
  MOCK_CREDENTIALS,
  MOCK_TOKEN,
  mockOffers,
  mockOngoingTickets,
  mockUpcomingTickets,
  mockUser,
} from "./mocks";

const API_BASE = process.env.API_BASE ?? "https://api.mestregreen.com";

function apiUrl(path: string) {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  return res;
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────

export async function authFetch(
  token: string,
  path: string,
  init?: RequestInit
) {
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
  // DEV: só as credenciais mock "logam" e recebem o token fake.
  if (MOCK_AUTH_ENABLED) {
    if (
      username === MOCK_CREDENTIALS.username &&
      password === MOCK_CREDENTIALS.password
    ) {
      return MOCK_TOKEN;
    }
    throw new Error("Usuário ou senha incorretos.");
  }

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  // 202 → backend exige verificação de dispositivo/conta por e-mail
  if (res.status === 202) {
    throw new Error(
      "Verifique sua conta pelo link enviado ao seu e-mail antes de entrar."
    );
  }

  if (res.status === 401) {
    const text = await res.text().catch(() => "");
    if (text.toLowerCase().includes("mfa")) {
      throw new Error("Autenticação em duas etapas (MFA) necessária.");
    }
    throw new Error("Usuário ou senha incorretos.");
  }

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

export async function apiRegister(
  name: string,
  email: string,
  password: string
): Promise<void> {
  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Não foi possível criar a conta.");
  }
}

export async function apiRequestPasswordReset(email: string): Promise<void> {
  const res = await apiFetch("/auth/password/reset-request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Não foi possível enviar o e-mail de recuperação.");
  }
}

export async function apiMe(token: string): Promise<ApiUser> {
  if (MOCK_AUTH_ENABLED) return mockUser;

  const res = await authFetch(token, "/auth/me");
  if (!res.ok) throw new Error("Sessão inválida.");
  return res.json();
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

export async function getOngoingTickets(token: string): Promise<ApiTicket[]> {
  if (MOCK_AUTH_ENABLED) return mockOngoingTickets;

  const res = await authFetch(token, "/tickets/ongoing");
  if (!res.ok) return [];
  return res.json();
}

export async function getUpcomingTickets(token: string): Promise<ApiTicket[]> {
  if (MOCK_AUTH_ENABLED) return mockUpcomingTickets;

  const res = await authFetch(token, "/tickets/upcoming");
  if (!res.ok) return [];
  return res.json();
}

export async function postTicketClick(
  token: string,
  ticketId: string | number
) {
  return authFetch(token, `/tickets/${ticketId}/click`, { method: "POST" });
}

// ─── Offers / Promos ──────────────────────────────────────────────────────────

export async function getOffers(token: string): Promise<ApiOffer[]> {
  if (MOCK_AUTH_ENABLED) return mockOffers;

  const res = await authFetch(token, "/offers");
  if (!res.ok) return [];
  return res.json();
}

export async function getOffer(
  token: string,
  id: string | number
): Promise<ApiOffer | null> {
  if (MOCK_AUTH_ENABLED) {
    return mockOffers.find((o) => String(o.id) === String(id)) ?? null;
  }

  const res = await authFetch(token, `/offers/${id}`);
  if (!res.ok) return null;
  return res.json();
}
