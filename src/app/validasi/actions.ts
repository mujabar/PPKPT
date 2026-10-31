"use server";

import { z } from "zod";

import { reportSchema } from "@/lib/validations/report";

export type ReportFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string[] | undefined>;
};

export async function submitReport(
  _previousState: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const parsed = reportSchema.safeParse({
    reporterRole: formData.get("reporterRole"),
    violenceTypes: formData.getAll("violenceTypes"),
    incidentDate: formData.get("incidentDate"),
    incidentLocation: formData.get("incidentLocation"),
    chronology: formData.get("chronology"),
    urgency: formData.get("urgency") || undefined,
    needsProtection: formData.get("needsProtection") === "on",
    isAnonymous: formData.get("isAnonymous") === "on",
    contactEmail: formData.get("contactEmail") ?? "",
  });

  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error);

    return {
      status: "error",
      message:
        formErrors.length > 0
          ? formErrors.join(" ")
          : "Periksa kembali isian form.",
      fieldErrors,
    };
  }

  const data = parsed.data;

  return {
    status: "success",
    message: `Validasi berhasil. Laporan sebagai ${data.reporterRole} dengan ${data.violenceTypes.length} bentuk kekerasan lolos skema Zod. Data belum disimpan ke database.`,
    fieldErrors: {},
  };
}
