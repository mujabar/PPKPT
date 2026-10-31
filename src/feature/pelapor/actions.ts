"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSessionProfile } from "@/feature/auth/service";

import {
  SubmissionConflictError,
  createReportForPelapor,
} from "./service";
import { reportFormSchema } from "./validation";

export type ReportFormState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors: Record<string, string[]>;
  ticketCode?: string;
  reused?: boolean;
};

type RawRespondent = {
  rowKey: string;
  name: string;
  identifier: string;
  affiliation: string;
  description: string;
};

type RawWitness = {
  rowKey: string;
  name: string;
  contact: string;
  notes: string;
};

function getStrings(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map((value) => (typeof value === "string" ? value : ""));
}

function parseRespondents(formData: FormData): RawRespondent[] {
  const rowKeys = getStrings(formData, "respondentRowKey");
  const names = getStrings(formData, "respondentName");
  const identifiers = getStrings(formData, "respondentIdentifier");
  const affiliations = getStrings(formData, "respondentAffiliation");
  const descriptions = getStrings(formData, "respondentDescription");

  return rowKeys
    .map((rowKey, index) => ({
      rowKey,
      name: names[index] ?? "",
      identifier: identifiers[index] ?? "",
      affiliation: affiliations[index] || "TIDAK_DIKETAHUI",
      description: descriptions[index] ?? "",
    }))
    .filter(
      (row) =>
        row.name.trim() !== "" ||
        row.identifier.trim() !== "" ||
        row.description.trim() !== "" ||
        row.affiliation !== "TIDAK_DIKETAHUI",
    );
}

function parseWitnesses(formData: FormData): RawWitness[] {
  const rowKeys = getStrings(formData, "witnessRowKey");
  const names = getStrings(formData, "witnessName");
  const contacts = getStrings(formData, "witnessContact");
  const notes = getStrings(formData, "witnessNotes");

  return rowKeys
    .map((rowKey, index) => ({
      rowKey,
      name: names[index] ?? "",
      contact: contacts[index] ?? "",
      notes: notes[index] ?? "",
    }))
    .filter(
      (row) =>
        row.name.trim() !== "" ||
        row.contact.trim() !== "" ||
        row.notes.trim() !== "",
    );
}

function toFieldErrors(
  error: z.ZodError,
  raw: { respondents: RawRespondent[]; witnesses: RawWitness[] },
) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const [root, index, field] = issue.path;
    let key = issue.path.map(String).join(".");

    if (
      (root === "respondents" || root === "witnesses") &&
      typeof index === "number" &&
      typeof field === "string"
    ) {
      const rows = root === "respondents" ? raw.respondents : raw.witnesses;
      const rowKey = rows[index]?.rowKey;

      if (rowKey) {
        key = `${root}.${rowKey}.${field}`;
      }
    }

    fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
  }

  return fieldErrors;
}

export async function submitReportAction(
  _previousState: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  const profile = await getSessionProfile();

  if (!profile) {
    return {
      status: "error",
      message: "Sesi tidak valid. Silakan masuk kembali.",
      fieldErrors: {},
    };
  }

  if (profile.role !== "PELAPOR") {
    return {
      status: "error",
      message: "Hanya akun dengan peran pelapor yang dapat mengirim laporan.",
      fieldErrors: {},
    };
  }

  const raw = {
    submissionId: String(formData.get("submissionId") ?? ""),
    reporterRole: String(formData.get("reporterRole") ?? ""),
    incidentDate: String(formData.get("incidentDate") ?? ""),
    incidentLocation: String(formData.get("incidentLocation") ?? ""),
    chronology: String(formData.get("chronology") ?? ""),
    violenceTypes: [...new Set(getStrings(formData, "violenceTypes"))],
    respondents: parseRespondents(formData),
    witnesses: parseWitnesses(formData),
    needsProtection: formData.get("needsProtection") === "on",
  };

  const parsed = reportFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali bagian yang ditandai.",
      fieldErrors: toFieldErrors(parsed.error, raw),
    };
  }

  try {
    const created = await createReportForPelapor(profile.id, parsed.data);
    revalidatePath("/pelapor");

    return {
      status: "success",
      message: created.reused
        ? "Laporan ini sudah tersimpan sebelumnya. Nomor tiket tetap sama."
        : "Laporan berhasil dikirim.",
      fieldErrors: {},
      ticketCode: created.ticketCode,
      reused: created.reused,
    };
  } catch (error) {
    if (error instanceof SubmissionConflictError) {
      return {
        status: "error",
        message:
          "Kunci pengiriman tidak cocok dengan akun ini. Muat ulang halaman lalu coba lagi.",
        fieldErrors: {},
      };
    }

    return {
      status: "error",
      message: "Laporan tidak dapat disimpan saat ini. Silakan coba lagi.",
      fieldErrors: {},
    };
  }
}
