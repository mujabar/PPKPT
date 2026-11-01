import type {
  ReportStatus,
  Urgency,
  ViolenceType,
} from "@/generated/prisma/enums";

export const SATGAS_PAGE_SIZE = 10;

export const REPORT_STATUS_VALUES = [
  "DITERIMA",
  "VERIFIKASI",
  "PEMERIKSAAN",
  "REKOMENDASI",
  "KEPUTUSAN",
  "PEMULIHAN",
  "SELESAI",
  "TIDAK_DITINDAKLANJUTI",
  "DIALIHKAN",
] as const satisfies readonly ReportStatus[];

export const URGENCY_VALUES = [
  "RENDAH",
  "SEDANG",
  "TINGGI",
] as const satisfies readonly Urgency[];

export const URGENCY_LABELS: Record<Urgency, string> = {
  RENDAH: "Rendah",
  SEDANG: "Sedang",
  TINGGI: "Tinggi",
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  DITERIMA: "Diterima",
  VERIFIKASI: "Verifikasi",
  PEMERIKSAAN: "Pemeriksaan",
  REKOMENDASI: "Rekomendasi",
  KEPUTUSAN: "Keputusan",
  PEMULIHAN: "Pemulihan",
  SELESAI: "Selesai",
  TIDAK_DITINDAKLANJUTI: "Tidak ditindaklanjuti",
  DIALIHKAN: "Dialihkan",
};

export const VIOLENCE_TYPE_LABELS: Record<ViolenceType, string> = {
  FISIK: "Kekerasan fisik",
  PSIKIS: "Kekerasan psikis",
  PERUNDUNGAN: "Perundungan",
  SEKSUAL: "Kekerasan seksual",
  DISKRIMINASI_INTOLERANSI: "Diskriminasi / intoleransi",
  KEBIJAKAN_KEKERASAN: "Kebijakan mengandung kekerasan",
};

export const STATUS_OPTIONS = REPORT_STATUS_VALUES.map((value) => ({
  value,
  label: STATUS_LABELS[value],
}));

export const URGENCY_OPTIONS = URGENCY_VALUES.map((value) => ({
  value,
  label: URGENCY_LABELS[value],
}));

export function formatReportDate(value: Date | string) {
  return `${new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value))} WIB`;
}

export function formatViolenceTypes(types: ViolenceType[]) {
  return types.map((type) => VIOLENCE_TYPE_LABELS[type]).join(" · ");
}
