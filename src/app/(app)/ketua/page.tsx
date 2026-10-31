import { Suspense } from "react";

import { RolePage, RolePageFallback } from "@/components/shared/role-page";
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
      title="Area Ketua Satgas"
      description="Pengelolaan penanganan dan penugasan kasus Satgas."
      profile={profile}
    >
      <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Fitur penugasan dan pengelolaan penanganan kasus akan tersedia pada issue
        berikutnya.
      </div>
    </RolePage>
  );
}
