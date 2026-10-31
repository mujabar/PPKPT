import { Suspense } from "react";

import { FormLaporan } from "@/components/form-pelapor/form-laporan";

function FormLaporanFallback() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="flex flex-col gap-3">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-72 max-w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mt-6 h-24 animate-pulse border-l-2 border-primary/30 bg-muted/30" />
        </div>
        <div className="h-[32rem] animate-pulse border border-border/80 bg-muted/20" />
      </div>
    </main>
  );
}

export default function FormLaporanPage() {
  return (
    <Suspense fallback={<FormLaporanFallback />}>
      <FormLaporan />
    </Suspense>
  );
}
