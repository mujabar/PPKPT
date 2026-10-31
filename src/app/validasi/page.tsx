"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitReport, type ReportFormState } from "./actions";

const initialState: ReportFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const reporterRoles = [
  { value: "KORBAN", label: "Korban" },
  { value: "SAKSI", label: "Saksi" },
  { value: "PIHAK_LAIN", label: "Pihak lain" },
];

const violenceTypes = [
  { value: "FISIK", label: "Kekerasan fisik" },
  { value: "PSIKIS", label: "Kekerasan psikis" },
  { value: "PERUNDUNGAN", label: "Perundungan" },
  { value: "SEKSUAL", label: "Kekerasan seksual" },
  { value: "DISKRIMINASI_INTOLERANSI", label: "Diskriminasi / intoleransi" },
  { value: "KEBIJAKAN_KEKERASAN", label: "Kebijakan yang mengandung kekerasan" },
];

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100/10";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return <p className="mt-1 text-sm text-red-600 dark:text-red-400">{messages.join(" ")}</p>;
}

export default function ValidasiPage() {
  const [state, formAction, pending] = useActionState(submitReport, initialState);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; Kembali ke beranda
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Contoh validasi Zod
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Form ini memakai <code className="font-mono text-sm">reportSchema</code> dari{" "}
          <code className="font-mono text-sm">src/lib/validations/report.ts</code> lewat Server
          Action. Tidak ada data yang disimpan ke database.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-6">
        <div>
          <label htmlFor="reporterRole" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Peran pelapor
          </label>
          <select id="reporterRole" name="reporterRole" defaultValue="" className={inputClass}>
            <option value="" disabled>
              Pilih peran
            </option>
            {reporterRoles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <FieldError messages={state.fieldErrors.reporterRole} />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Bentuk kekerasan
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {violenceTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
              >
                <input type="checkbox" name="violenceTypes" value={type.value} />
                {type.label}
              </label>
            ))}
          </div>
          <FieldError messages={state.fieldErrors.violenceTypes} />
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="incidentDate" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Tanggal kejadian
            </label>
            <input id="incidentDate" name="incidentDate" type="date" className={inputClass} />
            <FieldError messages={state.fieldErrors.incidentDate} />
          </div>

          <div>
            <label htmlFor="urgency" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Urgensi
            </label>
            <select id="urgency" name="urgency" defaultValue="SEDANG" className={inputClass}>
              <option value="RENDAH">Rendah</option>
              <option value="SEDANG">Sedang</option>
              <option value="TINGGI">Tinggi</option>
            </select>
            <FieldError messages={state.fieldErrors.urgency} />
          </div>
        </div>

        <div>
          <label htmlFor="incidentLocation" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Lokasi kejadian
          </label>
          <input
            id="incidentLocation"
            name="incidentLocation"
            type="text"
            placeholder="Contoh: Gedung Fakultas Teknik, lantai 3"
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors.incidentLocation} />
        </div>

        <div>
          <label htmlFor="chronology" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Kronologi
          </label>
          <textarea
            id="chronology"
            name="chronology"
            rows={5}
            placeholder="Ceritakan kejadian secara singkat (minimal 20 karakter)."
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors.chronology} />
        </div>

        <div>
          <label htmlFor="contactEmail" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Email kontak (opsional)
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="nama@kampus.ac.id"
            className={inputClass}
          />
          <FieldError messages={state.fieldErrors.contactEmail} />
        </div>

        <div className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isAnonymous" />
            Kirim sebagai pelapor anonim
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="needsProtection" />
            Membutuhkan perlindungan
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {pending ? "Memvalidasi..." : "Validasikan laporan"}
          </button>
        </div>

        {state.status === "success" ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            {state.message}
          </p>
        ) : null}

        {state.status === "error" ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {state.message}
          </p>
        ) : null}
      </form>
    </main>
  );
}
