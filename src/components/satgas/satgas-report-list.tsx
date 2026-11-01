import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import type { ReportStatus, Urgency } from "@/generated/prisma/enums";
import {
  formatReportDate,
  formatViolenceTypes,
  STATUS_LABELS,
  URGENCY_LABELS,
} from "@/feature/satgas/constants";
import type { SatgasListItem } from "@/feature/satgas/service";

const STATUS_DOT: Record<ReportStatus, string> = {
  DITERIMA: "bg-primary",
  VERIFIKASI: "bg-primary/70",
  PEMERIKSAAN: "bg-chart-2",
  REKOMENDASI: "bg-chart-4",
  KEPUTUSAN: "bg-chart-3",
  PEMULIHAN: "bg-chart-1",
  SELESAI: "bg-muted-foreground/50",
  TIDAK_DITINDAKLANJUTI: "bg-destructive/60",
  DIALIHKAN: "bg-destructive/50",
};

const URGENCY_DOT: Record<Urgency, string> = {
  RENDAH: "bg-muted-foreground/40",
  SEDANG: "bg-primary/60",
  TINGGI: "bg-destructive/70",
};

const mobileLabel =
  "font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground lg:hidden";

export function SatgasReportList({ items }: { items: SatgasListItem[] }) {
  return (
    <div>
      <div className="hidden border-t border-border/80 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto_auto_auto] lg:gap-4">
        <span>Tiket / masuk</span>
        <span>Kekerasan</span>
        <span>Status</span>
        <span>Urgensi</span>
        <span>Perlindungan</span>
      </div>

      <ul className="divide-y divide-border/80 border-y border-border/80">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid grid-cols-2 gap-x-4 gap-y-4 py-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto_auto_auto] lg:items-center lg:gap-4"
          >
            <div className="col-span-2 min-w-0 lg:col-span-1">
              <p className="font-mono text-sm tracking-tight">
                {item.ticketCode}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatReportDate(item.createdAt)}
              </p>
            </div>

            <div className="col-span-2 min-w-0 lg:col-span-1">
              <p className={mobileLabel}>Kekerasan</p>
              <p className="mt-1 text-sm leading-relaxed lg:mt-0">
                {formatViolenceTypes(item.violenceTypes)}
              </p>
            </div>

            <div>
              <p className={mobileLabel}>Status</p>
              <span className="mt-1 inline-flex items-center gap-2 text-sm lg:mt-0">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${STATUS_DOT[item.status]}`}
                />
                {STATUS_LABELS[item.status]}
              </span>
            </div>

            <div>
              <p className={mobileLabel}>Urgensi</p>
              <span className="mt-1 inline-flex items-center gap-2 text-sm lg:mt-0">
                <span
                  aria-hidden
                  className={`size-1.5 rounded-full ${URGENCY_DOT[item.urgency]}`}
                />
                {URGENCY_LABELS[item.urgency]}
              </span>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <p className={mobileLabel}>Perlindungan</p>
              {item.needsProtection ? (
                <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent/60 px-2 py-0.5 text-[11px] text-accent-foreground lg:mt-0">
                  <ShieldCheck size={13} weight="fill" className="text-primary" />
                  Perlindungan
                </span>
              ) : (
                <span className="mt-1 block text-xs text-muted-foreground lg:mt-0">
                  Tidak diminta
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
