import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/lib/definitions";
import { apiLogin, apiMe } from "@/lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        try {
          const token = await apiLogin(parsed.data.username, parsed.data.password);
          const user = await apiMe(token);

          return {
            id: String(user.id),
            name: user.fullName ?? user.username,
            email: user.email ?? user.username,
            // Store extra fields via token callback below
            accessToken: token,
            username: user.username,
            roles: user.roles,
            accountType: user.accountType ?? "FREEMIUM",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as typeof user & {
          accessToken: string;
          username: string;
          roles: string[];
          accountType: string;
        };
        token.accessToken = u.accessToken;
        token.username = u.username;
        token.roles = u.roles;
        token.accountType = u.accountType;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      (session as any).accessToken = token.accessToken;
      (session.user as any).username = token.username;
      (session.user as any).roles = token.roles;
      (session.user as any).accountType = token.accountType;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
});
