import Link from "next/link";

const stack = [
  {
    name: "Next.js 16",
    detail: "App Router + TypeScript + Server Actions",
  },
  {
    name: "Tailwind CSS 4",
    detail: "Styling utilitas, sudah aktif di halaman ini",
  },
  {
    name: "Supabase PostgreSQL",
    detail: "Database Postgres terkelola",
  },
  {
    name: "Prisma 7",
    detail: "ORM + migrasi, skema domain PPKPT sudah tersedia",
  },
  {
    name: "Zod 4",
    detail: "Validasi input, contoh ada di halaman /validasi",
  },
];

const checklist = [
  "Aplikasi dapat dijalankan tanpa error.",
  "Tailwind CSS dapat digunakan pada halaman awal.",
  "Prisma siap terhubung ke database Supabase.",
  "Contoh validasi sederhana dengan Zod berjalan.",
  "Panduan setup tersedia di README.md.",
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-4">
        <span className="w-fit rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Fondasi proyek
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          PPKPT
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Sistem Pelaporan Satgas PPKPT. Fondasi teknologi sudah disiapkan: Next.js App Router,
          TypeScript, Tailwind CSS, Prisma, PostgreSQL Supabase, dan Zod.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Masuk
          </Link>
          <Link
            href="/validasi"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Coba validasi Zod
          </Link>
          <a
            href="https://github.com/mujabar/PPKPT"
            className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Repository GitHub
          </a>
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Tech stack</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {stack.map((item) => (
            <li
              key={item.name}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.name}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Kriteria selesai
        </h2>
        <ul className="flex flex-col gap-2">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300"
            >
              <span
                aria-hidden
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >
                &#10003;
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Koneksi database perlu diverifikasi setelah kredensial Supabase diisi: jalankan{" "}
          <code className="font-mono">npm run db:check</code>.
        </p>
      </section>
    </main>
  );
}
