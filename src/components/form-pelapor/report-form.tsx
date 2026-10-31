"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ClipboardText,
  LockKey,
  Plus,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  submitReportAction,
  type ReportFormState,
} from "@/feature/pelapor/actions";
import {
  AFFILIATION_OPTIONS,
  REPORTER_ROLE_OPTIONS,
  VIOLENCE_TYPE_OPTIONS,
} from "@/feature/pelapor/constants";
import type { Affiliation } from "@/generated/prisma/enums";

import { EvidencePanel } from "./evidence-panel";

const initialState: ReportFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

const fieldClass =
  "h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive";

const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive";

type RespondentRow = {
  id: string;
  name: string;
  identifier: string;
  affiliation: Affiliation;
  description: string;
};

type WitnessRow = {
  id: string;
  name: string;
  contact: string;
  notes: string;
};

function newRespondent(): RespondentRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    identifier: "",
    affiliation: "TIDAK_DIKETAHUI",
    description: "",
  };
}

function newWitness(): WitnessRow {
  return {
    id: crypto.randomUUID(),
    name: "",
    contact: "",
    notes: "",
  };
}

function FieldError({
  id,
  messages,
}: {
  id: string;
  messages?: string[];
}) {
  if (!messages?.length) {
    return null;
  }

  return (
    <p
      id={id}
      className="flex items-start gap-1.5 text-xs leading-relaxed text-destructive"
    >
      <WarningCircle size={13} weight="fill" className="mt-0.5 shrink-0" />
      {messages.join(" ")}
    </p>
  );
}

function Section({
  index,
  title,
  description,
  delay,
  children,
}: {
  index: string;
  title: string;
  description?: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <section className={`animate-rise border-t border-border/80 pt-6 ${delay}`}>
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {index}
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ReportForm({
  reporterName,
  submissionId: initialSubmissionId,
}: {
  reporterName: string;
  submissionId: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitReportAction,
    initialState,
  );
  const [submissionId] = useState(initialSubmissionId);
  const [respondents, setRespondents] = useState<RespondentRow[]>([]);
  const [witnesses, setWitnesses] = useState<WitnessRow[]>([]);
  const [copied, setCopied] = useState(false);

  const errorFor = (key: string) => state.fieldErrors[key]?.join(" ");

  const updateRespondent = (id: string, patch: Partial<RespondentRow>) => {
    setRespondents((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  const updateWitness = (id: string, patch: Partial<WitnessRow>) => {
    setWitnesses((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
  };

  async function copyTicket() {
    if (!state.ticketCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(state.ticketCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (state.status === "success" && state.ticketCode) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:py-20">
        <div className="animate-rise">
          <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-accent text-primary">
            <CheckCircle size={26} weight="fill" />
          </div>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Laporan diterima
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tighter">
            Simpan nomor tiket ini.
          </h1>

          <div className="mt-6 flex flex-col gap-3 border-y border-border/80 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-2xl tracking-tight sm:text-3xl">
              {state.ticketCode}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={copyTicket}
              className="w-fit gap-2 bg-background"
            >
              {copied ? (
                <>
                  <CheckCircle size={15} weight="fill" />
                  Tersalin
                </>
              ) : (
                <>
                  <ClipboardText size={15} />
                  Salin nomor
                </>
              )}
            </Button>
          </div>

          <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-muted-foreground">
            {state.message} Gunakan nomor tiket untuk pelacakan. Laporan
            tersimpan dengan status awal DITERIMA dan urgensi SEDANG.
          </p>

          <EvidencePanel initialTicket={state.ticketCode} />

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pelapor"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
            >
              Kembali ke area pelapor
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/pelapor/form-laporan"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-medium transition hover:border-primary/30 hover:bg-accent/50 active:translate-y-px"
            >
              Kirim laporan lain
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
      <Link
        href="/pelapor"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Area pelapor
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <aside className="animate-rise lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            Formulir / 03
          </p>
          <h1 className="mt-4 max-w-[17ch] text-3xl font-semibold leading-[1.05] tracking-tighter text-balance sm:text-4xl">
            Kirim laporan dengan batas yang jelas.
          </h1>
          <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
            Isi data kejadian, pihak terkait, dan kebutuhan perlindungan. Nomor
            tiket dibuat setelah laporan benar-benar tersimpan.
          </p>

          <div className="mt-6 border-l-2 border-primary bg-accent/40 px-4 py-3">
            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
              <LockKey size={14} />
              Rahasia
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Data laporan hanya dapat diakses pelapor dan Satgas. Kronologi,
              identitas, dan kontak tidak ditulis ke log aplikasi.
            </p>
          </div>

          <ol className="mt-8 divide-y divide-border/80 border-y border-border/80">
            {[
              ["01", "Isi laporan", "Kejadian, pihak terkait, dan perlindungan."],
              ["02", "Validasi server", "Zod memeriksa field sebelum disimpan."],
              ["03", "Nomor tiket", "Laporan, terlapor, saksi, dan status awal tersimpan bersama."],
            ].map(([index, title, detail]) => (
              <li key={index} className="grid grid-cols-[auto_1fr] gap-3 py-3.5">
                <span className="font-mono text-[10px] text-primary/70">
                  {index}
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Pelapor: {reporterName}
          </p>
        </aside>

        <div><EvidencePanel />
        <form action={formAction} noValidate className="flex flex-col gap-8">
          <input type="hidden" name="submissionId" value={submissionId} />

          <div aria-live="polite">
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
          </div>

          <Section
            index="01"
            title="Posisi pelapor"
            description="Pilih posisi Anda terhadap kejadian."
            delay="[animation-delay:80ms]"
          >
            <div className="grid gap-2">
              <Label htmlFor="reporterRole" className="text-xs font-medium">
                Posisi Anda
              </Label>
              <select
                id="reporterRole"
                name="reporterRole"
                defaultValue=""
                className={fieldClass}
                aria-invalid={Boolean(errorFor("reporterRole"))}
                aria-describedby={
                  errorFor("reporterRole") ? "reporterRole-error" : undefined
                }
              >
                <option value="" disabled>
                  Pilih posisi
                </option>
                {REPORTER_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <FieldError
                id="reporterRole-error"
                messages={state.fieldErrors.reporterRole}
              />
            </div>
          </Section>

          <Section
            index="02"
            title="Kejadian"
            description="Tanggal tidak boleh berada di masa depan."
            delay="[animation-delay:120ms]"
          >
            <div className="grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="incidentDate" className="text-xs font-medium">
                    Tanggal kejadian
                  </Label>
                  <Input
                    id="incidentDate"
                    name="incidentDate"
                    type="date"
                    className={fieldClass}
                    aria-invalid={Boolean(errorFor("incidentDate"))}
                    aria-describedby={
                      errorFor("incidentDate") ? "incidentDate-error" : undefined
                    }
                  />
                  <FieldError
                    id="incidentDate-error"
                    messages={state.fieldErrors.incidentDate}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="incidentLocation" className="text-xs font-medium">
                    Lokasi kejadian
                  </Label>
                  <Input
                    id="incidentLocation"
                    name="incidentLocation"
                    type="text"
                    placeholder="Gedung, ruang, atau lokasi lain"
                    className={fieldClass}
                    aria-invalid={Boolean(errorFor("incidentLocation"))}
                    aria-describedby={
                      errorFor("incidentLocation")
                        ? "incidentLocation-error"
                        : undefined
                    }
                  />
                  <FieldError
                    id="incidentLocation-error"
                    messages={state.fieldErrors.incidentLocation}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="chronology" className="text-xs font-medium">
                  Kronologi
                </Label>
                <Textarea
                  id="chronology"
                  name="chronology"
                  rows={6}
                  placeholder="Ceritakan urutan kejadian secara singkat (minimal 20 karakter)."
                  className={textareaClass}
                  aria-invalid={Boolean(errorFor("chronology"))}
                  aria-describedby={
                    errorFor("chronology") ? "chronology-error" : undefined
                  }
                />
                <FieldError
                  id="chronology-error"
                  messages={state.fieldErrors.chronology}
                />
              </div>
            </div>
          </Section>

          <Section
            index="03"
            title="Jenis kekerasan"
            description="Pilih satu atau lebih sesuai kejadian."
            delay="[animation-delay:160ms]"
          >
            <fieldset className="grid gap-2 sm:grid-cols-2">
              <legend className="sr-only">Jenis kekerasan</legend>
              {VIOLENCE_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-start gap-3 border border-border/80 bg-card px-3 py-2.5 text-sm transition hover:border-primary/30 has-[:checked]:border-primary/40 has-[:checked]:bg-accent/50"
                >
                  <input
                    type="checkbox"
                    name="violenceTypes"
                    value={option.value}
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
              <div className="sm:col-span-2">
                <FieldError
                  id="violenceTypes-error"
                  messages={state.fieldErrors.violenceTypes}
                />
              </div>
            </fieldset>
          </Section>

          <Section
            index="04"
            title="Terlapor"
            description="Boleh dikosongkan jika identitas belum diketahui. Tambahkan lebih dari satu bila perlu."
            delay="[animation-delay:200ms]"
          >
            <div className="flex flex-col gap-3">
              {respondents.length === 0 ? (
                <div className="border border-dashed border-border/90 bg-muted/15 px-4 py-5">
                  <p className="text-sm text-muted-foreground">
                    Belum ada terlapor. Jangan mengarang identitas; gunakan
                    penanda seperti “Tidak diketahui” bila perlu.
                  </p>
                </div>
              ) : null}

              {respondents.map((row, index) => (
                <div key={row.id} className="border border-border/80 bg-card">
                  <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Terlapor {String(index + 1).padStart(2, "0")}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setRespondents((rows) =>
                          rows.filter((item) => item.id !== row.id),
                        )
                      }
                      disabled={pending}
                      aria-label={`Hapus terlapor ${index + 1}`}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>

                  <div className="grid gap-4 p-4">
                    <input
                      type="hidden"
                      name="respondentRowKey"
                      value={row.id}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label
                          htmlFor={`respondent-name-${row.id}`}
                          className="text-xs font-medium"
                        >
                          Nama atau penanda
                        </Label>
                        <Input
                          id={`respondent-name-${row.id}`}
                          name="respondentName"
                          value={row.name}
                          onChange={(event) =>
                            updateRespondent(row.id, {
                              name: event.target.value,
                            })
                          }
                          placeholder="Nama, inisial, atau “Tidak diketahui”"
                          className={fieldClass}
                          aria-invalid={Boolean(
                            errorFor(`respondents.${row.id}.name`),
                          )}
                          aria-describedby={
                            errorFor(`respondents.${row.id}.name`)
                              ? `respondent-name-${row.id}-error`
                              : undefined
                          }
                        />
                        <FieldError
                          id={`respondent-name-${row.id}-error`}
                          messages={state.fieldErrors[`respondents.${row.id}.name`]}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor={`respondent-affiliation-${row.id}`}
                          className="text-xs font-medium"
                        >
                          Afiliasi
                        </Label>
                        <select
                          id={`respondent-affiliation-${row.id}`}
                          name="respondentAffiliation"
                          value={row.affiliation}
                          onChange={(event) =>
                            updateRespondent(row.id, {
                              affiliation: event.target.value as Affiliation,
                            })
                          }
                          className={fieldClass}
                        >
                          {AFFILIATION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor={`respondent-identifier-${row.id}`}
                        className="text-xs font-medium"
                      >
                        NIM / NIP (opsional)
                      </Label>
                      <Input
                        id={`respondent-identifier-${row.id}`}
                        name="respondentIdentifier"
                        value={row.identifier}
                        onChange={(event) =>
                          updateRespondent(row.id, {
                            identifier: event.target.value,
                          })
                        }
                        placeholder="Isi bila diketahui"
                        className={fieldClass}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor={`respondent-description-${row.id}`}
                        className="text-xs font-medium"
                      >
                        Keterangan (opsional)
                      </Label>
                      <Textarea
                        id={`respondent-description-${row.id}`}
                        name="respondentDescription"
                        value={row.description}
                        onChange={(event) =>
                          updateRespondent(row.id, {
                            description: event.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Ciri, peran, atau konteks yang relevan."
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setRespondents((rows) => [...rows, newRespondent()])
                  }
                  disabled={pending || respondents.length >= 10}
                  className="w-fit gap-2 bg-background"
                >
                  <Plus size={15} />
                  Tambah terlapor
                </Button>
                <FieldError
                  id="respondents-error"
                  messages={state.fieldErrors.respondents}
                />
              </div>
            </div>
          </Section>

          <Section
            index="05"
            title="Saksi (opsional)"
            description="Laporan tetap dapat dikirim tanpa saksi."
            delay="[animation-delay:240ms]"
          >
            <div className="flex flex-col gap-3">
              {witnesses.map((row, index) => (
                <div key={row.id} className="border border-border/80 bg-card">
                  <div className="flex items-center justify-between gap-3 border-b border-border/80 px-4 py-2.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Saksi {String(index + 1).padStart(2, "0")}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        setWitnesses((rows) =>
                          rows.filter((item) => item.id !== row.id),
                        )
                      }
                      disabled={pending}
                      aria-label={`Hapus saksi ${index + 1}`}
                    >
                      <Trash size={14} />
                    </Button>
                  </div>

                  <div className="grid gap-4 p-4">
                    <input type="hidden" name="witnessRowKey" value={row.id} />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label
                          htmlFor={`witness-name-${row.id}`}
                          className="text-xs font-medium"
                        >
                          Nama saksi
                        </Label>
                        <Input
                          id={`witness-name-${row.id}`}
                          name="witnessName"
                          value={row.name}
                          onChange={(event) =>
                            updateWitness(row.id, {
                              name: event.target.value,
                            })
                          }
                          placeholder="Nama atau inisial"
                          className={fieldClass}
                          aria-invalid={Boolean(
                            errorFor(`witnesses.${row.id}.name`),
                          )}
                          aria-describedby={
                            errorFor(`witnesses.${row.id}.name`)
                              ? `witness-name-${row.id}-error`
                              : undefined
                          }
                        />
                        <FieldError
                          id={`witness-name-${row.id}-error`}
                          messages={state.fieldErrors[`witnesses.${row.id}.name`]}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label
                          htmlFor={`witness-contact-${row.id}`}
                          className="text-xs font-medium"
                        >
                          Kontak (opsional)
                        </Label>
                        <Input
                          id={`witness-contact-${row.id}`}
                          name="witnessContact"
                          value={row.contact}
                          onChange={(event) =>
                            updateWitness(row.id, {
                              contact: event.target.value,
                            })
                          }
                          placeholder="Email atau nomor yang diketahui"
                          className={fieldClass}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor={`witness-notes-${row.id}`}
                        className="text-xs font-medium"
                      >
                        Keterangan (opsional)
                      </Label>
                      <Textarea
                        id={`witness-notes-${row.id}`}
                        name="witnessNotes"
                        value={row.notes}
                        onChange={(event) =>
                          updateWitness(row.id, {
                            notes: event.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Apa yang diketahui saksi."
                        className={textareaClass}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setWitnesses((rows) => [...rows, newWitness()])
                  }
                  disabled={pending || witnesses.length >= 10}
                  className="w-fit gap-2 bg-background"
                >
                  <Plus size={15} />
                  Tambah saksi
                </Button>
                <FieldError
                  id="witnesses-error"
                  messages={state.fieldErrors.witnesses}
                />
              </div>
            </div>
          </Section>

          <Section
            index="06"
            title="Perlindungan"
            description="Disimpan terpisah dari urgensi laporan."
            delay="[animation-delay:280ms]"
          >
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="needsProtection"
                className="mt-0.5 size-4 accent-primary"
              />
              <span>
                <span className="font-medium">
                  Saya membutuhkan perlindungan
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  Satgas akan memprioritaskan langkah pengamanan awal.
                </span>
              </span>
            </label>
          </Section>

          <div className="flex flex-col gap-4 border-t border-border/80 pt-6">
            <Button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              className="h-10 w-full gap-2 rounded-lg sm:w-fit sm:px-6"
            >
              {pending ? (
                <>
                  <span
                    aria-hidden
                    className="size-1.5 animate-pulse rounded-full bg-primary-foreground"
                  />
                  Mengirim laporan...
                </>
              ) : (
                <>
                  Kirim laporan
                  <ArrowRight size={16} />
                </>
              )}
            </Button>

            <p className="max-w-[58ch] text-xs leading-relaxed text-muted-foreground">
              Dengan mengirim, laporan tercatat dengan status awal DITERIMA dan
              urgensi SEDANG. Data laporan bersifat rahasia dan hanya dapat
              diakses pelapor serta Satgas.
            </p>
          </div>
        </form></div>
      </div>
    </main>
  );
}
