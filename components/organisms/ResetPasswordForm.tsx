"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import { FormField } from "@/components/molecules";
import { Button } from "@/components/atoms";
import type { ResetPasswordFormState } from "@/lib/definitions";
import type { AuthMode } from "@/components/organisms/LoginCard";

const fieldClassName =
  "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#58CC02] focus:bg-white";
const labelProps = { className: "text-sm text-gray-700 font-medium" };

interface ResetPasswordFormProps {
  onModeChange?: (mode: AuthMode) => void;
}

function ResetPasswordForm({ onModeChange }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState<
    ResetPasswordFormState,
    FormData
  >(requestPasswordReset, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Redefinir senha
        </h1>
        <p className="text-sm text-gray-500">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>
      </div>

      {state?.message && (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            state.success
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600",
          ].join(" ")}
        >
          {state.message}
        </div>
      )}

      <FormField
        label="E-mail"
        name="email"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        error={state?.errors?.email?.[0]}
        labelProps={labelProps}
        className={fieldClassName}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        loading={isPending}
        className="mt-1"
      >
        Enviar link de recuperação
      </Button>

      <p className="text-center text-sm text-gray-500">
        <button
          type="button"
          onClick={() => onModeChange?.("login")}
          className="text-[#58CC02] font-semibold hover:underline"
        >
          Voltar ao login
        </button>
      </p>
    </form>
  );
}

export { ResetPasswordForm };
