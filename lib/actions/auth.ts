"use server";

import { signIn, signOut } from "@/auth";
import {
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@/lib/definitions";
import type {
  LoginFormState,
  RegisterFormState,
  ResetPasswordFormState,
} from "@/lib/definitions";
import { apiRegister, apiRequestPasswordReset } from "@/lib/api";
import { AuthError } from "next-auth";

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

  try {
    await signIn("credentials", {
      username: parsed.data.username,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "E-mail ou senha inválidos." };
    }
    throw error;
  }
}

export async function register(
  _state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await apiRegister(parsed.data.name, parsed.data.email, parsed.data.password);
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "Erro ao criar conta.",
    };
  }

  try {
    await signIn("credentials", {
      username: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        message: "Conta criada, mas não foi possível entrar. Faça login.",
      };
    }
    throw error;
  }
}

export async function requestPasswordReset(
  _state: ResetPasswordFormState,
  formData: FormData
): Promise<ResetPasswordFormState> {
  const parsed = ResetPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await apiRequestPasswordReset(parsed.data.email);
  } catch {
    return { message: "Não foi possível enviar o e-mail de recuperação." };
  }

  return {
    success: true,
    message: "Enviamos um link de recuperação para o seu e-mail.",
  };
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
