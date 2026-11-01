"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle, Circle, ArrowCircleRight } from "@phosphor-icons/react";
import { getMyReportAction } from "@/feature/pelapor/my-reports-actions";
import { EvidencePanel } from "@/components/form-pelapor/evidence-panel";
import { Button } from "@/components/ui/button";
import { reportDate, readable, reportLinkClass, ReportSkeleton, statusLabels } from "./report-display";
import type { ReportStatus } from "@/generated/prisma/enums";
const stages: ReportStatus[] = ["DITERIMA", "VERIFIKASI", "PEMERIKSAAN", "REKOMENDASI", "KEPUTUSAN", "PEMULIHAN", "SELESAI"];
export function FormDetailClient() { return <Suspense fallback={<ReportSkeleton />}><DetailContent /></Suspense>; }
function DetailContent() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Awaited<ReturnType<typeof getMyReportAction>>>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(false); const [retry, setRetry] = useState(0);
  useEffect(() => { let active = true;
    Promise.resolve().then(() => { if (!active) return null; setLoading(true); setError(false); return getMyReportAction(id); }).then((result) => { if (active) setData(result); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, retry]);
  return <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6"><Link href="/laporan" className={reportLinkClass}>Kembali ke laporan saya</Link>
    {loading ? <ReportSkeleton /> : error ? <div role="alert" className="py-10"><p>Detail laporan belum dapat dimuat.</p><Button onClick={() => setRetry(retry + 1)} className="mt-4">Coba lagi</Button></div> : !data ? <div className="py-12"><h1 className="text-2xl font-semibold">Laporan tidak dapat dibuka</h1><p className="mt-3 text-muted-foreground">Laporan tidak ditemukan atau Anda tidak memiliki akses.</p></div> : <>
      <header className="mt-8 border-b pb-8"><p className="font-mono text-xs uppercase tracking-widest text-primary">Detail laporan / hanya-baca</p><h1 className="mt-3 break-all font-mono text-2xl font-semibold tracking-tight sm:text-3xl">{data.ticketCode}</h1><p className="mt-3 text-sm text-muted-foreground">Dilaporkan {reportDate(data.createdAt)}</p><p className="mt-3 font-medium">Status terkini: {statusLabels[data.status]}</p></header>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0 space-y-8">
          <section className="space-y-4"><h2 className="text-xl font-semibold tracking-tight">Informasi kejadian</h2><dl className="grid gap-5 sm:grid-cols-2">{[["Tanggal kejadian", reportDate(data.incidentDate)], ["Lokasi", data.incidentLocation], ["Posisi pelapor", readable(data.reporterRole)], ["Jenis kekerasan", data.violenceTypes.map(readable).join(", ")], ["Kebutuhan perlindungan", data.needsProtection ? "Memerlukan perlindungan" : "Tidak diminta"]].map(([label,value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm">{value}</dd></div>)}</dl><h3 className="pt-3 text-sm font-medium">Kronologi</h3><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{data.chronology}</p></section>
          <section className="border-t pt-6"><h2 className="text-xl font-semibold tracking-tight">Pihak terkait</h2><h3 className="mt-4 text-sm font-medium">Terlapor</h3>{!data.respondents.length && <p className="mt-2 text-sm text-muted-foreground">Tidak dicantumkan.</p>}<ul className="divide-y">{data.respondents.map((item) => <li key={item.id} className="space-y-1 py-3 text-sm"><p className="font-medium">{item.name}</p><p className="capitalize">{readable(item.affiliation)}{item.identifier ? ` · ${item.identifier}` : ""}</p>{item.description && <p className="whitespace-pre-wrap break-words">{item.description}</p>}</li>)}</ul><h3 className="mt-5 text-sm font-medium">Saksi</h3>{!data.witnesses.length && <p className="mt-2 text-sm text-muted-foreground">Tidak dicantumkan.</p>}<ul className="divide-y">{data.witnesses.map((item) => <li key={item.id} className="space-y-1 py-3 text-sm"><p className="font-medium">{item.name}</p><p>{item.contact}</p><p className="whitespace-pre-wrap break-words">{item.notes}</p></li>)}</ul></section>
          <EvidencePanel key={data.id} initialTicket={data.ticketCode} />
        </div>
        <aside className="min-w-0 border-t pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><h2 className="text-xl font-semibold tracking-tight">Perkembangan laporan</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Tahap yang pernah tercatat ditandai berdasarkan riwayat yang dapat Anda lihat.</p>
          <ol className="mt-6 space-y-5 lg:space-y-0">{[...stages, ...(!stages.includes(data.status) ? [data.status] : [])].map((stage, index, timeline) => {
            const current = stage === data.status; const recorded = data.statusHistory.some((item) => item.toStatus === stage); const Icon = current ? ArrowCircleRight : recorded ? CheckCircle : Circle;
            const lastEvent = data.statusHistory.filter((item) => item.toStatus === stage).at(-1);
            return <li key={stage} aria-current={current ? "step" : undefined} className="relative flex gap-3 lg:gap-4 lg:pb-7 lg:last:pb-0">
              {index < timeline.length - 1 && <span aria-hidden="true" className={`absolute bottom-0 left-[19px] top-10 hidden border-l lg:block ${recorded ? "border-primary/35" : "border-dashed border-border"}`} />}
              <Icon size={22} className={`lg:hidden ${current ? "shrink-0 text-primary" : "shrink-0 text-muted-foreground"}`} weight={current ? "fill" : "regular"} />
              <span aria-hidden="true" className={`relative hidden size-10 shrink-0 items-center justify-center rounded-full border lg:flex ${current ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_5px_var(--accent)]" : recorded ? "border-primary/25 bg-accent text-primary" : "border-border bg-background text-muted-foreground"}`}>
                {current || recorded ? <Icon size={20} weight={current ? "fill" : "regular"} /> : <span className="font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>}
              </span>
              <div className={`min-w-0 flex-1 lg:pt-2 ${current ? "lg:rounded-xl lg:border lg:border-primary/15 lg:bg-accent/40 lg:px-4 lg:pb-4 lg:pt-3" : ""}`}>
                <div className="lg:flex lg:flex-wrap lg:items-center lg:gap-2"><p className={`text-sm font-medium ${current ? "lg:text-primary" : ""}`}>{statusLabels[stage]}</p>{current && <span className="hidden rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary lg:inline-flex">Saat ini</span>}</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{current ? "Tahap saat ini" : recorded ? "Pernah tercatat" : ["DIALIHKAN", "TIDAK_DITINDAKLANJUTI"].includes(data.status) ? "Tidak tercatat · alur telah berakhir" : "Belum tercatat"}</p>
                {lastEvent && <p className="mt-2 hidden font-mono text-[10px] leading-relaxed text-muted-foreground lg:block">{reportDate(lastEvent.createdAt)}</p>}
              </div>
            </li>;
          })}</ol>
          <h3 className="mt-10 border-t pt-6 text-sm font-medium">Riwayat yang dibagikan</h3>{!data.statusHistory.length ? <p className="mt-3 text-sm text-muted-foreground">Riwayat belum tersedia. Status terkini tetap ditampilkan di atas.</p> : <ol className="mt-3 divide-y">{data.statusHistory.map((item) => <li key={item.id} className="py-4"><p className="text-sm font-medium">{statusLabels[item.toStatus]}</p><p className="mt-1 text-xs text-muted-foreground">{reportDate(item.createdAt)}</p>{item.note && <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{item.note}</p>}</li>)}</ol>}
        </aside>
      </div>
    </>}
  </main>;
}
