"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import { FormField } from "@/components/molecules";
import { Button } from "@/components/atoms";
import type { LoginFormState } from "@/lib/definitions";
import type { AuthMode } from "@/components/organisms/LoginCard";

const fieldClassName =
  "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#58CC02] focus:bg-white";
const labelProps = { className: "text-sm text-gray-700 font-medium" };

interface LoginFormProps {
  onModeChange?: (mode: AuthMode) => void;
}

function LoginForm({ onModeChange }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState<LoginFormState, FormData>(
    login,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold text-gray-900">Login</h1>

      {state?.message && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <FormField
        label="Usuário"
        name="username"
        type="text"
        placeholder="Seu usuário"
        autoComplete="username"
        error={state?.errors?.username?.[0]}
        labelProps={labelProps}
        className={fieldClassName}
      />

      <FormField
        label="Senha"
        name="password"
        type="password"
        placeholder="Digite sua senha"
        autoComplete="current-password"
        error={state?.errors?.password?.[0]}
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
        Iniciar sessão
      </Button>

      <p className="text-center text-sm text-gray-500">
        Esqueceu a senha?{" "}
        <button
          type="button"
          onClick={() => onModeChange?.("reset")}
          className="text-[#58CC02] font-medium hover:underline"
        >
          Clique aqui
        </button>
      </p>

      <p className="text-center text-sm text-gray-500">
        Novo usuário?{" "}
        <button
          type="button"
          onClick={() => onModeChange?.("signup")}
          className="text-[#58CC02] font-semibold hover:underline"
        >
          Cadastre-se aqui
        </button>
      </p>
    </form>
  );
}

export { LoginForm };
