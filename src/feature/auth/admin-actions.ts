"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

import { getSessionProfile } from "./service";

export type RoleUpdateState = {
  status: "idle" | "success" | "error";
  message: string;
};

const updateRoleSchema = z.object({
  profileId: z.uuid(),
  role: z.enum([
    "PELAPOR",
    "ANGGOTA_SATGAS",
    "KETUA_SATGAS",
    "PIMPINAN",
    "ADMIN",
  ]),
});

export async function updateProfileRoleAction(
  _previousState: RoleUpdateState,
  formData: FormData,
): Promise<RoleUpdateState> {
  const currentProfile = await getSessionProfile();

  if (!currentProfile || currentProfile.role !== "ADMIN") {
    return { status: "error", message: "Anda tidak memiliki akses." };
  }

  const parsed = updateRoleSchema.safeParse({
    profileId: formData.get("profileId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { status: "error", message: "Data peran tidak valid." };
  }

  if (parsed.data.profileId === currentProfile.id) {
    return {
      status: "error",
      message: "Peran akun sendiri tidak dapat diubah dari halaman ini.",
    };
  }

  try {
    await prisma.profile.update({
      where: { id: parsed.data.profileId },
      data: { role: parsed.data.role },
    });
  } catch {
    return { status: "error", message: "Gagal memperbarui peran." };
  }

  revalidatePath("/admin");

  return { status: "success", message: "Peran diperbarui." };
}
