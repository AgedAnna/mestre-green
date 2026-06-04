"use server";

import { getAccessToken } from "@/lib/session";
import {
  addPaymentMethod,
  getPaymentMethods,
  removePaymentMethod,
  setDefaultPaymentMethod,
} from "@/lib/api";
import type { ApiPaymentMethod, PaymentMethodPayload } from "@/lib/definitions";

/** Lists the user's saved cards / PIX keys (GET /users/me/payment-methods). */
export async function listPaymentMethods(): Promise<ApiPaymentMethod[]> {
  const token = await getAccessToken();
  if (!token) return [];
  return getPaymentMethods(token);
}

/**
 * Saves a payment method. The card must already be tokenised by the payment
 * gateway in the UI — only the resulting `gatewayToken` + masked metadata reach
 * the backend, never raw PAN/CVV.
 */
export async function addCard(
  payload: PaymentMethodPayload
): Promise<{ ok: boolean; method?: ApiPaymentMethod; message?: string }> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sessão expirada." };

  const method = await addPaymentMethod(token, payload);
  return method
    ? { ok: true, method }
    : { ok: false, message: "Falha ao adicionar método de pagamento." };
}

/** Removes a saved payment method (DELETE /users/me/payment-methods/{id}). */
export async function removeCard(id: number): Promise<{ ok: boolean }> {
  const token = await getAccessToken();
  if (!token) return { ok: false };
  return { ok: await removePaymentMethod(token, id) };
}

/** Sets a payment method as default (PATCH /users/me/payment-methods/{id}/default). */
export async function setDefaultCard(id: number): Promise<{ ok: boolean }> {
  const token = await getAccessToken();
  if (!token) return { ok: false };
  return { ok: await setDefaultPaymentMethod(token, id) };
}
