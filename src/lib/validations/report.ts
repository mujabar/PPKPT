import { z } from "zod";

export const reporterRoleSchema = z.enum(["KORBAN", "SAKSI", "PIHAK_LAIN"]);

export const violenceTypeSchema = z.enum([
  "FISIK",
  "PSIKIS",
  "PERUNDUNGAN",
  "SEKSUAL",
  "DISKRIMINASI_INTOLERANSI",
  "KEBIJAKAN_KEKERASAN",
]);

export const urgencySchema = z.enum(["RENDAH", "SEDANG", "TINGGI"]);

export const reportSchema = z.object({
  reporterRole: reporterRoleSchema,
  violenceTypes: z
    .array(violenceTypeSchema)
    .min(1, "Pilih minimal satu bentuk kekerasan."),
  incidentDate: z.coerce
    .date("Tanggal kejadian tidak valid.")
    .max(new Date(), "Tanggal kejadian tidak boleh di masa depan."),
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
  urgency: urgencySchema.default("SEDANG"),
  needsProtection: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
  contactEmail: z.union([z.literal(""), z.email("Format email tidak valid.")]).optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
