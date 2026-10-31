import { z } from "zod";

const reporterRoleSchema = z.enum(["KORBAN", "SAKSI", "PIHAK_LAIN"]);

const violenceTypeSchema = z.enum([
  "FISIK",
  "PSIKIS",
  "PERUNDUNGAN",
  "SEKSUAL",
  "DISKRIMINASI_INTOLERANSI",
  "KEBIJAKAN_KEKERASAN",
]);

const affiliationSchema = z.enum([
  "MAHASISWA",
  "DOSEN",
  "TENDIK",
  "PIMPINAN_PT",
  "PIHAK_LUAR",
  "TIDAK_DIKETAHUI",
]);

const limitedText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter.`);

export const respondentRowSchema = z.object({
  rowKey: z.string().min(1).max(64),
  name: z
    .string()
    .trim()
    .min(2, "Nama terlapor minimal 2 karakter.")
    .max(120, "Nama terlapor maksimal 120 karakter."),
  identifier: limitedText(80, "NIM/NIP terlapor"),
  affiliation: affiliationSchema,
  description: limitedText(2000, "Keterangan terlapor"),
});

export const witnessRowSchema = z.object({
  rowKey: z.string().min(1).max(64),
  name: z
    .string()
    .trim()
    .min(2, "Nama saksi minimal 2 karakter.")
    .max(120, "Nama saksi maksimal 120 karakter."),
  contact: limitedText(120, "Kontak saksi"),
  notes: limitedText(2000, "Keterangan saksi"),
});

export const reportFormSchema = z.object({
  submissionId: z.uuid("Kunci pengiriman tidak valid. Muat ulang halaman."),
  reporterRole: reporterRoleSchema,
  incidentDate: z.coerce
    .date("Tanggal kejadian tidak valid.")
    .refine(
      (value) => value.getTime() <= Date.now(),
      "Tanggal kejadian tidak boleh di masa depan.",
    ),
  incidentLocation: z
    .string()
    .trim()
    .min(3, "Lokasi kejadian minimal 3 karakter.")
    .max(200, "Lokasi kejadian maksimal 200 karakter."),
  chronology: z
    .string()
    .trim()
    .min(20, "Kronologi minimal 20 karakter.")
    .max(5000, "Kronologi maksimal 5000 karakter."),
  violenceTypes: z
    .array(violenceTypeSchema)
    .min(1, "Pilih minimal satu bentuk kekerasan."),
  respondents: z
    .array(respondentRowSchema)
    .max(10, "Maksimal 10 terlapor dalam satu laporan."),
  witnesses: z
    .array(witnessRowSchema)
    .max(10, "Maksimal 10 saksi dalam satu laporan."),
  needsProtection: z.boolean(),
});

export type ReportFormInput = z.infer<typeof reportFormSchema>;
export type RespondentRowInput = z.infer<typeof respondentRowSchema>;
export type WitnessRowInput = z.infer<typeof witnessRowSchema>;
