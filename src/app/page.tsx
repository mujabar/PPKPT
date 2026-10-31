import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { BrandMark } from "@/components/shared/brand-mark";

const stack = [
  {
    name: "Next.js 16 App Router",
    detail: "Server Components, Server Actions, dan proxy sesi.",
  },
  {
    name: "Tailwind CSS 4 + shadcn/ui",
    detail: "Komponen dasar dengan token warna dan radius yang disesuaikan.",
  },
  {
    name: "Supabase PostgreSQL + Auth",
    detail: "Database terkelola dan login email/password berbasis cookie.",
  },
  {
    name: "Prisma 7",
    detail: "Skema domain PPKPT, migrasi, dan baseline RLS.",
  },
  {
    name: "Zod 4",
    detail: "Validasi form laporan di server dan contoh via terminal.",
  },
];

const flow = [
  {
    title: "Laporan diterima",
    detail: "Kode tiket dan kanal pelacakan untuk pelapor.",
  },
  {
    title: "Verifikasi",
    detail: "Kelengkapan laporan dan kewenangan Satgas.",
  },
  {
    title: "Pemeriksaan",
    detail: "Keterangan pelapor, terlapor, dan saksi.",
  },
  {
    title: "Rekomendasi & keputusan",
    detail: "Satgas menyusun, pimpinan menetapkan.",
  },
];

const checklist = [
  "Aplikasi dapat dijalankan tanpa error.",
  "Tailwind CSS dapat digunakan pada halaman awal.",
  "Prisma siap terhubung ke database Supabase.",
  "Contoh validasi sederhana dengan Zod berjalan.",
  "Panduan setup tersedia di README.md.",
];

const security = [
  {
    title: "Sesi cookie",
    detail: "Refresh token ditangani proxy Next.js 16.",
  },
  {
    title: "Peran dari database",
    detail: "Bukan dari metadata yang bisa diubah pengguna.",
  },
  {
    title: "RLS di Supabase",
    detail: "Tabel public tertutup untuk akses Data API langsung.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 sm:px-6">
      <nav className="flex items-center justify-between gap-4 border-b border-border/80 py-4">
        <BrandMark />
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:inline">
            Fondasi v0.1
          </span>
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
          >
            Masuk
            <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      <section className="grid gap-12 py-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-24">
        <div className="flex flex-col justify-center">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Sistem pelaporan Satgas
          </p>
          <h1 className="mt-5 max-w-[17ch] text-4xl font-semibold leading-[1.02] tracking-tighter text-balance sm:text-5xl lg:text-6xl">
            Ruang aman untuk melapor.
          </h1>
          <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
            PPKPT menghubungkan pelapor dengan Satgas PPKPT: laporan tercatat,
            akses dibatasi per peran, dan identitas pelapor dapat dijaga.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 active:translate-y-px"
            >
              Masuk ke akun
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/validasi"
              className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-medium transition hover:border-primary/30 hover:bg-accent/50 active:translate-y-px"
            >
              Lihat demo validasi
            </Link>
            <a
              href="https://github.com/mujabar/PPKPT"
              className="inline-flex h-10 items-center gap-1.5 px-1 text-sm text-muted-foreground transition hover:text-foreground"
            >
              Repositori
              <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/80 pt-4 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>Permendikbudristek 55/2024</span>
            <span>Supabase Auth</span>
            <span>Prisma 7</span>
          </div>
        </div>

        <aside className="relative animate-rise [animation-delay:120ms]">
          <div className="border border-border/80 bg-card/60 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Alur penanganan
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-breathe rounded-full bg-primary/60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                </span>
                Fondasi aktif
              </span>
            </div>

            <ol className="mt-6 divide-y divide-border/80 border-y border-border/80">
              {flow.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[auto_1fr] gap-4 py-4"
                >
                  <span className="font-mono text-[10px] text-primary/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid grid-cols-2 gap-px bg-border/70">
              <div className="bg-background px-3 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Akses
                </span>
                <p className="mt-1 text-sm">Berbasis peran</p>
              </div>
              <div className="bg-background px-3 py-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  Database
                </span>
                <p className="mt-1 text-sm">RLS aktif</p>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 -right-3 hidden font-mono text-[7rem] leading-none tracking-tighter text-primary/5 lg:block"
          >
            55
          </div>
        </aside>
      </section>

      <section className="grid gap-8 border-t border-border/80 py-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Yang tersedia
          </p>
          <h2 className="mt-4 max-w-[18ch] text-2xl font-semibold leading-tight tracking-tighter text-balance sm:text-3xl">
            Fondasi yang bisa dipakai hari ini.
          </h2>
          <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
            Bukan mockup. Lapisan di bawah sudah terpasang dan diverifikasi lewat
            lint, typecheck, build, serta smoke test autentikasi.
          </p>
        </div>

        <ul className="divide-y divide-border/80 border-y border-border/80">
          {stack.map((item, index) => (
            <li
              key={item.name}
              className="grid grid-cols-[auto_1fr_auto] items-start gap-4 py-4"
            >
              <span className="pt-0.5 font-mono text-[10px] text-primary/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
              <CheckCircle
                size={18}
                weight="fill"
                className="mt-0.5 text-primary/70"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 border-t border-border/80 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Kriteria selesai
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tighter sm:text-3xl">
            Fondasi yang sudah diuji.
          </h2>

          <ol className="mt-8 border-l border-border/80">
            {checklist.map((item, index) => (
              <li
                key={item}
                className="relative pb-6 pl-6 last:pb-0"
              >
                <span className="absolute -left-[5px] top-1 size-2.5 rounded-full border-2 border-background bg-primary" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-sm">{item}</p>
              </li>
            ))}
          </ol>
        </div>

        <aside className="border-t border-border/80 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck size={16} className="text-primary" />
            Keamanan
          </div>
          <div className="mt-4 divide-y divide-border/80 border-y border-border/80">
            {security.map((item) => (
              <div key={item.title} className="py-3.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <footer className="flex flex-col gap-3 border-t border-border/80 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          PPKPT · Fondasi proyek
        </p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <Link href="/login" className="transition hover:text-foreground">
            Masuk
          </Link>
          <Link href="/validasi" className="transition hover:text-foreground">
            Validasi
          </Link>
          <a
            href="https://github.com/mujabar/PPKPT"
            className="transition hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
