import type { ApiOffer, ApiTicket, ApiUser } from "./definitions";

const API_BASE = process.env.API_BASE ?? "https://api.mestregreen.com";

function apiUrl(path: string) {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

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
  const res = await apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Não foi possível enviar o e-mail de recuperação.");
  }
}

export async function apiMe(token: string): Promise<ApiUser> {
  const res = await authFetch(token, "/auth/me");
  if (!res.ok) throw new Error("Sessão inválida.");
  return res.json();
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

export async function postTicketClick(token: string, ticketId: string | number) {
  return authFetch(token, `/tickets/${ticketId}/click`, { method: "POST" });
}

// ─── Offers / Promos ──────────────────────────────────────────────────────────

export async function getOffers(token: string): Promise<ApiOffer[]> {
  const res = await authFetch(token, "/offers");
  if (!res.ok) return [];
  return res.json();
}

export async function getOffer(token: string, id: string | number): Promise<ApiOffer | null> {
  const res = await authFetch(token, `/offers/${id}`);
  if (!res.ok) return null;
  return res.json();
}
