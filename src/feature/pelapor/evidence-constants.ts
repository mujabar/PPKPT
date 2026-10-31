export const EVIDENCE_BUCKET = "report-evidence";
export const MAX_EVIDENCE_PER_REPORT = 10;
export const MAX_EVIDENCE_BYTES = 5 * 1024 * 1024;
export const SIGNED_URL_TTL_SECONDS = 120;

export const ALLOWED_EVIDENCE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type EvidenceMimeType = (typeof ALLOWED_EVIDENCE_MIME_TYPES)[number];

export const FINAL_REPORT_STATUSES = [
  "SELESAI",
  "TIDAK_DITINDAKLANJUTI",
  "DIALIHKAN",
] as const;
