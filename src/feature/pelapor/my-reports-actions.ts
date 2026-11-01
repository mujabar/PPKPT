"use server";
import { requireRole } from "@/feature/auth/service";
import { getMyReport, listMyReports } from "./my-reports-service";
export async function listMyReportsAction(input: { ticket?: string; status?: string; page?: number }) {
  const profile = await requireRole(["PELAPOR"]);
  return listMyReports(profile, input);
}
export async function getMyReportAction(id: string) {
  const profile = await requireRole(["PELAPOR"]);
  return getMyReport(profile, id);
}
