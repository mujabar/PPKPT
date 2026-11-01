import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  STATUS_OPTIONS,
  URGENCY_OPTIONS,
} from "@/feature/satgas/constants";
import type { SatgasFilters } from "@/feature/satgas/validation";

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function SatgasFiltersForm({ filters }: { filters: SatgasFilters }) {
  return (
    <form
      method="get"
      action="/pelapor/satgas"
      className="grid gap-4 border-y border-border/80 py-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] lg:items-end"
    >
      <div className="grid gap-2">
        <Label htmlFor="q" className="text-xs font-medium">
          Cari nomor tiket
        </Label>
        <Input
          id="q"
          name="q"
          defaultValue={filters.q}
          maxLength={40}
          autoComplete="off"
          placeholder="PPKPT-2026-…"
          className="h-10 rounded-lg bg-card px-3 text-sm"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status" className="text-xs font-medium">
          Status laporan
        </Label>
        <select
          id="status"
          name="status"
          defaultValue={filters.status ?? ""}
          className={selectClass}
        >
          <option value="">Semua status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="urgency" className="text-xs font-medium">
          Urgensi
        </Label>
        <select
          id="urgency"
          name="urgency"
          defaultValue={filters.urgency ?? ""}
          className={selectClass}
        >
          <option value="">Semua urgensi</option>
          {URGENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="h-10">
        Terapkan
      </Button>

      <Link
        href="/pelapor/satgas"
        className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium transition hover:border-primary/30 hover:bg-accent/50 active:translate-y-px"
      >
        Reset
      </Link>
    </form>
  );
}
