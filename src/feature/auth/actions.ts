"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import { loginSchema } from "./validation";

export type LoginFieldErrors = {
  email?: string[];
  password?: string[];
};

export type LoginState = {
  message: string;
  fieldErrors: LoginFieldErrors;
};

function resolveFullName(userMetadata: unknown, email: string) {
  if (
    typeof userMetadata === "object" &&
    userMetadata !== null &&
    "full_name" in userMetadata &&
    typeof userMetadata.full_name === "string" &&
    userMetadata.full_name.trim().length > 0
  ) {
    return userMetadata.full_name.trim();
  }

  return email.split("@")[0] || "Pengguna";
}

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);

    return {
      message: "Periksa kembali isian form.",
      fieldErrors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    if (error?.status === 400) {
      return { message: "email atau password ada salah", fieldErrors: {} };
    }

    return {
      message: "Layanan sedang bermasalah. Silakan coba lagi.",
      fieldErrors: {},
    };
  }

  const user = data.user;

  let profile;

  try {
    profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: { email },
      create: {
        id: user.id,
        email,
        fullName: resolveFullName(user.user_metadata, email),
      },
    });
  } catch {
    await supabase.auth.signOut();

    return {
      message:
        "Profil tidak dapat disiapkan. Hubungi administrator atau coba lagi.",
      fieldErrors: {},
    };
  }

  if (!profile.isActive) {
    await supabase.auth.signOut();

    return {
      message: "Akun Anda tidak aktif. Hubungi administrator.",
      fieldErrors: {},
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/login");
}
