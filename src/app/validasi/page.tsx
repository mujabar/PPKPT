"use client";

import {
  ArrowLeft,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useActionState, type ReactNode } from "react";

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
  {
    value: "KEBIJAKAN_KEKERASAN",
    label: "Kebijakan yang mengandung kekerasan",
  },
];

const notes = [
  {
    title: "Skema yang dipakai",
    detail:
      "reportSchema memeriksa peran, bentuk kekerasan, tanggal, lokasi, dan kronologi.",
  },
  {
    title: "Tanpa penyimpanan",
    detail:
      "Server Action hanya mengembalikan status validasi; tidak ada data yang ditulis.",
  },
  {
    title: "Galat per field",
    detail: "Pesan muncul tepat di bawah input yang bermasalah.",
  },
];

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p className="flex items-start gap-1.5 text-xs leading-relaxed text-destructive">
      <WarningCircle size={13} weight="fill" className="mt-0.5 shrink-0" />
      {messages.join(" ")}
    </p>
  );
}

function Section({
  index,
  title,
  delay,
  children,
}: {
  index: string;
  title: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`animate-rise border-t border-border/80 pt-6 ${delay}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {index}
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ValidasiPage() {
  const [state, formAction, pending] = useActionState(
    submitReport,
    initialState,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Beranda
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <aside className="animate-rise lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Demo / 02
          </p>
          <h1 className="mt-4 max-w-[16ch] text-3xl font-semibold leading-[1.05] tracking-tighter text-balance sm:text-4xl">
            Validasi laporan sebelum disimpan.
          </h1>
          <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
            Form ini memakai <code className="font-mono text-[0.9em]">reportSchema</code>{" "}
            lewat Server Action. Cocok untuk melihat bagaimana Zod menolak
            input tidak lengkap sebelum masuk ke database.
          </p>

          <div className="mt-8 border-y border-border/80">
            {notes.map((note, index) => (
              <div
                key={note.title}
                className="grid grid-cols-[auto_1fr] gap-3 border-b border-border/80 py-3.5 last:border-b-0"
              >
                <span className="font-mono text-[10px] text-primary/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium">{note.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {note.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            src/lib/validations/report.ts
          </p>
        </aside>

        <form action={formAction} noValidate className="flex flex-col gap-8">
          <div aria-live="polite" className="flex flex-col gap-3">
            {state.status === "error" && state.message ? (
              <div
                role="alert"
                className="flex animate-rise items-start gap-3 border-l-2 border-destructive bg-destructive/5 px-4 py-3"
              >
                <WarningCircle
                  size={17}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-destructive"
                />
                <span className="text-sm leading-relaxed text-destructive">
                  {state.message}
                </span>
              </div>
            ) : null}

            {state.status === "success" ? (
              <div
                role="status"
                className="flex animate-rise items-start gap-3 border-l-2 border-primary bg-accent/50 px-4 py-3"
              >
                <CheckCircle
                  size={17}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-primary"
                />
                <span className="text-sm leading-relaxed">{state.message}</span>
              </div>
            ) : null}
          </div>

          <Section index="01" title="Identitas laporan" delay="[animation-delay:80ms]">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="reporterRole" className="text-xs font-medium">
                  Peran pelapor
                </label>
                <select
                  id="reporterRole"
                  name="reporterRole"
                  defaultValue=""
                  className={fieldClass}
                  aria-invalid={Boolean(state.fieldErrors.reporterRole)}
                  aria-describedby={
                    state.fieldErrors.reporterRole ? "reporterRole-error" : undefined
                  }
                >
                  <option value="" disabled>
                    Pilih peran
                  </option>
                  {reporterRoles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div id="reporterRole-error">
                  <FieldError messages={state.fieldErrors.reporterRole} />
                </div>
              </div>

              <fieldset className="grid gap-2">
                <legend className="text-xs font-medium">Bentuk kekerasan</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {violenceTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex cursor-pointer items-start gap-3 border border-border/80 bg-card px-3 py-2.5 text-sm transition hover:border-primary/30 has-[:checked]:border-primary/40 has-[:checked]:bg-accent/50"
                    >
                      <input
                        type="checkbox"
                        name="violenceTypes"
                        value={type.value}
                        className="mt-0.5 size-4 accent-primary"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
                <FieldError messages={state.fieldErrors.violenceTypes} />
              </fieldset>
            </div>
          </Section>

          <Section index="02" title="Kejadian" delay="[animation-delay:140ms]">
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <label htmlFor="incidentDate" className="text-xs font-medium">
                    Tanggal kejadian
                  </label>
                  <input
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    className={fieldClass}
                    aria-invalid={Boolean(state.fieldErrors.incidentDate)}
                    aria-describedby={
                      state.fieldErrors.incidentDate
                        ? "incidentDate-error"
                        : undefined
                    }
                  />
                  <div id="incidentDate-error">
                    <FieldError messages={state.fieldErrors.incidentDate} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="urgency" className="text-xs font-medium">
                    Urgensi
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    defaultValue="SEDANG"
                    className={fieldClass}
                    aria-invalid={Boolean(state.fieldErrors.urgency)}
                  >
                    <option value="RENDAH">Rendah</option>
                    <option value="SEDANG">Sedang</option>
                    <option value="TINGGI">Tinggi</option>
                  </select>
                  <FieldError messages={state.fieldErrors.urgency} />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="incidentLocation" className="text-xs font-medium">
                  Lokasi kejadian
                </label>
                <input
                  id="incidentLocation"
                  name="incidentLocation"
                  type="text"
                  placeholder="Contoh: Gedung Fakultas Teknik, lantai 3"
                  className={fieldClass}
                  aria-invalid={Boolean(state.fieldErrors.incidentLocation)}
                  aria-describedby={
                    state.fieldErrors.incidentLocation
                      ? "incidentLocation-error"
                      : undefined
                  }
                />
                <div id="incidentLocation-error">
                  <FieldError messages={state.fieldErrors.incidentLocation} />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="chronology" className="text-xs font-medium">
                  Kronologi
                </label>
                <textarea
                  id="chronology"
                  name="chronology"
                  rows={5}
                  placeholder="Ceritakan kejadian secara singkat (minimal 20 karakter)."
                  className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
                  aria-invalid={Boolean(state.fieldErrors.chronology)}
                  aria-describedby={
                    state.fieldErrors.chronology ? "chronology-error" : undefined
                  }
                />
                <div id="chronology-error">
                  <FieldError messages={state.fieldErrors.chronology} />
                </div>
              </div>
            </div>
          </Section>

          <Section index="03" title="Kontak & preferensi" delay="[animation-delay:200ms]">
            <div className="grid gap-5">
              <div className="grid gap-2">
                <label htmlFor="contactEmail" className="text-xs font-medium">
                  Email kontak (opsional)
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="nama@kampus.ac.id"
                  className={fieldClass}
                  aria-invalid={Boolean(state.fieldErrors.contactEmail)}
                  aria-describedby={
                    state.fieldErrors.contactEmail ? "contactEmail-error" : undefined
                  }
                />
                <div id="contactEmail-error">
                  <FieldError messages={state.fieldErrors.contactEmail} />
                </div>
              </div>

              <div className="grid gap-3">
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span>
                    <span className="font-medium">Kirim sebagai pelapor anonim</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      Email kontak tetap opsional dan tidak ditampilkan ke publik.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="needsProtection"
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span>
                    <span className="font-medium">Membutuhkan perlindungan</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      Satgas akan memprioritaskan langkah pengamanan awal.
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </Section>

          <div className="flex flex-col gap-3 border-t border-border/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? (
                <>
                  <span
                    aria-hidden
                    className="size-1.5 animate-pulse rounded-full bg-primary-foreground"
                  />
                  Memvalidasi...
                </>
              ) : (
                "Validasikan laporan"
              )}
            </button>
            <p className="text-xs text-muted-foreground">
              Tidak ada data yang tersimpan pada demo ini.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
