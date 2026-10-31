import "dotenv/config";

import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";

import type { Role } from "../src/generated/prisma/enums";
import { prisma } from "../src/lib/prisma";

type TestUser = {
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
};

const TEST_USERS: TestUser[] = [
  {
    email: "pelapor@ppkpt.test",
    fullName: "Pelapor Uji",
    role: "PELAPOR",
    isActive: true,
  },
  {
    email: "satgas@ppkpt.test",
    fullName: "Anggota Satgas Uji",
    role: "ANGGOTA_SATGAS",
    isActive: true,
  },
  {
    email: "ketua@ppkpt.test",
    fullName: "Ketua Satgas Uji",
    role: "KETUA_SATGAS",
    isActive: true,
  },
  {
    email: "pimpinan@ppkpt.test",
    fullName: "Pimpinan Uji",
    role: "PIMPINAN",
    isActive: true,
  },
  {
    email: "admin@ppkpt.test",
    fullName: "Admin Uji",
    role: "ADMIN",
    isActive: true,
  },
  {
    email: "nonaktif@ppkpt.test",
    fullName: "Akun Nonaktif Uji",
    role: "PELAPOR",
    isActive: false,
  },
];

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} belum diisi. Siapkan nilainya di .env (jangan commit nilainya).`,
    );
  }

  return value;
}

async function findUserByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<User | null> {
  const perPage = 1000;

  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const found = data.users.find(
      (user) => user.email?.toLowerCase() === email,
    );

    if (found) {
      return found;
    }

    if (data.users.length < perPage) {
      return null;
    }
  }
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const password = requireEnv("TEST_USER_PASSWORD");

  if (password.length < 8) {
    throw new Error("TEST_USER_PASSWORD minimal 8 karakter.");
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("Menyiapkan akun uji (password tidak ditampilkan):");

  for (const testUser of TEST_USERS) {
    const email = testUser.email.toLowerCase();
    let user = await findUserByEmail(supabase, email);

    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: testUser.fullName },
      });

      if (error || !data.user) {
        throw new Error(
          `Gagal membuat akun ${email}: ${error?.message ?? "tidak diketahui"}`,
        );
      }

      user = data.user;
    }

    await prisma.profile.upsert({
      where: { id: user.id },
      update: {
        email,
        fullName: testUser.fullName,
        role: testUser.role,
        isActive: testUser.isActive,
      },
      create: {
        id: user.id,
        email,
        fullName: testUser.fullName,
        role: testUser.role,
        isActive: testUser.isActive,
      },
    });

    console.log(
      `- ${email} → ${testUser.role}${testUser.isActive ? "" : " (nonaktif)"}`,
    );
  }

  console.log(
    "Akun uji siap. Kredensial hanya ada di .env lokal dan tidak disimpan di repositori.",
  );
}

main()
  .catch((error: unknown) => {
    console.error("Gagal menyiapkan akun uji.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
