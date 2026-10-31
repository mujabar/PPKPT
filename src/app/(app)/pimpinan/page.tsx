import { Gavel } from "@phosphor-icons/react/dist/ssr";
import { Suspense } from "react";

import {
  AccessList,
  EmptyArea,
  RolePage,
  RolePageFallback,
} from "@/components/shared/role-page";
import { requireRole } from "@/feature/auth/service";

export default function PimpinanPage() {
  return (
    <Suspense fallback={<RolePageFallback />}>
      <PimpinanContent />
    </Suspense>
  );
}

async function PimpinanContent() {
  const profile = await requireRole(["PIMPINAN"]);

  return (
    <RolePage
      index="04"
      eyebrow="Area pimpinan"
      title="Keputusan dengan jejak yang jelas."
      description="Pimpinan menerima kasus yang telah direkomendasikan Satgas dan menetapkan keputusan sesuai kewenangan."
      profile={profile}
      aside={
        <AccessList
          title="Batas akses"
          items={[
            {
              label: "Kasus untuk keputusan",
              detail: "Hanya kasus yang diajukan melalui rekomendasi Satgas.",
            },
            {
              label: "Penetapan sanksi",
              detail: "Keputusan mengacu pada rekomendasi dan peraturan.",
            },
            {
              label: "Tanpa isi pemeriksaan mentah",
              detail: "Detail pemeriksaan tetap berada di area Satgas.",
            },
          ]}
        />
      }
    >
      <EmptyArea
        icon={<Gavel size={22} weight="duotone" />}
        title="Belum ada keputusan menunggu"
        description="Fitur keputusan dan penetapan sanksi akan tersedia pada issue berikutnya. Area pimpinan sudah dibatasi hanya untuk peran Pimpinan."
        meta="Rekomendasi · keputusan · sanksi"
      />
    </RolePage>
  );
}
