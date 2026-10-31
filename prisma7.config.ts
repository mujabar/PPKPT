import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrasi memakai koneksi langsung (DIRECT_URL) agar tidak lewat
    // connection pooler Supabase. Runtime aplikasi memakai DATABASE_URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
