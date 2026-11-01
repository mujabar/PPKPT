import Link from "next/link";

import type { SatgasListResult } from "@/feature/satgas/service";
import {
  satgasHref,
  type SatgasFilters,
} from "@/feature/satgas/validation";

const linkClass =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:border-primary/30 hover:bg-accent/50 active:translate-y-px";

const disabledClass =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border/60 px-4 text-sm text-muted-foreground/50";

export function SatgasPagination({
  result,
  filters,
}: {
  result: SatgasListResult;
  filters: SatgasFilters;
}) {
  const start =
    result.total === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const end = Math.min(result.page * result.pageSize, result.total);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {`${start}–${end} dari ${result.total} laporan · halaman ${result.page}/${result.totalPages}`}
      </p>

      <nav aria-label="Pembagian halaman" className="flex gap-2">
        {result.page > 1 ? (
          <Link
            href={satgasHref(filters, result.page - 1)}
            className={linkClass}
          >
            Sebelumnya
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledClass}>
            Sebelumnya
          </span>
        )}

        {result.page < result.totalPages ? (
          <Link
            href={satgasHref(filters, result.page + 1)}
            className={linkClass}
          >
            Berikutnya
          </Link>
        ) : (
          <span aria-disabled="true" className={disabledClass}>
            Berikutnya
          </span>
        )}
      </nav>
    </div>
  );
}
