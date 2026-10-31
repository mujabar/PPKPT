import { ClipboardText } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import {
  AccessList,
  EmptyArea,
  RolePage,
  RolePageFallback,
} from "@/components/shared/role-page";
import { requireRole } from "@/feature/auth/service";

export default function SatgasPage() {
  return (
    <Suspense fallback={<RolePageFallback />}>
      <SatgasContent />
    </Suspense>
  );
}

async function SatgasContent() {
  const profile = await requireRole(["ANGGOTA_SATGAS", "KETUA_SATGAS"]);

  return (
    <RolePage
      index="02"
      eyebrow="Area Satgas"
      title="Kasus yang ditugaskan, tanpa kebocoran data."
      description="Anggota dan ketua Satgas bekerja pada kasus yang ditugaskan. Tidak semua laporan terbuka untuk setiap anggota."
      profile={profile}
      aside={
        <AccessList
          title="Batas akses"
          items={[
            {
              label: "Kasus yang ditugaskan",
              detail: "Hanya kasus dengan penugasan aktif yang relevan.",
            },
            {
              label: "Peran internal",
              detail: "Ketua Satgas juga membuka area pengelolaan di /ketua.",
            },
            {
              label: "Isi kasus tidak publik",
              detail: "Tidak ada akses dari luar sesi Satgas.",
            },
          ]}
        />
      }
    >
      <EmptyArea
        icon={<ClipboardText size={22} weight="duotone" />}
        title="Belum ada kasus ditugaskan"
        description="Fitur penanganan kasus belum termasuk dalam issue ini. Area Satgas sudah dibatasi untuk anggota dan ketua Satgas."
        meta="Penugasan · pemeriksaan · pendampingan"
      />
    </RolePage>
  );
}
