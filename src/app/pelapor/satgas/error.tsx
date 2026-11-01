"use client";

import { Button } from "@/components/ui/button";

export default function SatgasError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-destructive">
        Gangguan
      </p>
      <h1 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-tighter">
        Daftar laporan belum dapat dimuat.
      </h1>
      <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
        Data tidak ditampilkan sampai pemuatan berhasil. Periksa koneksi lalu
        coba lagi.
      </p>
      <Button
        type="button"
        onClick={() => reset()}
        className="mt-8 h-10 w-fit"
      >
        Coba lagi
      </Button>
    </main>
  );
}
