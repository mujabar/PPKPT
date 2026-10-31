"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadEvidenceAction, uploadEvidenceAction } from "@/feature/pelapor/evidence-actions";
import type { EvidenceView } from "@/feature/pelapor/evidence-types";

type Selection = { id: string; file: File; preview: string; message: string; done: boolean };
export function EvidencePanel({ initialTicket = "" }: { initialTicket?: string }) {
  const [ticket, setTicket] = useState(initialTicket);
  const [view, setView] = useState<EvidenceView | null>(null);
  const [files, setFiles] = useState<Selection[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const urls = useRef(new Set<string>());
  const lock = useRef(false);
  useEffect(() => () => { urls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);
  async function load(code: string) {
    setError("");
    const result = await loadEvidenceAction(code);
    if (result.status === "error") { setView(null); setError(result.message); }
    else setView(result);
  }
  async function open() {
    if (lock.current) return;
    lock.current = true; setBusy(true);
    try { setFiles([]); await load(ticket); } catch { setError("Gagal memuat bukti. Coba lagi."); }
    finally { lock.current = false; setBusy(false); }
  }
  async function upload() {
    if (lock.current || !view) return;
    lock.current = true; setBusy(true); setError("");
    try {
      for (const item of files.filter((item) => !item.done)) {
        const data = new FormData();
        data.set("ticketCode", view.ticketCode); data.set("clientUploadId", item.id); data.set("file", item.file);
        let message = "Gagal mengunggah. Coba lagi."; let done = false;
        try { const result = await uploadEvidenceAction(data); done = result.status === "ok"; message = result.status === "ok" ? "Tersimpan" : result.message; } catch { /* Retry keeps the same upload id. */ }
        setFiles((rows) => rows.map((row) => row.id === item.id ? { ...row, done, message } : row));
      }
      await load(view.ticketCode);
    } catch { setError("Daftar bukti belum dapat diperbarui. Muat ulang untuk memeriksa hasil unggah.");
    } finally { lock.current = false; setBusy(false); }
  }
  return <section className="mt-8 border-t border-border py-6">
    <h2 className="text-xl font-semibold tracking-tight">Tambahkan bukti pendukung</h2>
    <p className="mt-2 text-sm text-muted-foreground">Opsional. Laporan tetap tersimpan meskipun unggah belum berhasil. Gambar hanya dibuka pihak berwenang melalui tautan sementara.</p>
    <form onSubmit={(event) => { event.preventDefault(); void open(); }} className="mt-5 grid gap-2">
      <Label htmlFor="evidence-ticket">Nomor tiket laporan</Label>
      <Input id="evidence-ticket" value={ticket} onChange={(event) => setTicket(event.target.value)} disabled={busy} required placeholder="PPKPT-2026-XXXXXX" />
      <Button disabled={busy} className="w-fit active:scale-[0.98]">Buka bukti laporan</Button>
    </form>
    {busy && <div role="status" className="mt-4 animate-pulse rounded-lg bg-muted p-4">Memproses bukti…</div>}
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
    {view && <div className="mt-6 space-y-5">
      <p className="font-mono text-xs">{view.ticketCode} · {view.evidence.length}/10 gambar</p>
      {!view.evidence.length && <p className="border-y py-5 text-sm text-muted-foreground">Belum ada bukti tersimpan. Pilih gambar yang mendukung laporan Anda.</p>}
      <ul className="divide-y">{view.evidence.map((item) => <li key={item.id} className="flex flex-wrap justify-between gap-3 py-3 text-sm"><span className="break-all">{item.fileName}</span>{item.signedUrl ? <a className="underline" href={item.signedUrl} target="_blank" rel="noreferrer">Lihat gambar</a> : <span>Tautan gagal dibuat; buka ulang laporan.</span>}</li>)}</ul>
      {view.canUpload ? <div className="grid gap-2">
        <Label htmlFor="evidence-files">Pilih gambar bukti</Label>
        <Input id="evidence-files" type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy} aria-describedby="evidence-help" onChange={(event) => {
          const selected = Array.from(event.target.files ?? []); event.target.value = "";
          const pending = files.filter((item) => !item.done);
          if (selected.length + pending.length + view.evidence.length > 10) { setError("Maksimal 10 gambar per laporan."); return; }
          if (selected.some((file) => file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) { setError("Gunakan JPEG, PNG, atau WebP maksimal 5 MB per gambar."); return; }
          setError(""); setFiles([...pending, ...selected.map((file) => { const preview = URL.createObjectURL(file); urls.current.add(preview); return { id: crypto.randomUUID(), file, preview, message: "Belum dikirim", done: false }; })]);
        }} />
        <p id="evidence-help" className="text-xs text-muted-foreground">JPEG, PNG, WebP · maksimal 5 MB/gambar · 10 gambar/laporan.</p>
      </div> : <p className="text-sm text-muted-foreground">Penambahan bukti ditutup karena status akhir atau batas jumlah tercapai.</p>}
      <ul className="grid gap-4 sm:grid-cols-2">{files.map((item) => <li key={item.id} className="min-w-0 rounded-xl border p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.preview} alt={`Pratinjau ${item.file.name}`} className="h-36 w-full rounded-lg object-contain" />
        <p className="mt-2 truncate text-sm">{item.file.name}</p><p aria-live="polite" className="text-xs text-muted-foreground">{item.message}</p>
        {!item.done && <Button variant="ghost" disabled={busy} onClick={() => { URL.revokeObjectURL(item.preview); urls.current.delete(item.preview); setFiles((rows) => rows.filter((row) => row.id !== item.id)); }}>Batalkan pilihan</Button>}
      </li>)}</ul>
      {view.canUpload && files.some((item) => !item.done) && <Button disabled={busy} onClick={() => void upload()} className="active:scale-[0.98]">{busy ? "Mengunggah…" : "Unggah / coba kembali"}</Button>}
      <Button variant="outline" disabled={busy} onClick={() => void open()}>Muat ulang daftar dan tautan</Button>
    </div>}
  </section>;
}
