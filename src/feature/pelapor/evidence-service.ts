import "server-only";

import type { Profile } from "@/generated/prisma/client";
import type { ReportStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

import {
  EVIDENCE_BUCKET,
  FINAL_REPORT_STATUSES,
  MAX_EVIDENCE_PER_REPORT,
  SIGNED_URL_TTL_SECONDS,
} from "./evidence-constants";
import type { EvidenceItem, EvidenceView } from "./evidence-types";
import { inspectEvidenceFile } from "./evidence-validation";

const FINAL_STATUSES = new Set<string>(FINAL_REPORT_STATUSES);

export class EvidenceAccessError extends Error {
  constructor() {
    super("EVIDENCE_ACCESS_DENIED");
    this.name = "EvidenceAccessError";
  }
}

export class EvidenceLimitError extends Error {
  constructor() {
    super("EVIDENCE_LIMIT_REACHED");
    this.name = "EvidenceLimitError";
  }
}

export class EvidenceStatusError extends Error {
  constructor() {
    super("REPORT_STATUS_FINAL");
    this.name = "EvidenceStatusError";
  }
}

export class EvidenceConflictError extends Error {
  constructor() {
    super("EVIDENCE_CONFLICT");
    this.name = "EvidenceConflictError";
  }
}

export class EvidenceStorageError extends Error {
  constructor() {
    super("EVIDENCE_STORAGE_FAILED");
    this.name = "EvidenceStorageError";
  }
}

type StoredEvidence = {
  id: string;
  reportId: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: Date;
};

type AdminClient = ReturnType<typeof createAdminClient>;

async function signStoragePath(admin: AdminClient, storagePath: string) {
  const { data } = await admin.storage
    .from(EVIDENCE_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  return data?.signedUrl ?? null;
}

async function toEvidenceItem(
  admin: AdminClient,
  evidence: StoredEvidence,
): Promise<EvidenceItem> {
  return {
    id: evidence.id,
    fileName: evidence.fileName,
    mimeType: evidence.mimeType,
    sizeBytes: evidence.sizeBytes,
    createdAt: evidence.createdAt.toISOString(),
    signedUrl: await signStoragePath(admin, evidence.storagePath),
  };
}

function canViewReport(
  profile: Profile,
  report: {
    reporterId: string | null;
    assignments: { id: string }[];
    _count: { assignments: number };
    recommendation: { submittedAt: Date | null } | null;
    decision: { id: string } | null;
  },
) {
  if (profile.role === "PELAPOR") {
    return report.reporterId === profile.id;
  }

  if (profile.role === "ANGGOTA_SATGAS") {
    return report.assignments.length > 0;
  }

  if (profile.role === "KETUA_SATGAS") {
    return true;
  }

  if (profile.role === "PIMPINAN") {
    return (
      report.decision !== null ||
      report.recommendation?.submittedAt != null
    );
  }

  return false;
}

async function getReportForViewer(ticketCode: string, profile: Profile) {
  const report = await prisma.report.findUnique({
    where: { ticketCode },
    select: {
      id: true,
      ticketCode: true,
      reporterId: true,
      status: true,
      assignments: {
        where: { memberId: profile.id },
        select: { id: true },
      },
      _count: {
        select: { assignments: true, evidences: true },
      },
      recommendation: { select: { submittedAt: true } },
      decision: { select: { id: true } },
      evidences: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          reportId: true,
          storagePath: true,
          fileName: true,
          mimeType: true,
          sizeBytes: true,
          createdAt: true,
        },
      },
    },
  });

  if (!report || !canViewReport(profile, report)) {
    return null;
  }

  return report;
}

export async function listEvidenceForViewer(
  ticketCode: string,
  profile: Profile,
): Promise<EvidenceView> {
  if (!profile.isActive) throw new EvidenceAccessError();
  const report = await getReportForViewer(ticketCode, profile);

  if (!report) {
    throw new EvidenceAccessError();
  }

  const admin = createAdminClient();
  const evidence = await Promise.all(
    report.evidences.map((item) => toEvidenceItem(admin, item)),
  );

  const canUpload =
    profile.role === "PELAPOR" &&
    report.reporterId === profile.id &&
    !FINAL_STATUSES.has(report.status) &&
    report.evidences.length < MAX_EVIDENCE_PER_REPORT;

  return {
    ticketCode: report.ticketCode,
    reportStatus: report.status,
    canUpload,
    maxEvidence: MAX_EVIDENCE_PER_REPORT,
    evidence,
  };
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === "P2002"
  );
}

async function removeStorageObject(admin: AdminClient, path: string) {
  try {
    await admin.storage.from(EVIDENCE_BUCKET).remove([path]);
  } catch {
    // Objek yatim akan ditimpa saat percobaan ulang dengan id yang sama.
  }
}

export async function uploadEvidenceForPelapor(
  profile: Profile,
  input: {
    ticketCode: string;
    clientUploadId: string;
    buffer: Buffer;
    declaredMimeType: string;
    fileName: string;
  },
) {
  if (!profile.isActive || profile.role !== "PELAPOR") {
    throw new EvidenceAccessError();
  }

  const report = await prisma.report.findUnique({
    where: { ticketCode: input.ticketCode },
    select: { id: true, reporterId: true, status: true },
  });

  if (!report || report.reporterId !== profile.id) {
    throw new EvidenceAccessError();
  }

  if (FINAL_STATUSES.has(report.status)) {
    throw new EvidenceStatusError();
  }

  const admin = createAdminClient();
  const existing = await prisma.reportEvidence.findUnique({
    where: { id: input.clientUploadId },
    select: {
      id: true,
      reportId: true,
      storagePath: true,
      fileName: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
    },
  });

  if (existing) {
    if (existing.reportId !== report.id) {
      throw new EvidenceConflictError();
    }

    return {
      item: await toEvidenceItem(admin, existing),
      reused: true,
    };
  }

  const inspected = await inspectEvidenceFile({
    buffer: input.buffer,
    declaredMimeType: input.declaredMimeType,
    fileName: input.fileName,
  });

  const storagePath = `${report.id}/${crypto.randomUUID()}.${inspected.extension}`;
  const { error: uploadError } = await admin.storage
    .from(EVIDENCE_BUCKET)
    .upload(storagePath, input.buffer, {
      contentType: inspected.mimeType,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new EvidenceStorageError();
  }

  let created: StoredEvidence;

  try {
    created = await prisma.$transaction(async (transaction) => {
      const locked = await transaction.$queryRaw<
        { reporterId: string | null; status: ReportStatus }[]
      >`
        SELECT "reporterId", status
        FROM "reports"
        WHERE id = ${report.id}::uuid
        FOR UPDATE
      `;

      const row = locked[0];

      if (!row || row.reporterId !== profile.id) {
        throw new EvidenceAccessError();
      }

      if (FINAL_STATUSES.has(row.status)) {
        throw new EvidenceStatusError();
      }

      const retry = await transaction.reportEvidence.findUnique({ where: { id: input.clientUploadId } });
      if (retry) throw Object.assign(new Error("duplicate"), { code: "P2002" });

      const count = await transaction.reportEvidence.count({
        where: { reportId: report.id },
      });

      if (count >= MAX_EVIDENCE_PER_REPORT) {
        throw new EvidenceLimitError();
      }

      return transaction.reportEvidence.create({
        data: {
          id: input.clientUploadId,
          reportId: report.id,
          storagePath,
          fileName: inspected.fileName,
          mimeType: inspected.mimeType,
          sizeBytes: input.buffer.byteLength,
        },
        select: {
          id: true,
          reportId: true,
          storagePath: true,
          fileName: true,
          mimeType: true,
          sizeBytes: true,
          createdAt: true,
        },
      });
    }, { maxWait: 30000, timeout: 30000 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      const raced = await prisma.reportEvidence.findUnique({
        where: { id: input.clientUploadId },
        select: {
          id: true,
          reportId: true,
          storagePath: true,
          fileName: true,
          mimeType: true,
          sizeBytes: true,
          createdAt: true,
        },
      });

      if (raced && raced.reportId === report.id) {
        await removeStorageObject(admin, storagePath);
        return {
          item: await toEvidenceItem(admin, raced),
          reused: true,
        };
      }
    }

    await removeStorageObject(admin, storagePath);
    throw error;
  }

  return {
    item: await toEvidenceItem(admin, created),
    reused: false,
  };
}
