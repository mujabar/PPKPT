import "server-only";
import sharp from "sharp";

import {
  ALLOWED_EVIDENCE_MIME_TYPES,
  MAX_EVIDENCE_BYTES,
  type EvidenceMimeType,
} from "./evidence-constants";

export class EvidenceFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvidenceFileError";
  }
}

const EXTENSIONS: Record<EvidenceMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function detectMimeType(buffer: Buffer): EvidenceMimeType | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function sanitizeFileName(name: string, extension: string) {
  const base = name.split(/[\\/]/).pop() ?? "";
  const cleaned = base.replace(/[^\w.\- ]+/g, "_").trim().slice(0, 180);

  return cleaned || `bukti.${extension}`;
}

export async function inspectEvidenceFile(input: {
  buffer: Buffer;
  declaredMimeType: string;
  fileName: string;
}) {
  if (input.buffer.length === 0) {
    throw new EvidenceFileError("Berkas kosong tidak dapat diunggah.");
  }

  if (input.buffer.length > MAX_EVIDENCE_BYTES) {
    throw new EvidenceFileError("Ukuran gambar maksimal 5 MB.");
  }

  const detected = detectMimeType(input.buffer);

  if (!detected) {
    throw new EvidenceFileError(
      "Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.",
    );
  }

  if (!ALLOWED_EVIDENCE_MIME_TYPES.includes(detected)) {
    throw new EvidenceFileError(
      "Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.",
    );
  }

  const declared = input.declaredMimeType.toLowerCase();

  if (declared === "image/jpg") {
    if (detected !== "image/jpeg") {
      throw new EvidenceFileError("Jenis berkas tidak cocok dengan isinya.");
    }
  } else if (declared && declared !== detected) {
    throw new EvidenceFileError("Jenis berkas tidak cocok dengan isinya.");
  }

  try {
    const image = sharp(input.buffer, { failOn: "warning", limitInputPixels: 40000000 });
    const metadata = await image.metadata();
    if ((metadata.pages ?? 1) > 1) throw new Error("animated");
    await image.raw().toBuffer();
  } catch {
    throw new EvidenceFileError("Gambar rusak, bergerak, atau terlalu besar untuk diproses. Gunakan gambar statis maksimal 40 megapiksel.");
  }

  return {
    mimeType: detected,
    extension: EXTENSIONS[detected],
    fileName: sanitizeFileName(input.fileName, EXTENSIONS[detected]),
  };
}
