import type { Role } from "@/generated/prisma/enums";

export const ROLE_LABELS: Record<Role, string> = {
  PELAPOR: "Pelapor",
  ANGGOTA_SATGAS: "Anggota Satgas",
  KETUA_SATGAS: "Ketua Satgas",
  PIMPINAN: "Pimpinan",
  ADMIN: "Admin",
};

export const ROLE_HOME: Record<Role, string> = {
  PELAPOR: "/pelapor",
  ANGGOTA_SATGAS: "/satgas",
  KETUA_SATGAS: "/ketua",
  PIMPINAN: "/pimpinan",
  ADMIN: "/admin",
};
