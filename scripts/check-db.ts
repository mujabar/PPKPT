import "dotenv/config";

async function main() {
  const { serverEnv } = await import("../src/lib/env");
  serverEnv();

  const { prisma } = await import("../src/lib/prisma");

  try {
    const [database] = await prisma.$queryRaw<{ version: string }[]>`
      SELECT version()
    `;

    const tables = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log("Koneksi Prisma ke PostgreSQL berhasil.");
    console.log(`- Server : ${database.version.split(",")[0]}`);
    console.log(
      `- Tabel  : ${
        tables.length > 0
          ? tables.map((table) => table.table_name).join(", ")
          : "(belum ada, jalankan npm run db:migrate)"
      }`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  if (error instanceof Error && error.message.startsWith("Konfigurasi environment")) {
    console.error(
      "Environment belum dikonfigurasi. Salin .env.example menjadi .env, lalu isi DATABASE_URL dan DIRECT_URL.",
    );
  } else {
    console.error("Gagal terhubung ke database.");
    console.error(error);
  }

  process.exitCode = 1;
});
