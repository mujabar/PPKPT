import { z } from "zod";

import type { ReportStatus, Urgency } from "@/generated/prisma/enums";

import { REPORT_STATUS_VALUES, URGENCY_VALUES } from "./constants";

export type SatgasFilters = {
  q: string;
  status?: ReportStatus;
  urgency?: Urgency;
  page: number;
  hasFilters: boolean;
};

export type SatgasSearchParams = Record<
  string,
  string | string[] | undefined
>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseSatgasFilters(
  params: SatgasSearchParams,
): SatgasFilters {
  const q = z
    .string()
    .trim()
    .max(40)
    .catch("")
    .parse(firstValue(params.q) ?? "")
    .toUpperCase();

  const statusValue = firstValue(params.status);
  const urgencyValue = firstValue(params.urgency);

  const status = REPORT_STATUS_VALUES.includes(
    statusValue as ReportStatus,
  )
    ? (statusValue as ReportStatus)
    : undefined;

  const urgency = URGENCY_VALUES.includes(urgencyValue as Urgency)
    ? (urgencyValue as Urgency)
    : undefined;

  const page = z.coerce
    .number()
    .int()
    .min(1)
    .max(10000)
    .catch(1)
    .parse(firstValue(params.page) ?? "1");

  return {
    q,
    status,
    urgency,
    page,
    hasFilters: Boolean(q || status || urgency),
  };
}

export function satgasHref(filters: SatgasFilters, page = 1) {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.urgency) {
    params.set("urgency", filters.urgency);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return `/pelapor/satgas${query ? `?${query}` : ""}`;
}
