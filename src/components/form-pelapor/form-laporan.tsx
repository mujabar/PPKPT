import { requireRole } from "@/feature/auth/service";

import { ReportForm } from "./report-form";

export async function FormLaporan() {
  const profile = await requireRole(["PELAPOR"]);
  const submissionId = crypto.randomUUID();

  return (
    <ReportForm
      reporterName={profile.fullName}
      submissionId={submissionId}
    />
  );
}
