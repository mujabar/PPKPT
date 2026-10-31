import { z } from "zod";

const supabaseEnvSchema = z.object({
  url: z.url(),
  key: z.string().min(1),
});

export function getSupabaseConfig() {
  const parsed = supabaseEnvSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    throw new Error(
      `Konfigurasi Supabase tidak valid: ${JSON.stringify(fieldErrors)}. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY (atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) di .env.`,
    );
  }

  return parsed.data;
}
