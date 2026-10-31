import { LockKey, ShieldCheck, UsersThree } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Suspense } from "react";

import { BrandMark } from "@/components/shared/brand-mark";
import { LoginForm } from "./login-form";

const points = [
  {
    icon: <LockKey size={18} weight="duotone" />,
    title: "Akses sesuai peran",
    detail: "Ruang pelapor, Satgas, pimpinan, dan admin dipisahkan.",
  },
  {
    icon: <UsersThree size={18} weight="duotone" />,
    title: "Satu akun, satu profil",
    detail: "Peran dibaca dari database, bukan dari data yang bisa diubah pengguna.",
  },
  {
    icon: <ShieldCheck size={18} weight="duotone" />,
    title: "Sesi terkendali",
    detail: "Logout menghapus sesi dan menutup halaman terlindungi.",
  },
];

function LoginFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      <div className="h-9 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="mt-4 h-24 animate-pulse rounded-lg bg-muted" />
      <div className="h-24 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function AuthPage() {
  return (
    <main className="min-h-[100dvh] bg-background lg:grid lg:grid-cols-[1.02fr_1fr]">
      <section className="relative hidden overflow-hidden bg-[oklch(0.26_0.035_175)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-1/4 size-[34rem] animate-drift rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_65%)]" />
          <div className="absolute inset-y-0 left-[18%] w-px bg-white/10" />
          <div className="absolute inset-y-0 left-[62%] w-px bg-white/10" />
          <div className="absolute -bottom-40 -left-24 size-[30rem] rounded-full border border-white/10" />
          <div className="absolute -bottom-52 -left-36 size-[42rem] rounded-full border border-white/[0.07]" />
        </div>

        <BrandMark href="/" inverted />

        <div className="relative max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/50">
            Akses terbatas
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tighter text-balance xl:text-5xl">
            Satu pintu, batas akses yang jelas.
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/65">
            Masuk dengan akun yang dibuat administrator. Peran Anda menentukan
            ruang kerja yang bisa dibuka.
          </p>

          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {points.map((point) => (
              <li
                key={point.title}
                className="grid grid-cols-[auto_1fr] gap-4 py-4"
              >
                <span className="mt-0.5 text-white/55">{point.icon}</span>
                <div>
                  <p className="text-sm font-medium text-white">{point.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/55">
                    {point.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">
          Permendikbudristek No. 55 Tahun 2024
        </p>
      </section>

      <section className="flex min-h-[100dvh] flex-col justify-center px-5 py-10 sm:px-8 lg:min-h-0 lg:px-12 xl:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <BrandMark href="/" />
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
            >
              Beranda
            </Link>
          </div>

          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
