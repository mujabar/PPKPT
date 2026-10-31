import "server-only";

import { randomInt } from "node:crypto";

import type { ReportStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

import type { ReportFormInput } from "./validation";

const TICKET_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const TICKET_LENGTH = 6;
const MAX_TICKET_ATTEMPTS = 5;

export class SubmissionConflictError extends Error {
  constructor() {
    super("SUBMISSION_CONFLICT");
    this.name = "SubmissionConflictError";
  }
}

export type CreatedReport = {
  id: string;
  ticketCode: string;
  status: ReportStatus;
  reused: boolean;
};

function generateTicketCode() {
  const year = new Date().getFullYear();
  let suffix = "";

  for (let index = 0; index < TICKET_LENGTH; index += 1) {
    suffix += TICKET_ALPHABET[randomInt(TICKET_ALPHABET.length)];
  }

  return `PPKPT-${year}-${suffix}`;
}

function uniqueConstraintTarget(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return [];
  }

  const candidate = error as {
    code?: unknown;
    meta?: { target?: unknown };
  };

  if (candidate.code !== "P2002") {
    return [];
  }

  const target = candidate.meta?.target;

  if (Array.isArray(target)) {
    return target.map(String);
  }

  if (typeof target === "string") {
    return [target];
  }

  return [];
}

async function findExistingSubmission(
  submissionId: string,
  profileId: string,
): Promise<CreatedReport | null> {
  const existing = await prisma.report.findUnique({
    where: { clientSubmissionId: submissionId },
    select: {
      id: true,
      ticketCode: true,
      status: true,
      reporterId: true,
    },
  });

  if (!existing) {
    return null;
  }

  if (existing.reporterId !== profileId) {
    throw new SubmissionConflictError();
  }

  return {
    id: existing.id,
    ticketCode: existing.ticketCode,
    status: existing.status,
    reused: true,
  };
}

export async function createReportForPelapor(
  profileId: string,
  input: ReportFormInput,
): Promise<CreatedReport> {
  const existing = await findExistingSubmission(input.submissionId, profileId);

  if (existing) {
    return existing;
  }

  const respondents = input.respondents.map((respondent) => ({
    name: respondent.name,
    identifier: respondent.identifier || null,
    affiliation: respondent.affiliation,
    description: respondent.description || null,
  }));

  const witnesses = input.witnesses.map((witness) => ({
    name: witness.name,
    contact: witness.contact || null,
    notes: witness.notes || null,
  }));

  for (let attempt = 1; attempt <= MAX_TICKET_ATTEMPTS; attempt += 1) {
    try {
      const report = await prisma.report.create({
        data: {
          ticketCode: generateTicketCode(),
          clientSubmissionId: input.submissionId,
          reporterId: profileId,
          isAnonymous: false,
          reporterRole: input.reporterRole,
          violenceTypes: input.violenceTypes,
          incidentDate: input.incidentDate,
          incidentLocation: input.incidentLocation,
          chronology: input.chronology,
          needsProtection: input.needsProtection,
          respondents:
            respondents.length > 0 ? { create: respondents } : undefined,
          witnesses: witnesses.length > 0 ? { create: witnesses } : undefined,
          statusHistory: {
            create: {
              toStatus: "DITERIMA",
              note: "Laporan diterima melalui formulir pelapor.",
              visibleToReporter: true,
              changedBy: { connect: { id: profileId } },
            },
          },
        },
        select: {
          id: true,
          ticketCode: true,
          status: true,
        },
      });

      return { ...report, reused: false };
    } catch (error) {
      const target = uniqueConstraintTarget(error);

      if (target.includes("clientSubmissionId")) {
        const raced = await findExistingSubmission(
          input.submissionId,
          profileId,
        );

        if (raced) {
          return raced;
        }
      }

      if (target.includes("ticketCode") && attempt < MAX_TICKET_ATTEMPTS) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("TICKET_CODE_GENERATION_FAILED");
}
