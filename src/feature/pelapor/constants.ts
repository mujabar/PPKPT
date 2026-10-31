import type {
  Affiliation,
  ReporterRole,
  ViolenceType,
} from "@/generated/prisma/enums";

export const REPORTER_ROLE_OPTIONS: {
  value: ReporterRole;
  label: string;
}[] = [
  { value: "KORBAN", label: "Korban" },
  { value: "SAKSI", label: "Saksi" },
  { value: "PIHAK_LAIN", label: "Pihak lain" },
];

export const VIOLENCE_TYPE_OPTIONS: {
  value: ViolenceType;
  label: string;
}[] = [
  { value: "FISIK", label: "Kekerasan fisik" },
  { value: "PSIKIS", label: "Kekerasan psikis" },
  { value: "PERUNDUNGAN", label: "Perundungan" },
  { value: "SEKSUAL", label: "Kekerasan seksual" },
  {
    value: "DISKRIMINASI_INTOLERANSI",
    label: "Diskriminasi / intoleransi",
  },
  {
    value: "KEBIJAKAN_KEKERASAN",
    label: "Kebijakan yang mengandung kekerasan",
  },
];

export const AFFILIATION_OPTIONS: { value: Affiliation; label: string }[] = [
  { value: "MAHASISWA", label: "Mahasiswa" },
  { value: "DOSEN", label: "Dosen" },
  { value: "TENDIK", label: "Tenaga kependidikan" },
  { value: "PIMPINAN_PT", label: "Pimpinan perguruan tinggi" },
  { value: "PIHAK_LUAR", label: "Pihak luar" },
  { value: "TIDAK_DIKETAHUI", label: "Tidak diketahui" },
];
