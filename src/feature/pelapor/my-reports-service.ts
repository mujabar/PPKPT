import "server-only";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { Profile } from "@/generated/prisma/client";
import { ReportStatus } from "@/generated/prisma/enums";

function authorize(profile: Profile) {
  if (!profile.isActive || profile.role !== "PELAPOR") throw new Error("ACCESS_DENIED");
}
export async function listMyReports(profile: Profile, input: { ticket?: string; status?: string; page?: number }) {
  authorize(profile);
  const page = Math.max(1, Math.min(10000, Math.floor(input.page || 1)));
  const status = z.enum(ReportStatus).safeParse(input.status);
  const where = { reporterId: profile.id, ...(status.success ? { status: status.data } : {}), ...(input.ticket?.trim() ? { ticketCode: { contains: input.ticket.trim().slice(0, 40), mode: "insensitive" as const } } : {}) };
  const [items, count] = await prisma.$transaction([
    prisma.report.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * 8, take: 8, select: { id: true, ticketCode: true, createdAt: true, violenceTypes: true, status: true } }),
    prisma.report.count({ where }),
  ]);
  return { items, count, page };
}
export async function getMyReport(profile: Profile, id: string) {
  authorize(profile);
  if (!z.uuid().safeParse(id).success) return null;
  return prisma.report.findFirst({ where: { id, reporterId: profile.id }, select: {
    id: true, ticketCode: true, createdAt: true, status: true, incidentDate: true, incidentLocation: true, chronology: true, violenceTypes: true, reporterRole: true, needsProtection: true,
    respondents: { select: { id: true, name: true, identifier: true, affiliation: true, description: true } },
    witnesses: { select: { id: true, name: true, contact: true, notes: true } },
    statusHistory: { where: { visibleToReporter: true }, orderBy: [{ createdAt: "asc" }, { id: "asc" }], select: { id: true, toStatus: true, createdAt: true, note: true } },
  } });
}
