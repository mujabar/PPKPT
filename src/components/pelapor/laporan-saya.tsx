import { Suspense } from "react";
import { requireRole } from "@/feature/auth/service";
import { ReportSkeleton } from "./report-display";
import { LaporanSayaClient } from "./laporan-saya-client";
export function LaporanSaya() { return <Suspense fallback={<ReportSkeleton />}><AuthorizedContent /></Suspense>; }
async function AuthorizedContent() {
  await requireRole(["PELAPOR"]);
  return <LaporanSayaClient />;
}
