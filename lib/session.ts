import { auth } from "@/auth";
import type { SessionUser } from "./definitions";

type Session = {
  user: SessionUser;
  accessToken: string;
} | null;

async function getSession(): Promise<Session> {
  const session = (await auth()) as unknown as Session;
  return session;
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.accessToken ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}
