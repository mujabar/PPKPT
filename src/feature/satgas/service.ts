import "server-only";

import type { Profile, Prisma } from "@/generated/prisma/client";
import type {
  ReportStatus,
  Urgency,
  ViolenceType,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

import { SATGAS_PAGE_SIZE } from "./constants";
import type { SatgasFilters } from "./validation";

export class SatgasAccessError extends Error {
  constructor() {
    super("SATGAS_ACCESS_DENIED");
    this.name = "SatgasAccessError";
  }
}

export type SatgasListItem = {
  id: string;
  ticketCode: string;
  createdAt: Date;
  violenceTypes: ViolenceType[];
  status: ReportStatus;
  urgency: Urgency;
  needsProtection: boolean;
};

export type SatgasListResult = {
  items: SatgasListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  scope: "ALL" | "ASSIGNED";
};

function authorize(profile: Profile) {
  if (
    profile.role !== "KETUA_SATGAS" &&
    profile.role !== "ANGGOTA_SATGAS"
  ) {
    throw new SatgasAccessError();
  }
}

export async function listSatgasReports(
  profile: Profile,
  filters: SatgasFilters,
): Promise<SatgasListResult> {
  authorize(profile);

  const where: Prisma.ReportWhereInput = {
    ...(profile.role === "ANGGOTA_SATGAS"
      ? { assignments: { some: { memberId: profile.id } } }
      : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.urgency ? { urgency: filters.urgency } : {}),
    ...(filters.q
      ? { ticketCode: { startsWith: filters.q } }
      : {}),
  };

  const total = await prisma.report.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / SATGAS_PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  const items = await prisma.report.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * SATGAS_PAGE_SIZE,
    take: SATGAS_PAGE_SIZE,
    select: {
      id: true,
      ticketCode: true,
      createdAt: true,
      violenceTypes: true,
      status: true,
      urgency: true,
      needsProtection: true,
    },
  });

  return {
    items,
    total,
    page,
    pageSize: SATGAS_PAGE_SIZE,
    totalPages,
    scope: profile.role === "KETUA_SATGAS" ? "ALL" : "ASSIGNED",
  };
}
