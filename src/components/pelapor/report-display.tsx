import type { ReportStatus } from "@/generated/prisma/enums";
export const statusLabels: Record<ReportStatus, string> = {
  DITERIMA: "Diterima", VERIFIKASI: "Verifikasi", PEMERIKSAAN: "Pemeriksaan", REKOMENDASI: "Rekomendasi", KEPUTUSAN: "Keputusan", PEMULIHAN: "Pemulihan", SELESAI: "Selesai", TIDAK_DITINDAKLANJUTI: "Tidak ditindaklanjuti", DIALIHKAN: "Dialihkan",
};
export function readable(value: string) { return value.toLowerCase().replaceAll("_", " "); }
export function reportDate(value: Date | string) { return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value)) + " WIB"; }
export const reportLinkClass = "inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary";
export function ReportSkeleton() { return <div role="status" className="space-y-4 py-8"><span className="sr-only">Memuat laporan</span>{[1,2,3].map((id) => <div key={id} className="h-24 animate-pulse rounded-xl bg-muted" />)}</div>; }
