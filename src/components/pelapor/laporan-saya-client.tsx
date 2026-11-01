"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { listMyReportsAction } from "@/feature/pelapor/my-reports-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { reportDate, readable, reportLinkClass, ReportSkeleton, statusLabels } from "./report-display";
export function LaporanSayaClient() {
  const [ticket, setTicket] = useState(""); const [status, setStatus] = useState("");
  const [query, setQuery] = useState({ ticket: "", status: "", page: 1 });
  const [data, setData] = useState<Awaited<ReturnType<typeof listMyReportsAction>> | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const load = useCallback(() => setRetry((value) => value + 1), []);
  useEffect(() => { let active = true;
    Promise.resolve().then(() => { if (!active) return null; setLoading(true); setError(false); return listMyReportsAction(query); }).then((result) => { if (active && result !== null) setData(result); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, retry]);
  return <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
    <div className="grid gap-6 border-b pb-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="font-mono text-xs uppercase tracking-widest text-primary">Area pelapor / Laporan saya</p><h1 className="mt-4 text-3xl font-semibold tracking-tight">Pantau laporan Anda.</h1><p className="mt-3 max-w-prose text-sm text-muted-foreground">Lihat status dan perkembangan penanganan. Isi laporan hanya tersedia di halaman detail.</p></div><Link href="/pelapor/form-laporan" className={reportLinkClass}>Buat laporan</Link></div>
    <form className="my-8 grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end" onSubmit={(event) => { event.preventDefault(); setQuery({ ticket, status, page: 1 }); }}>
      <div className="grid gap-2"><Label htmlFor="ticket-search">Cari nomor tiket</Label><Input id="ticket-search" value={ticket} maxLength={40} onChange={(event) => setTicket(event.target.value)} placeholder="PPKPT-2026-…" /></div>
      <div className="grid gap-2"><Label htmlFor="status-filter">Status laporan</Label><select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border bg-background px-3 text-sm"><option value="">Semua status</option>{Object.entries(statusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <Button type="submit" className="active:scale-[0.98]">Terapkan</Button>
    </form>
    {loading ? <ReportSkeleton /> : error ? <div role="alert" className="border-l-2 border-destructive p-5"><p>Daftar laporan belum dapat dimuat.</p><Button variant="outline" onClick={load} className="mt-3">Coba lagi</Button></div> : data && <>
      <p role="status" className="mb-3 font-mono text-xs text-muted-foreground">{data.count} laporan · halaman {data.page}</p>
      {!data.items.length ? <div className="border-y py-14"><h2 className="text-lg font-medium">{query.ticket || query.status ? "Tidak ada laporan yang cocok" : "Belum ada laporan"}</h2><p className="mt-2 text-sm text-muted-foreground">{query.ticket || query.status ? "Ubah pencarian atau pilih semua status." : "Buat laporan pertama Anda melalui formulir laporan."}</p></div> : <ul className="divide-y border-y">{data.items.map((item) => <li key={item.id} className="grid gap-4 py-6 md:grid-cols-[1.4fr_1fr_auto] md:items-center"><div><p className="font-mono text-sm">{item.ticketCode}</p><p className="mt-2 text-xs text-muted-foreground">{reportDate(item.createdAt)}</p></div><div><p className="text-sm font-medium">{statusLabels[item.status]}</p><p className="mt-2 text-xs capitalize text-muted-foreground">{item.violenceTypes.map(readable).join(", ")}</p></div><Link className={reportLinkClass} href={`/pelapor/form-laporan/${item.id}`}>Lihat detail</Link></li>)}</ul>}
      <nav aria-label="Halaman laporan" className="mt-6 flex justify-between gap-3"><Button variant="outline" disabled={data.page <= 1} onClick={() => setQuery({ ...query, page: query.page - 1 })}>Sebelumnya</Button><Button variant="outline" disabled={data.page * 8 >= data.count} onClick={() => setQuery({ ...query, page: query.page + 1 })}>Berikutnya</Button></nav>
    </>}
  </main>;
}
