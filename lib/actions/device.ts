"use server";

import { getAccessToken } from "@/lib/session";
import { apiMfaSetup, apiMfaVerify, apiRegisterDevice } from "@/lib/api";
import type { DeviceRegisterPayload, MfaSetupResponse } from "@/lib/definitions";

/**
 * Registers a device + push token for the logged-in user
 * (POST /auth/device/register). On the web, web-push delivery itself needs a
 * service worker + VAPID keys (out of scope here); this only forwards whatever
 * token the UI produced. `deviceDetails` is a JSON string, like the mobile app.
 */
export async function registerDevice(
  payload: DeviceRegisterPayload
): Promise<{ ok: boolean }> {
  const token = await getAccessToken();
  if (!token) return { ok: false };
  return { ok: await apiRegisterDevice(token, payload) };
}

/** Begins MFA enrolment → returns the TOTP secret + otpauth QR URL to render. */
export async function startMfaSetup(): Promise<MfaSetupResponse | null> {
  const token = await getAccessToken();
  if (!token) return null;
  return apiMfaSetup(token);
}

/** Confirms MFA enrolment with the first code from the authenticator app. */
export async function verifyMfaSetup(
  mfaCode: number
): Promise<{ ok: boolean; message?: string }> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sessão expirada." };

  const ok = await apiMfaVerify(token, mfaCode);
  return ok ? { ok } : { ok, message: "Código inválido." };
}
