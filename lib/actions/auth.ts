"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema } from "@/lib/definitions";
import type {
  LoginFormState,
  RegistrationPayload,
  SocialProvider,
} from "@/lib/definitions";
import {
  apiConfirmAccount,
  apiConfirmDevice,
  apiRegister,
  apiResendVerification,
} from "@/lib/api";
import { AuthError, CredentialsSignin } from "next-auth";

/**
 * Login form action. Backward compatible with the original e-mail/password form
 * — it now also forwards optional `mfaCode` / `deviceId` fields, and reports a
 * `challenge` so the UI can render the MFA / device-verification step.
 */
export async function login(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const mfaCode = formData.get("mfaCode");
  const deviceId = formData.get("deviceId");

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      ...(mfaCode ? { mfaCode: String(mfaCode) } : {}),
      ...(deviceId ? { deviceId: String(deviceId) } : {}),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.code === "mfa_required") {
        return {
          challenge: "mfa_required",
          message: "Informe o código de autenticação em duas etapas (2FA).",
        };
      }
      if (error.code === "device_verification_required") {
        return {
          challenge: "device_verification_required",
          message:
            "Enviamos um código para o seu e-mail para verificar este dispositivo.",
        };
      }
      return { message: "E-mail ou senha inválidos." };
    }
    if (error instanceof AuthError) {
      return { message: "E-mail ou senha inválidos." };
    }
    // Re-throw NEXT_REDIRECT (success) and anything unexpected.
    throw error;
  }
}

/**
 * Social login (web). The UI obtains the Google/Apple identity token from
 * Google Identity Services / Sign in with Apple JS and passes it here; we
 * exchange it for a backend session (cookie set on success) and let the client
 * navigate. Reuses the backend's existing token validation — no client secret.
 */
export async function socialLogin(input: {
  provider: SocialProvider;
  token: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    await signIn("social", {
      provider: input.provider,
      token: input.token,
      firstName: input.firstName ?? "",
      lastName: input.lastName ?? "",
      redirect: false,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, message: "Falha no login social." };
    }
    throw error;
  }
}

/** Public registration. The backend e-mails a 6-digit code; confirm it with `confirmAccount`. */
export async function registerUser(
  payload: RegistrationPayload
): Promise<{ ok: boolean; message?: string }> {
  try {
    await apiRegister(payload);
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha no cadastro.";
    return { ok: false, message };
  }
}

/** Confirms a new account with the e-mailed 6-digit code. */
export async function confirmAccount(
  email: string,
  code: string
): Promise<{ ok: boolean; message?: string }> {
  const ok = await apiConfirmAccount(email, code);
  return ok ? { ok } : { ok, message: "Código inválido ou expirado." };
}

/** Trusts a new device after a device-verification challenge. */
export async function confirmDevice(
  email: string,
  code: string,
  deviceId: string
): Promise<{ ok: boolean; message?: string }> {
  const ok = await apiConfirmDevice(email, code, deviceId);
  return ok ? { ok } : { ok, message: "Código inválido ou expirado." };
}

/** Re-sends the account/device verification code. */
export async function resendVerificationCode(
  email: string
): Promise<{ ok: boolean }> {
  const ok = await apiResendVerification(email);
  return { ok };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
