import { ClipboardText, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { redirect } from "next/navigation";

import { EmptyArea } from "@/components/shared/role-page";
import { ROLE_LABELS } from "@/feature/auth/roles";
import { getSessionProfile } from "@/feature/auth/service";
import { listSatgasReports } from "@/feature/satgas/service";
import {
  parseSatgasFilters,
  type SatgasSearchParams,
} from "@/feature/satgas/validation";
import { SatgasAccessDenied } from "./satgas-access-denied";
import { SatgasFiltersForm } from "./satgas-filters";
import { SatgasPagination } from "./satgas-pagination";
import { SatgasReportList } from "./satgas-report-list";

export async function SatgasPage({
  searchParams,
}: {
  searchParams: Promise<SatgasSearchParams>;
}) {
  const profile = await getSessionProfile();

  if (!profile) {
    redirect("/login?error=sesi");
  }

  if (
    profile.role !== "KETUA_SATGAS" &&
    profile.role !== "ANGGOTA_SATGAS"
  ) {
    return <SatgasAccessDenied profile={profile} />;
  }

  const filters = parseSatgasFilters(await searchParams);
  const result = await listSatgasReports(profile, filters);

  const isAssignedScope = result.scope === "ASSIGNED";
  const emptyTitle = filters.hasFilters
    ? "Tidak ada laporan yang cocok"
    : isAssignedScope
      ? "Belum ada kasus ditugaskan"
      : "Belum ada laporan masuk";
  const emptyDescription = filters.hasFilters
    ? "Ubah nomor tiket, status, atau urgensi lalu terapkan kembali."
    : isAssignedScope
      ? "Ketua Satgas belum menugaskan laporan kepada Anda. Daftar ini tidak membuka laporan lain."
      : "Laporan baru akan muncul di sini setelah diterima.";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:py-14">
      <header className="grid animate-rise gap-6 border-b border-border/80 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Satgas / Daftar laporan
          </p>
          <h1 className="mt-4 max-w-[24ch] text-3xl font-semibold leading-[1.05] tracking-tighter text-balance sm:text-4xl">
            Laporan dalam kewenangan Anda.
          </h1>
          <p className="mt-3 max-w-[64ch] text-sm leading-relaxed text-muted-foreground">
            {isAssignedScope
              ? "Anggota Satgas hanya melihat laporan yang ditugaskan kepadanya."
              : "Ketua Satgas dapat meninjau seluruh laporan masuk."}{" "}
            Identitas pelapor, kronologi, dan bukti tidak ditampilkan pada
            daftar ini.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-breathe rounded-full bg-primary/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          {ROLE_LABELS[profile.role]}
        </div>
      </header>

      <div className="mt-6 animate-rise [animation-delay:80ms]">
        <SatgasFiltersForm filters={filters} />
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
        <p
          role="status"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          {result.total} laporan
        </p>
        <p className="text-xs text-muted-foreground">
          {isAssignedScope ? "Hanya penugasan Anda" : "Seluruh laporan"}
        </p>
      </div>

      <div className="mt-4 animate-rise [animation-delay:140ms]">
        {result.items.length === 0 ? (
          <EmptyArea
            icon={
              filters.hasFilters ? (
                <MagnifyingGlass size={22} weight="duotone" />
              ) : (
                <ClipboardText size={22} weight="duotone" />
              )
            }
            title={emptyTitle}
            description={emptyDescription}
            action={
              filters.hasFilters ? (
                <Link
                  href="/pelapor/satgas"
                  className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:border-primary/30 hover:bg-accent/50 active:translate-y-px"
                >
                  Reset filter
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <SatgasReportList items={result.items} />
            <SatgasPagination result={result} filters={filters} />
          </>
        )}
      </div>
    </main>
  );
}
