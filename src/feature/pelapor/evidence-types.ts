import type { ReportStatus } from "@/generated/prisma/enums";

export type EvidenceItem = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  signedUrl: string | null;
};

export type EvidenceView = {
  ticketCode: string;
  reportStatus: ReportStatus;
  canUpload: boolean;
  maxEvidence: number;
  evidence: EvidenceItem[];
};

export type LoadEvidenceResult =
  | ({ status: "ok" } & EvidenceView)
  | { status: "error"; message: string };

export type UploadEvidenceResult =
  | { status: "ok"; item: EvidenceItem; reused: boolean }
  | { status: "error"; message: string };
