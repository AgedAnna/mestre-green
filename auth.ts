import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/lib/definitions";
import type { ApiUser, SocialProvider } from "@/lib/definitions";
import { apiLoginOutcome, apiMe, apiSocialLogin } from "@/lib/api";

// Custom credential errors. NextAuth surfaces `code` to the caller (and to the
// `?code=` query param), so the UI can branch into the MFA / device-verification
// step without us owning any of that UI.
class MfaRequiredError extends CredentialsSignin {
  code = "mfa_required";
}
class DeviceVerificationRequiredError extends CredentialsSignin {
  code = "device_verification_required";
}

// Maps the backend user + access token into the object stored in the NextAuth JWT.
function toAuthUser(user: ApiUser, accessToken: string) {
  return {
    id: String(user.id),
    name: user.fullName ?? user.username,
    email: user.email ?? user.username,
    accessToken,
    username: user.username,
    roles: user.roles,
    accountType: user.accountType ?? "FREEMIUM",
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ── E-mail/password, with optional MFA code + device id ──
    Credentials({
      credentials: {
        username: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
        // Optional second-step inputs. Absent on the first attempt; the UI
        // re-submits with them after a challenge.
        mfaCode: { label: "Código MFA", type: "text" },
        deviceId: { label: "Device ID", type: "text" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const rawMfa = credentials?.mfaCode;
        const mfaCode =
          rawMfa != null && `${rawMfa}`.trim() !== "" ? Number(rawMfa) : undefined;
        const deviceId =
          credentials?.deviceId != null && `${credentials.deviceId}` !== ""
            ? String(credentials.deviceId)
            : undefined;

        let outcome;
        try {
          outcome = await apiLoginOutcome({
            username: parsed.data.username,
            password: parsed.data.password,
            mfaCode,
            deviceId,
          });
        } catch {
          // Bad credentials / locked → generic CredentialsSignin.
          return null;
        }

        if (outcome.type === "mfa_required") throw new MfaRequiredError();
        if (outcome.type === "device_verification_required")
          throw new DeviceVerificationRequiredError();

        try {
          const user = await apiMe(outcome.token);
          return toAuthUser(user, outcome.token);
        } catch {
          return null;
        }
      },
    }),

    // ── Google / Apple — web social login ──
    // The UI gets an identity token from Google Identity Services ("Sign in with
    // Google") or Sign in with Apple JS, then calls
    //   signIn("social", { provider, token, firstName?, lastName?, redirect: false })
    // The BACKEND validates that token using its existing config (GOOGLE_CLIENT_IDS /
    // Apple) — there is no OAuth client secret, no server-side OAuth flow, and no
    // new Google Cloud project on the web side.
    Credentials({
      id: "social",
      name: "social",
      credentials: {
        provider: { label: "Provider", type: "text" },
        token: { label: "Identity token", type: "text" },
        firstName: { label: "First name", type: "text" },
        lastName: { label: "Last name", type: "text" },
      },
      async authorize(credentials) {
        const provider = credentials?.provider;
        const token = credentials?.token;
        if (
          (provider !== "google" && provider !== "apple") ||
          typeof token !== "string" ||
          token.length === 0
        ) {
          return null;
        }

        try {
          const accessToken = await apiSocialLogin(
            provider as SocialProvider,
            token,
            typeof credentials?.firstName === "string"
              ? credentials.firstName
              : undefined,
            typeof credentials?.lastName === "string"
              ? credentials.lastName
              : undefined
          );
          const user = await apiMe(accessToken);
          return toAuthUser(user, accessToken);
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
      Object.assign(session, { accessToken: token.accessToken });
      Object.assign(session.user, {
        username: token.username,
        roles: token.roles,
        accountType: token.accountType,
      });
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
});
