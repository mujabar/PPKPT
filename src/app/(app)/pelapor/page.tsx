import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Suspense } from "react";

import {
  AccessList,
  RolePage,
  RolePageFallback,
} from "@/components/shared/role-page";
import { requireRole } from "@/feature/auth/service";

export default function PelaporPage() {
  return (
    <Suspense fallback={<RolePageFallback />}>
      <PelaporContent />
    </Suspense>
  );
}

async function PelaporContent() {
  const profile = await requireRole(["PELAPOR"]);

  return (
    <RolePage
      index="01"
      eyebrow="Area pelapor"
      title="Laporan milik Anda, dalam satu jalur."
      description="Pantau laporan yang Anda buat dan komunikasi dengan Satgas. Identitas dapat dijaga sesuai pilihan saat melapor."
      profile={profile}
      aside={
        <AccessList
          title="Batas akses"
          items={[
            {
              label: "Data milik sendiri",
              detail: "Hanya laporan yang Anda buat yang dapat dibaca.",
            },
            {
              label: "Identitas terjaga",
              detail: "Pilihan anonim tidak membuka identitas ke publik.",
            },
            {
              label: "Rute lain ditolak",
              detail: "Area Satgas, ketua, pimpinan, dan admin tidak dapat dibuka.",
            },
          ]}
        />
      }
    >
      <div className="space-y-5 border-y py-8">
        <h2 className="text-xl font-semibold tracking-tight">Laporan saya</h2>
        <p className="text-sm text-muted-foreground">Buka daftar laporan untuk melihat detail, status, riwayat, dan bukti pendukung.</p>
        <Link href="/laporan" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm text-primary-foreground">Lihat laporan saya<ArrowRight size={16} /></Link>
      </div>
    </RolePage>
  );
}
