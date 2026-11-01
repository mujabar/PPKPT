import { Suspense } from "react";
import { requireRole } from "@/feature/auth/service";
import { ReportSkeleton } from "./report-display";
import { FormDetailClient } from "./form-detail-client";
export function FormDetail() { return <Suspense fallback={<ReportSkeleton />}><AuthorizedContent /></Suspense>; }
async function AuthorizedContent() {
  await requireRole(["PELAPOR"]);
  return <FormDetailClient />;
}
