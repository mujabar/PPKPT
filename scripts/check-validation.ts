import { reportSchema } from "../src/lib/validations/report";

const validInput = {
  reporterRole: "KORBAN",
  violenceTypes: ["PERUNDUNGAN", "PSIKIS"],
  incidentDate: "2026-10-01",
  incidentLocation: "Gedung Fakultas Teknik, lantai 3",
  chronology:
    "Korban menerima pesan dan tindakan perundungan berulang dari sesama mahasiswa selama dua minggu terakhir.",
  urgency: "TINGGI",
  isAnonymous: true,
  contactEmail: "",
};

const invalidInput = {
  reporterRole: "ORANG_ASING",
  violenceTypes: [],
  incidentDate: "2999-01-01",
  incidentLocation: "x",
  chronology: "singkat",
};

const validResult = reportSchema.safeParse(validInput);

if (!validResult.success) {
  console.error("Contoh input valid seharusnya lolos, tetapi gagal:");
  console.error(validResult.error.issues);
  process.exit(1);
}

const invalidResult = reportSchema.safeParse(invalidInput);

if (invalidResult.success) {
  console.error("Contoh input tidak valid seharusnya ditolak, tetapi lolos.");
  process.exit(1);
}

console.log("Contoh validasi Zod berjalan.");
console.log(
  `- Input valid diterima: ${validResult.data.violenceTypes.join(", ")} (urgensi ${validResult.data.urgency})`,
);
console.log(
  `- Input tidak valid ditolak: ${invalidResult.error.issues
    .map((issue) => `${issue.path.join(".") || "form"}: ${issue.message}`)
    .join("; ")}`,
);
