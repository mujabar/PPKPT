import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RolePageFallback } from "@/components/shared/role-page";
import { ROLE_HOME } from "@/feature/auth/roles";
import { requireProfile } from "@/feature/auth/service";

export default function DashboardPage() {
  return (
    <Suspense fallback={<RolePageFallback />}>
      <DashboardRedirect />
    </Suspense>
  );
}

async function DashboardRedirect() {
  const profile = await requireProfile();
  redirect(ROLE_HOME[profile.role]);
  return null;
}
