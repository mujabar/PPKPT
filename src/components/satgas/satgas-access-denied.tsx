import Link from "next/link";

import type { Profile } from "@/generated/prisma/client";
import { ROLE_HOME, ROLE_LABELS } from "@/feature/auth/roles";

export function SatgasAccessDenied({ profile }: { profile: Profile }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-destructive">
        Akses ditolak
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tighter text-balance">
        Daftar laporan Satgas hanya untuk Satgas.
      </h1>
      <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
        Akun Anda memiliki peran {ROLE_LABELS[profile.role]}. Daftar laporan ini
        hanya dapat dibuka oleh Ketua dan Anggota Satgas.
      </p>
      <Link
        href={ROLE_HOME[profile.role]}
        className="mt-8 inline-flex h-10 w-fit items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
      >
        Kembali ke area Anda
      </Link>
    </main>
  );
}
