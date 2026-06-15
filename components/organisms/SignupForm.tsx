"use client";

import { useActionState } from "react";
import { register } from "@/lib/actions/auth";
import { FormField } from "@/components/molecules";
import { Button } from "@/components/atoms";
import type { RegisterFormState } from "@/lib/definitions";
import type { AuthMode } from "@/components/organisms/LoginCard";

const fieldClassName =
  "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#58CC02] focus:bg-white";
const labelProps = { className: "text-sm text-gray-700 font-medium" };

interface SignupFormProps {
  onModeChange?: (mode: AuthMode) => void;
}

function SignupForm({ onModeChange }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState<
    RegisterFormState,
    FormData
  >(register, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">Criar conta</h1>

      {state?.message && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <FormField
        label="Nome completo"
        name="name"
        type="text"
        placeholder="Seu nome"
        autoComplete="name"
        error={state?.errors?.name?.[0]}
        labelProps={labelProps}
        className={fieldClassName}
      />

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

      <FormField
        label="Senha"
        name="password"
        type="password"
        placeholder="Crie uma senha"
        autoComplete="new-password"
        error={state?.errors?.password?.[0]}
        labelProps={labelProps}
        className={fieldClassName}
      />

      <FormField
        label="Confirmar senha"
        name="confirmPassword"
        type="password"
        placeholder="Repita a senha"
        autoComplete="new-password"
        error={state?.errors?.confirmPassword?.[0]}
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
        Criar conta
      </Button>

      <p className="text-center text-sm text-gray-500">
        Já tem conta?{" "}
        <button
          type="button"
          onClick={() => onModeChange?.("login")}
          className="text-[#58CC02] font-semibold hover:underline"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}

export { SignupForm };
