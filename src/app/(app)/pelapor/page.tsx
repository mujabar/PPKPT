import { Suspense } from "react";

import { RolePage, RolePageFallback } from "@/components/shared/role-page";
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
      title="Area Pelapor"
      description="Pantau laporan milik Anda dan komunikasi dengan Satgas."
      profile={profile}
    >
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Fitur pembuatan dan pelacakan laporan akan tersedia pada issue berikutnya.
        Untuk saat ini, area ini memastikan hanya pelapor yang dapat mengaksesnya.
      </div>
    </RolePage>
  );
}
