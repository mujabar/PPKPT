import { Scales } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import {
  AccessList,
  EmptyArea,
  RolePage,
  RolePageFallback,
} from "@/components/shared/role-page";
import { requireRole } from "@/feature/auth/service";

export default function KetuaPage() {
  return (
    <Suspense fallback={<RolePageFallback />}>
      <KetuaContent />
    </Suspense>
  );
}

async function KetuaContent() {
  const profile = await requireRole(["KETUA_SATGAS"]);

  return (
    <RolePage
      index="03"
      eyebrow="Area ketua"
      title="Kendali penanganan Satgas."
      description="Ketua Satgas mengelola penugasan dan memastikan setiap laporan bergerak melalui tahapan yang benar."
      profile={profile}
      aside={
        <AccessList
          title="Batas akses"
          items={[
            {
              label: "Pengelolaan penanganan",
              detail: "Penugasan anggota dan pemantauan tahapan kasus.",
            },
            {
              label: "Tidak menetapkan sanksi",
              detail: "Keputusan akhir tetap berada pada Pimpinan.",
            },
            {
              label: "Halaman lain tertutup",
              detail: "Area pimpinan dan admin tidak dapat dibuka.",
            },
          ]}
        />
      }
    >
      <EmptyArea
        icon={<Scales size={22} weight="duotone" />}
        title="Belum ada penanganan aktif"
        description="Fitur penugasan dan pengelolaan penanganan kasus akan tersedia pada issue berikutnya. Halaman ini hanya dapat dibuka oleh ketua Satgas."
        meta="Penugasan · tahapan · rekomendasi"
      />
    </RolePage>
  );
}
