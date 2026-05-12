"use server";

import { signIn, signOut } from "@/auth";
import { LoginSchema } from "@/lib/definitions";
import type { LoginFormState } from "@/lib/definitions";
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

export async function logout() {
  await signOut({ redirectTo: "/" });
}
