import { ArrowRight, Files } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Suspense } from "react";

import {
  AccessList,
  EmptyArea,
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
      <EmptyArea
        icon={<Files size={22} weight="duotone" />}
        title="Belum ada laporan"
        description="Mulai dengan formulir laporan. Nomor tiket dibuat setelah laporan benar-benar tersimpan, dan Anda dapat mengirim lebih dari satu laporan."
        meta="Data pribadi · hanya Anda dan Satgas"
        action={
          <Link
            href="/pelapor/form-laporan"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
          >
            Buat laporan
            <ArrowRight size={16} />
          </Link>
        }
      />
    </RolePage>
  );
}
