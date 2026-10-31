# PPKPT — Sistem Pelaporan Satgas

Fondasi proyek untuk aplikasi pelaporan Satgas PPKPT (Permendikbudristek No. 55 Tahun 2024).

Tech stack:

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **PostgreSQL** di **Supabase**
- **Prisma 7** (ORM + migrasi)
- **Zod 4** (validasi data)

## Prasyarat

- **Node.js 20.19+** (disarankan 22 atau 24)
- **npm** (sudah termasuk bersama Node.js)
- Akun **Supabase** (gratis)
- Git

## 1. Install dependency

```bash
npm install
```

> Jika environment memaksa `NODE_ENV=production`, jalankan
> `npm install --include=dev` agar dependency development ikut terpasang.

## 2. Siapkan database Supabase

1. Buka [supabase.com](https://supabase.com), buat project baru, dan simpan **database password**.
2. Buka **Project Settings → Database → Connection string** (atau tombol **Connect**).
3. Ambil dua connection string:
   - **Connection pooling / Transaction pooler** (port `6543`) → untuk `DATABASE_URL`.
   - **Direct connection** (port `5432`) → untuk `DIRECT_URL` (dipakai migrasi Prisma).

## 3. Konfigurasi environment

```bash
cp .env.example .env
```

Buka `.env`, lalu ganti placeholder pada `DATABASE_URL` dan `DIRECT_URL` dengan connection
string dari Supabase. `.env` sudah di-ignore Git; yang ikut ter-commit hanya `.env.example`
tanpa kredensial. Cek dengan `git check-ignore -v .env`.

Variabel lain (`NEXT_PUBLIC_SUPABASE_URL`, dst.) opsional untuk sekarang dan baru dipakai saat
fitur auth/storage ditambahkan.

## 4. Generate Prisma Client

```bash
npm run db:generate
```

Client dibuat di `src/generated/prisma` (folder ini di-ignore Git dan dibuat ulang oleh perintah
di atas).

## 5. Terapkan skema database

```bash
npm run db:deploy
```

Perintah ini menjalankan migrasi yang sudah tersedia di `prisma/migrations` sehingga semua enum
dan tabel dibuat sesuai `prisma/schema.prisma`.

Saat mengubah `schema.prisma`, buat migrasi baru lalu generate ulang client:

```bash
npm run db:migrate -- --name tambah_fitur
npm run db:generate
```

Alternatif cepat tanpa riwayat migrasi (hanya untuk eksperimen awal):

```bash
npm run db:push
```

## 6. Isi data contoh (seed)

```bash
npm run db:seed
```

Seed membuat **satu laporan fiktif** bertanda `PPKPT-2026-DEMO01`, lalu membacanya kembali dan
mencocokkan 9 nilai (id, ticketCode, peran pelapor, bentuk kekerasan, tanggal, lokasi, kronologi,
urgensi, anonim). Perintah ini idempotent — aman dijalankan berulang karena memakai `upsert`.
Tidak ada data pribadi nyata di dalamnya.

## 7. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Halaman awal memakai Tailwind CSS.

## 8. Verifikasi

```bash
# Cek koneksi Prisma ke Supabase
npm run db:check

# Simpan + baca ulang data fiktif
npm run db:seed

# Contoh validasi Zod (lulus + gagal)
npm run validate:check
```

Contoh validasi juga bisa dicoba lewat UI di [http://localhost:3000/validasi](http://localhost:3000/validasi).
Form tersebut memakai Server Action dan `reportSchema`, tetapi **belum menyimpan** data ke database.

## Script npm

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build production |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Buat dan jalankan migrasi baru |
| `npm run db:deploy` | Jalankan migrasi yang sudah ada (CI/production) |
| `npm run db:seed` | Simpan dan verifikasi data laporan fiktif |
| `npm run db:push` | Sinkronkan schema tanpa file migrasi |
| `npm run db:studio` | Buka Prisma Studio |
| `npm run db:check` | Cek koneksi ke database |
| `npm run validate:check` | Contoh validasi Zod via terminal |

## Struktur proyek

```
.
├── prisma/
│   ├── migrations/            # Riwayat migrasi database
│   ├── schema.prisma          # Skema database (domain pelaporan PPKPT)
│   └── seed.ts                # Seed data fiktif + verifikasi baca ulang
├── prisma7.config.ts          # Konfigurasi Prisma CLI (Prisma 7)
├── scripts/
│   ├── check-db.ts            # Cek koneksi database
│   └── check-validation.ts    # Contoh validasi Zod
├── src/
│   ├── app/                   # Halaman dan Server Action (App Router)
│   │   ├── page.tsx           # Halaman awal
│   │   └── validasi/          # Demo validasi Zod
│   ├── generated/prisma/      # Prisma Client hasil generate (di-ignore Git)
│   └── lib/
│       ├── env.ts             # Validasi environment dengan Zod
│       ├── prisma.ts          # Singleton Prisma Client
│       └── validations/       # Skema validasi Zod
└── .env.example               # Contoh environment tanpa kredensial
```

## Catatan teknis

- **Prisma 7** memakai `prisma7.config.ts` untuk konfigurasi CLI dan **driver adapter**
  (`@prisma/adapter-pg`) saat membuat koneksi. Koneksi runtime memakai `DATABASE_URL`
  (pooler), sedangkan migrasi memakai `DIRECT_URL`.
- Client Prisma di-generate ke `src/generated/prisma`, bukan `node_modules`.
- Environment variable **tidak** dimuat otomatis oleh Prisma 7; `prisma7.config.ts` memuatnya
  lewat `dotenv`. Next.js sudah memuat `.env` secara otomatis untuk aplikasi.
- Skema domain (profil, laporan, pemeriksaan, keputusan, pemulihan, audit) ada di
  `prisma/schema.prisma`.

## Troubleshooting

| Masalah | Solusi |
| --- | --- |
| `P1001` / `ENOTFOUND` | Host atau region di connection string salah. Salin ulang dari dashboard Supabase. |
| `Authentication failed` | Password salah. Karakter khusus pada password harus di-URL-encode (mis. `@` → `%40`). |
| Migrasi gagal lewat pooler | Pastikan `DIRECT_URL` memakai port `5432`, bukan `6543`. |
| `PrismaClient did not initialize` | Jalankan `npm run db:generate`, lalu restart dev server. |
| `Konfigurasi environment tidak valid` | `.env` belum diisi atau `DATABASE_URL` bukan URL yang valid. |
| Timeout saat query | Gunakan connection pooler Supabase (`DATABASE_URL`) untuk runtime aplikasi. |

## Referensi

- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Database](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Prisma 7 + PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
- [Zod](https://zod.dev)
