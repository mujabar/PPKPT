import { Files } from "@phosphor-icons/react/dist/ssr";
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
        description="Fitur pembuatan dan pelacakan laporan akan tersedia pada issue berikutnya. Halaman ini memastikan area pelapor hanya dapat dibuka oleh pemilik akun pelapor."
        meta="Data pribadi · hanya Anda dan Satgas"
      />
    </RolePage>
  );
}
