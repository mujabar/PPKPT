# PPKPT — Sistem Pelaporan Satgas

Fondasi proyek untuk aplikasi pelaporan Satgas PPKPT (Permendikbudristek No. 55 Tahun 2024).

Tech stack:

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **PostgreSQL** di **Supabase**
- **Prisma 7** (ORM + migrasi)
- **Supabase Auth** (email + password, sesi cookie via `@supabase/ssr`)
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

Untuk auth, isi juga:

- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (atau
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` untuk key format baru).
- `SUPABASE_SERVICE_ROLE_KEY` — **hanya untuk script admin di server**. Jangan pernah memberi
  prefix `NEXT_PUBLIC_`.
- `TEST_USER_PASSWORD` — password akun uji lokal, minimal 8 karakter. Jangan commit nilainya.

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

## 7. Siapkan Supabase Auth dan akun uji

1. Buka **Authentication → Providers → Email** di dashboard Supabase dan pastikan provider aktif.
2. Registrasi publik belum termasuk cakupan. Sebaiknya matikan **Allow new users to sign up**;
   akun dibuat oleh administrator.
3. Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan key publik sudah terisi, lalu isi
   `TEST_USER_PASSWORD` di `.env`.
4. Buat akun uji untuk setiap peran:

```bash
npm run auth:seed-users
```

| Email | Peran | Status |
| --- | --- | --- |
| `pelapor@ppkpt.test` | `PELAPOR` | Aktif |
| `satgas@ppkpt.test` | `ANGGOTA_SATGAS` | Aktif |
| `ketua@ppkpt.test` | `KETUA_SATGAS` | Aktif |
| `pimpinan@ppkpt.test` | `PIMPINAN` | Aktif |
| `admin@ppkpt.test` | `ADMIN` | Aktif |
| `nonaktif@ppkpt.test` | `PELAPOR` | Nonaktif |

Password semua akun berasal dari `TEST_USER_PASSWORD` di `.env`. Script ini idempotent: user
Supabase yang sudah ada dipakai ulang dan profilnya di-`upsert` berdasarkan `id` auth, tanpa
membuat profil ganda. Password tidak ditampilkan dan tidak disimpan di repositori.

## 8. Jalankan aplikasi

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Halaman awal memakai Tailwind CSS.

## 9. Verifikasi

```bash
# Cek koneksi Prisma + status RLS
npm run db:check

# Simpan + baca ulang data fiktif
npm run db:seed

# Siapkan akun uji
npm run auth:seed-users

# Contoh validasi Zod (lulus + gagal)
npm run validate:check
```

Contoh validasi juga bisa dicoba lewat UI di [http://localhost:3000/validasi](http://localhost:3000/validasi).
Form tersebut memakai Server Action dan `reportSchema`, tetapi **belum menyimpan** data ke database.

Verifikasi auth manual:

1. Login `pelapor@ppkpt.test` → diarahkan ke `/pelapor`; muat ulang halaman, sesi bertahan.
2. Buka `/admin` sebagai pelapor → ditolak dan diarahkan kembali.
3. Logout → kembali ke `/login`; `/admin` tanpa sesi ditolak.
4. Login dengan password salah → pesan `email atau password ada salah`.
5. Login `nonaktif@ppkpt.test` → ditolak dengan pesan akun tidak aktif.

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
| `npm run db:check` | Cek koneksi ke database + status RLS |
| `npm run auth:seed-users` | Buat akun uji untuk setiap peran |
| `npm run validate:check` | Contoh validasi Zod via terminal |

## Struktur proyek

```
.
├── prisma/
│   ├── migrations/            # Riwayat migrasi (termasuk RLS)
│   ├── schema.prisma          # Skema database (domain pelaporan PPKPT)
│   └── seed.ts                # Seed data fiktif + verifikasi baca ulang
├── prisma7.config.ts          # Konfigurasi Prisma CLI (Prisma 7)
├── scripts/
│   ├── check-db.ts            # Cek koneksi database + RLS
│   ├── check-validation.ts    # Contoh validasi Zod
│   └── create-test-users.ts   # Akun uji per peran (Admin API)
├── src/
│   ├── app/
│   │   ├── (auth)/login/      # Halaman login
│   │   ├── (app)/             # Halaman terlindungi per peran
│   │   │   └── pelapor/form-laporan/  # Formulir laporan pelapor
│   │   ├── page.tsx           # Halaman awal publik
│   │   └── validasi/          # Demo validasi Zod
│   ├── components/
│   │   ├── auth/              # AuthPage, LoginForm, RoleRowForm
│   │   ├── form-pelapor/      # FormLaporan + ReportForm
│   │   ├── shared/            # Header, submit button, role page
│   │   └── ui/                # Komponen dasar shadcn/ui
│   ├── feature/
│   │   ├── auth/              # Service, action, validasi, peran
│   │   └── pelapor/           # Validasi, action, service laporan
│   ├── generated/prisma/      # Prisma Client hasil generate (di-ignore Git)
│   ├── lib/
│   │   ├── supabase/          # client, server, proxy, config
│   │   ├── env.ts             # Validasi environment dengan Zod
│   │   ├── prisma.ts          # Singleton Prisma Client
│   │   └── validations/       # Skema validasi Zod
│   └── proxy.ts               # Proxy Next.js 16 (refresh sesi)
├── components.json            # Konfigurasi shadcn/ui
└── .env.example               # Contoh environment tanpa kredensial
```

## Autentikasi & hak akses

- **Sesi** dikelola `@supabase/ssr` lewat cookie. `src/proxy.ts` (konvensi Next.js 16, bukan
  `middleware.ts`) memanggil `supabase.auth.getClaims()` untuk memverifikasi token dan
  menyegarkan sesi pada setiap request ke rute auth.
- **Otorisasi dilakukan ulang di server** pada setiap halaman dan Server Action lewat
  `getSessionProfile` + `requireRole`. Peran selalu dibaca dari tabel `profiles`, bukan dari
  `user_metadata`.
- **Profil** dibuat otomatis saat login pertama dengan `id` = `auth.users.id` (upsert, tanpa
  profil ganda). Peran bawaan `PELAPOR`; perubahan peran hanya lewat admin.
- **Rute per peran**:

| Peran | Rute awal | Batas akses |
| --- | --- | --- |
| `PELAPOR` | `/pelapor` | Area pelapor |
| `ANGGOTA_SATGAS` | `/satgas` | Area Satgas |
| `KETUA_SATGAS` | `/ketua` (+ `/satgas`) | Pengelolaan Satgas |
| `PIMPINAN` | `/pimpinan` | Kasus untuk keputusan |
| `ADMIN` | `/admin` | Akun & peran, tanpa isi kasus |

- **RLS** diaktifkan untuk seluruh tabel di schema `public` lewat migrasi
  `20261031030000_enable_rls`. Hanya `profiles` memiliki policy SELECT milik sendiri; tidak ada
  policy UPDATE/INSERT/DELETE, sehingga peran tidak bisa diubah lewat Supabase Data API.
  Prisma terhubung sebagai role `postgres` (melewati RLS), jadi guard server tetap wajib.
- **Pesan error** login dibuat generik (`email atau password ada salah`) agar tidak membocorkan
  apakah email terdaftar. Akun nonaktif dan profil yang tidak tersedia ditolak dengan pesan
  terpisah.
- **Admin** dapat mengubah peran akun lain di `/admin`. Perubahan peran akun sendiri ditolak,
  dan halaman admin tidak menampilkan data kasus.

## Formulir laporan pelapor

- Halaman: `/pelapor/form-laporan` (hanya untuk akun aktif dengan peran `PELAPOR`).
- Isi: posisi pelapor, tanggal/lokasi/kronologi, jenis kekerasan, terlapor (bisa lebih dari
  satu atau dikosongkan), saksi opsional (bisa lebih dari satu), dan kebutuhan perlindungan.
- Validasi `Zod` dijalankan di server: field wajib, enum yang sah, batas panjang, dan tanggal
  tidak boleh di masa depan. Error tampil di bagian terkait tanpa menghapus isian.
- Pemilik laporan **selalu** diambil dari sesi (`reporterId`), bukan dari formulir. Laporan
  disimpan melalui satu nested write Prisma sehingga laporan, terlapor, saksi, dan riwayat
  status awal (`DITERIMA`) tersimpan bersama.
- Nomor tiket berformat `PPKPT-<tahun>-<6 karakter>` dan unik. Urgensi awal mengikuti default
  skema (`SEDANG`); `needsProtection` disimpan terpisah.
- `clientSubmissionId` (uuid unik) membuat pengiriman idempotent: retry atau double-submit
  mengembalikan tiket yang sama, bukan laporan ganda.
- RLS pada `reports`, `respondents`, `witnesses`, dan `status_history` menutup akses Data API
  untuk pengguna lain. Prisma berjalan sebagai role `postgres`, sehingga pemeriksaan
  `requireRole` dan kepemilikan sesi tetap wajib di server.
- Tidak ada log aplikasi yang menulis kronologi, identitas, atau kontak.

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
| `PrismaClientValidationError` setelah ubah schema | Generate ulang client (`npm run db:generate`) lalu restart dev server agar model baru dimuat. |
| `Konfigurasi environment tidak valid` | `.env` belum diisi atau `DATABASE_URL` bukan URL yang valid. |
| `Konfigurasi Supabase tidak valid` | Isi `NEXT_PUBLIC_SUPABASE_URL` dan anon/publishable key. |
| `email atau password ada salah` | Password akun uji diambil dari `TEST_USER_PASSWORD` saat akun dibuat. Jika lupa, reset lewat dashboard Supabase. |
| `Akun Anda tidak aktif` | Profil dengan `isActive = false` memang ditolak. Aktifkan lewat admin/dashboard. |
| Data API Supabase kosong / 401 | RLS aktif dan tabel selain `profiles` sengaja tanpa policy. Akses data lewat server/Prisma. |
| Timeout saat query | Gunakan connection pooler Supabase (`DATABASE_URL`) untuk runtime aplikasi. |

## Referensi

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js 16 Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Database](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase Auth SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Prisma 7 + PostgreSQL](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
- [shadcn/ui Forms](https://ui.shadcn.com/docs/forms/next)
- [Zod](https://zod.dev)
