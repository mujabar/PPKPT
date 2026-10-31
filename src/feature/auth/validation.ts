import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email tidak valid.").max(254, "Email terlalu panjang."),
  password: z
    .string()
    .min(1, "Password wajib diisi.")
    .max(200, "Password terlalu panjang."),
});

export type LoginInput = z.infer<typeof loginSchema>;
