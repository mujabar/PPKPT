import "dotenv/config";
import assert from "node:assert/strict";
import { prisma } from "../src/lib/prisma";
import { getMyReport, listMyReports } from "../src/feature/pelapor/my-reports-service";
async function main() {
  const ids = [crypto.randomUUID(), crypto.randomUUID()];
  try {
    const profiles = await Promise.all(ids.map((id) => prisma.profile.create({ data: { id, fullName: "Pelapor Uji Fiktif", email: `${id}@example.invalid` } })));
    const reports = await Promise.all(profiles.map((profile, index) => prisma.report.create({ data: { reporterId: profile.id, ticketCode: `UJI-${profile.id}`, reporterRole: "KORBAN", violenceTypes: ["PSIKIS"], incidentDate: new Date(), incidentLocation: "Lokasi fiktif", chronology: "Kronologi fiktif untuk pengujian isolasi data.", status: index ? "DIALIHKAN" : "DITERIMA", statusHistory: { create: [{ toStatus: "DITERIMA", note: "Catatan publik fiktif", visibleToReporter: true }, { toStatus: "VERIFIKASI", note: "RAHASIA_INTERNAL_UJI", visibleToReporter: false }] } } })));
    for (let index = 0; index < profiles.length; index++) {
      const list = await listMyReports(profiles[index], {});
      assert.equal(list.count, 1); assert.equal(list.items[0].id, reports[index].id);
      assert.ok(!("chronology" in list.items[0]));
      assert.equal(await getMyReport(profiles[index], reports[1-index].id), null);
      assert.equal((await listMyReports(profiles[index], { ticket: reports[1-index].ticketCode })).count, 0);
      const detail = await getMyReport(profiles[index], reports[index].id);
      assert.equal(detail?.statusHistory.length, 1);
      assert.ok(!JSON.stringify(detail).includes("RAHASIA_INTERNAL_UJI"));
      assert.ok(!JSON.stringify(detail).includes("changedById"));
      assert.equal((await listMyReports(profiles[index], { status: index ? "DITERIMA" : "DIALIHKAN" })).count, 0);
      assert.equal((await listMyReports(profiles[index], { page: 2 })).items.length, 0);
      await assert.rejects(listMyReports({ ...profiles[index], role: "ADMIN" }, {}));
      await assert.rejects(getMyReport({ ...profiles[index], isActive: false }, reports[index].id));
    }
    console.log("Lulus: isolasi dua pelapor, filter, pencarian, pagination, riwayat privat, peran, dan akun nonaktif.");
  } finally {
    await prisma.report.deleteMany({ where: { reporterId: { in: ids } } });
    await prisma.profile.deleteMany({ where: { id: { in: ids } } });
    await prisma.$disconnect();
  }
}
main().catch(() => { console.error("Uji laporan gagal; detail sensitif tidak dicetak."); process.exitCode = 1; });
