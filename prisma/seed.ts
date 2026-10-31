import "dotenv/config";

import {
  ReporterRole,
  Urgency,
  ViolenceType,
} from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

const DEMO_TICKET = "PPKPT-2026-DEMO01";

const demoReport = {
  ticketCode: DEMO_TICKET,
  reporterRole: ReporterRole.KORBAN,
  violenceTypes: [ViolenceType.PERUNDUNGAN, ViolenceType.PSIKIS],
  incidentDate: new Date("2026-10-01T09:00:00.000Z"),
  incidentLocation: "Gedung Fakultas Teknik, lantai 3 (data fiktif)",
  chronology:
    "Data fiktif untuk verifikasi koneksi Prisma: korban menerima perundungan berulang selama dua minggu. Tidak terkait orang atau kejadian nyata.",
  urgency: Urgency.SEDANG,
  isAnonymous: true,
};

async function main() {
  const saved = await prisma.report.upsert({
    where: { ticketCode: DEMO_TICKET },
    update: demoReport,
    create: demoReport,
  });

  const readBack = await prisma.report.findUniqueOrThrow({
    where: { ticketCode: DEMO_TICKET },
  });

  const checks: Array<[string, boolean]> = [
    ["id", readBack.id === saved.id],
    ["ticketCode", readBack.ticketCode === demoReport.ticketCode],
    ["reporterRole", readBack.reporterRole === demoReport.reporterRole],
    [
      "violenceTypes",
      JSON.stringify(readBack.violenceTypes) ===
        JSON.stringify(demoReport.violenceTypes),
    ],
    [
      "incidentDate",
      readBack.incidentDate.getTime() === demoReport.incidentDate.getTime(),
    ],
    [
      "incidentLocation",
      readBack.incidentLocation === demoReport.incidentLocation,
    ],
    ["chronology", readBack.chronology === demoReport.chronology],
    ["urgency", readBack.urgency === demoReport.urgency],
    ["isAnonymous", readBack.isAnonymous === demoReport.isAnonymous],
  ];

  const failed = checks.filter(([, passed]) => !passed);

  console.log("Data fiktif berhasil disimpan dan dibaca kembali.");
  console.log(`- id         : ${readBack.id}`);
  console.log(`- ticketCode : ${readBack.ticketCode}`);
  console.log(`- status     : ${readBack.status}`);
  console.log(`- dibuat     : ${readBack.createdAt.toISOString()}`);

  if (failed.length > 0) {
    throw new Error(
      `Verifikasi gagal pada: ${failed.map(([name]) => name).join(", ")}`,
    );
  }

  console.log(`Semua ${checks.length} pemeriksaan nilai cocok.`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed data fiktif gagal.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
