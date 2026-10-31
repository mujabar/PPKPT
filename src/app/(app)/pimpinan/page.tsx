import { Suspense } from "react";

import { RolePage, RolePageFallback } from "@/components/shared/role-page";
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
      title="Area Pimpinan"
      description="Kasus yang diajukan untuk keputusan pimpinan perguruan tinggi."
      profile={profile}
    >
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Fitur keputusan dan penetapan sanksi akan tersedia pada issue berikutnya.
      </div>
    </RolePage>
  );
}
