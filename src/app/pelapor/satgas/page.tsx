import { Suspense } from "react";

import { SatgasPage } from "@/components/satgas/satgas-page";
import { SatgasSkeleton } from "@/components/satgas/satgas-skeleton";
import type { SatgasSearchParams } from "@/feature/satgas/validation";

export default function SatgasDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SatgasSearchParams>;
}) {
  return (
    <Suspense fallback={<SatgasSkeleton />}>
      <SatgasPage searchParams={searchParams} />
    </Suspense>
  );
}
