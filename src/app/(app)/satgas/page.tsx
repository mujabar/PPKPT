import { ArrowRight, ClipboardText } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { EvidencePanel } from "@/components/form-pelapor/evidence-panel";
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
      <EvidencePanel />
      <EmptyArea
        icon={<ClipboardText size={22} weight="duotone" />}
        title="Daftar laporan Satgas"
        description="Ketua dapat meninjau seluruh laporan masuk; anggota hanya melihat laporan yang ditugaskan. Penugasan dan detail kasus dikerjakan pada issue berikutnya."
        meta="Pencarian · filter status · filter urgensi"
        action={
          <Link
            href="/pelapor/satgas"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
          >
            Buka daftar laporan
            <ArrowRight size={16} />
          </Link>
        }
      />
    </RolePage>
  );
}
