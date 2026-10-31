import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.url().optional(),
);

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  DIRECT_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optionalString,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  TEST_USER_PASSWORD: optionalString,
});

export type Env = z.infer<typeof envSchema>;

export function serverEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    throw new Error(
      `Konfigurasi environment tidak valid: ${JSON.stringify(fieldErrors)}`,
    );
  }

  return result.data;
}
