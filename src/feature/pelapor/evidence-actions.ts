"use server";

import { z } from "zod";

import { getSessionProfile } from "@/feature/auth/service";

import { MAX_EVIDENCE_BYTES } from "./evidence-constants";
import {
  EvidenceAccessError,
  EvidenceConflictError,
  EvidenceLimitError,
  EvidenceStatusError,
  EvidenceStorageError,
  listEvidenceForViewer,
  uploadEvidenceForPelapor,
} from "./evidence-service";
import type {
  LoadEvidenceResult,
  UploadEvidenceResult,
} from "./evidence-types";
import { EvidenceFileError } from "./evidence-validation";

const ticketSchema = z
  .string()
  .trim()
  .regex(/^PPKPT-\d{4}-[A-Z0-9]{6}$/i, "Nomor tiket tidak valid.")
  .transform((value) => value.toUpperCase());

const uploadIdSchema = z.uuid("Kunci unggah tidak valid.");

export async function loadEvidenceAction(
  ticketCode: string,
): Promise<LoadEvidenceResult> {
  const profile = await getSessionProfile();

  if (!profile) {
    return {
      status: "error",
      message: "Sesi tidak valid. Silakan masuk kembali.",
    };
  }

  const parsed = ticketSchema.safeParse(ticketCode);

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Nomor tiket tidak valid.",
    };
  }

  try {
    const view = await listEvidenceForViewer(parsed.data, profile);
    return { status: "ok", ...view };
  } catch {
    return {
      status: "error",
      message: "Laporan tidak ditemukan atau Anda tidak memiliki akses.",
    };
  }
}

export async function uploadEvidenceAction(
  formData: FormData,
): Promise<UploadEvidenceResult> {
  const profile = await getSessionProfile();

  if (!profile) {
    return {
      status: "error",
      message: "Sesi tidak valid. Silakan masuk kembali.",
    };
  }

  if (profile.role !== "PELAPOR") {
    return {
      status: "error",
      message: "Hanya akun pelapor yang dapat menambahkan bukti.",
    };
  }

  const parsedTicket = ticketSchema.safeParse(formData.get("ticketCode"));
  const parsedUploadId = uploadIdSchema.safeParse(
    formData.get("clientUploadId"),
  );

  if (!parsedTicket.success || !parsedUploadId.success) {
    return {
      status: "error",
      message: "Data unggah tidak valid. Muat ulang halaman lalu coba lagi.",
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Pilih gambar terlebih dahulu." };
  }

  if (file.size > MAX_EVIDENCE_BYTES) {
    return { status: "error", message: "Ukuran gambar maksimal 5 MB." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadEvidenceForPelapor(profile, {
      ticketCode: parsedTicket.data,
      clientUploadId: parsedUploadId.data,
      buffer,
      declaredMimeType: file.type,
      fileName: file.name,
    });

    return { status: "ok", ...result };
  } catch (error) {
    if (error instanceof EvidenceFileError) {
      return { status: "error", message: error.message };
    }

    if (error instanceof EvidenceLimitError) {
      return {
        status: "error",
        message: "Batas 10 bukti per laporan sudah tercapai.",
      };
    }

    if (error instanceof EvidenceStatusError) {
      return {
        status: "error",
        message:
          "Kasus sudah berstatus akhir. Bukti tidak dapat ditambahkan lagi.",
      };
    }

    if (error instanceof EvidenceAccessError) {
      return {
        status: "error",
        message: "Laporan tidak ditemukan atau bukan milik Anda.",
      };
    }

    if (error instanceof EvidenceConflictError) {
      return {
        status: "error",
        message:
          "Kunci unggah sudah dipakai untuk bukti lain. Muat ulang halaman lalu coba lagi.",
      };
    }

    if (error instanceof EvidenceStorageError) {
      return {
        status: "error",
        message: "Gagal mengunggah gambar ke penyimpanan. Silakan coba lagi.",
      };
    }

    return {
      status: "error",
      message: "Bukti tidak dapat disimpan saat ini. Silakan coba lagi.",
    };
  }
}
