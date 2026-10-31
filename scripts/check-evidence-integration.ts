import "dotenv/config";
import assert from "node:assert/strict";
import sharp from "sharp";
import { prisma } from "../src/lib/prisma";
import { createAdminClient } from "../src/lib/supabase/admin";
import { listEvidenceForViewer, uploadEvidenceForPelapor } from "../src/feature/pelapor/evidence-service";

async function main() {
  const id = crypto.randomUUID();
  const profile = await prisma.profile.create({ data: { id, fullName: "Uji Bukti Fiktif", email: `${id}@example.invalid` } });
  const ticketCode = `PPKPT-2026-${id.replaceAll("-", "").slice(0,6).toUpperCase()}`;
  let reportId: string | undefined;
  const storage = createAdminClient().storage.from("report-evidence");
  try {
    const report = await prisma.report.create({ data: { ticketCode, reporterId: id, reporterRole: "KORBAN", violenceTypes: ["PSIKIS"], incidentDate: new Date(), incidentLocation: "Lokasi uji fiktif", chronology: "Laporan fiktif khusus verifikasi bukti." } });
    reportId = report.id;
    const buffer = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#739684" } }).png().toBuffer();
    const input = { ticketCode, clientUploadId: crypto.randomUUID(), buffer, declaredMimeType: "image/png", fileName: "fiktif.png" };
    await assert.rejects(uploadEvidenceForPelapor({ ...profile, id: crypto.randomUUID() }, input));
    await assert.rejects(listEvidenceForViewer(ticketCode, { ...profile, role: "ADMIN" }));
    await assert.rejects(listEvidenceForViewer(ticketCode, { ...profile, role: "ANGGOTA_SATGAS" }));
    await assert.rejects(listEvidenceForViewer(ticketCode, { ...profile, role: "PIMPINAN" }));
    await assert.rejects(listEvidenceForViewer(ticketCode, { ...profile, isActive: false }));
    await Promise.all([uploadEvidenceForPelapor(profile, input), uploadEvidenceForPelapor(profile, input)]);
    assert.equal(await prisma.reportEvidence.count({ where: { reportId } }), 1);
    await listEvidenceForViewer(ticketCode, { ...profile, role: "KETUA_SATGAS" });
    const outcomes = await Promise.allSettled(Array.from({ length: 11 }, () => uploadEvidenceForPelapor(profile, { ...input, clientUploadId: crypto.randomUUID() })));
    console.log(outcomes.map((outcome) => outcome.status === "fulfilled" ? "ok" : { name: outcome.reason?.name, code: outcome.reason?.code }));
    assert.equal(outcomes.filter((outcome) => outcome.status === "fulfilled").length, 9);
    assert.equal(await prisma.reportEvidence.count({ where: { reportId } }), 10);
    const view = await listEvidenceForViewer(ticketCode, profile);
    assert.equal(view.evidence.length, 10);
    assert.ok(view.evidence.every((item) => item.signedUrl));
    const signed = await fetch(view.evidence[0].signedUrl!);
    assert.equal(signed.status, 200);
    await prisma.report.update({ where: { id: reportId }, data: { status: "SELESAI" } });
    await assert.rejects(uploadEvidenceForPelapor(profile, { ...input, clientUploadId: crypto.randomUUID() }));
    console.log("Integrasi bukti lulus: otorisasi, signed URL, retry bersamaan, batas 10, status akhir.");
  } finally {
    if (reportId) {
      const { data } = await storage.list(reportId);
      if (data?.length) { const { error } = await storage.remove(data.map((item) => `${reportId}/${item.name}`)); assert.equal(error, null); }
      await prisma.report.delete({ where: { id: reportId } });
    }
    await prisma.profile.delete({ where: { id } });
    await prisma.$disconnect();
  }
}
main().catch((error: unknown) => { console.error(error instanceof Error ? { name: error.name, code: (error as {code?: string}).code, stack: error.stack?.split("\n").filter((line) => line.trim().startsWith("at ")).slice(0, 3) } : "unknown"); console.error("Pemeriksaan integrasi bukti gagal; detail sensitif tidak dicetak."); process.exitCode = 1; });
