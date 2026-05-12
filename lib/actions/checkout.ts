"use server";

import { getAccessToken } from "@/lib/session";
import { createCheckout } from "@/lib/api";
import type { CheckoutPayload } from "@/lib/definitions";

export async function startCheckout(payload: CheckoutPayload): Promise<{
  ok: boolean;
  redirectUrl?: string;
  message?: string;
}> {
  const token = await getAccessToken();
  if (!token) return { ok: false, message: "Sessão expirada." };

  const response = await createCheckout(token, payload);
  if (!response) return { ok: false, message: "Falha ao gerar pagamento." };

  // The Cakto integration returns the checkout link under varying keys.
  const link =
    (response.checkoutUrl as string | undefined) ??
    (response.url as string | undefined) ??
    (response.link as string | undefined) ??
    (response.paymentLink as string | undefined);

  if (!link) {
    return {
      ok: false,
      message: "Resposta do gateway sem URL de pagamento.",
    };
  }

  return { ok: true, redirectUrl: link };
}
