import { auth } from "@/auth";
import type { Session } from "next-auth";

/**
 * Sessão da aplicação.
 *
 * Sempre reflete o login real do NextAuth (`auth()`), inclusive em dev.
 * Assim o gate das rotas privadas funciona de verdade: deslogado → sem
 * sessão → o layout redireciona pra home com o modal de login.
 *
 * Em dev, com DEV_FAKE_AUTH=true, o backend é mockado em `lib/api.ts`
 * (dados fake + credenciais de `MOCK_CREDENTIALS`), mas o login continua
 * obrigatório para criar a sessão.
 */
export async function getSession(): Promise<Session | null> {
  return auth();
}
