"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { FormField } from "@/components/molecules";
import { Button } from "@/components/atoms";
import type { LoginFormState } from "@/lib/definitions";

function LoginForm() {
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
        label="E-mail"
        name="username"
        type="email"
        placeholder="seu@email.com"
        autoComplete="username"
        error={state?.errors?.username?.[0]}
        className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#58CC02] focus:bg-white"
      />

      <FormField
        label="Senha"
        name="password"
        type="password"
        placeholder="Digite sua senha"
        autoComplete="current-password"
        error={state?.errors?.password?.[0]}
        className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#58CC02] focus:bg-white"
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
        <Link href="/recuperar-senha" className="text-[#58CC02] font-medium hover:underline">
          Clique aqui
        </Link>
      </p>

      <p className="text-center text-sm text-gray-500">
        Novo usuário?{" "}
        <Link href="/cadastro" className="text-[#58CC02] font-semibold hover:underline">
          Cadastre-se aqui
        </Link>
      </p>
    </form>
  );
}

export { LoginForm };
