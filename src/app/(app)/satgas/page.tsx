import { Suspense } from "react";

import { RolePage, RolePageFallback } from "@/components/shared/role-page";
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
      title="Area Satgas"
      description="Akses ke kasus yang ditugaskan kepada Anda."
      profile={profile}
    >
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Fitur penanganan kasus belum termasuk dalam issue ini. Halaman ini
        membatasi akses ke anggota dan ketua Satgas.
      </div>
    </RolePage>
  );
}
