import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import type { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const getSessionProfile = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
  });

  if (!profile || !profile.isActive) {
    return null;
  }

  return profile;
});

export async function requireProfile() {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login?error=sesi");
  }

  return profile;
}

export async function requireRole(roles: readonly Role[]) {
  const profile = await requireProfile();

  if (!roles.includes(profile.role)) {
    redirect("/dashboard");
  }

  return profile;
}
