import assert from "node:assert/strict";
import sharp from "sharp";
import { inspectEvidenceFile } from "../src/feature/pelapor/evidence-validation";

async function main() {
  for (const format of ["jpeg", "png", "webp"] as const) {
    const buffer = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#739684" } }).toFormat(format).toBuffer();
    const result = await inspectEvidenceFile({ buffer, declaredMimeType: `image/${format}`, fileName: `fiktif.${format}` });
    assert.equal(result.mimeType, `image/${format}`);
    await assert.rejects(inspectEvidenceFile({ buffer, declaredMimeType: "application/pdf", fileName: "palsu.pdf" }));
    await assert.rejects(inspectEvidenceFile({ buffer: buffer.subarray(0, 12), declaredMimeType: `image/${format}`, fileName: "rusak" }));
  }
  for (const buffer of [Buffer.alloc(0), Buffer.alloc(5 * 1024 * 1024 + 1), Buffer.from("bukan gambar")]) {
    await assert.rejects(inspectEvidenceFile({ buffer, declaredMimeType: "image/png", fileName: "palsu.png" }));
  }
  console.log("Validasi bukti lulus: JPEG/PNG/WebP fiktif, MIME palsu, gambar rusak, kosong, dan ukuran berlebih.");
}
main().catch(() => { console.error("Pemeriksaan bukti gagal."); process.exitCode = 1; });
