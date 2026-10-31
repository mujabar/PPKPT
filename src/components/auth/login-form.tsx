"use client";

import { ArrowRight, WarningCircle } from "@phosphor-icons/react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "@/feature/auth/actions";

const initialState: LoginState = {
  message: "",
  fieldErrors: {},
};

const inputClass =
  "h-10 rounded-lg border-input bg-card px-3 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const searchParams = useSearchParams();

  const sessionMessage =
    searchParams.get("error") === "sesi"
      ? "Sesi berakhir atau profil tidak tersedia. Silakan masuk kembali."
      : "";

  const message = state.message || sessionMessage;
  const emailError = state.fieldErrors.email?.join(" ");
  const passwordError = state.fieldErrors.password?.join(" ");

  return (
    <div className="animate-rise">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
          01 / Kredensial
        </p>
        <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tighter text-balance">
          Masuk ke akun Anda
        </h2>
        <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
          Gunakan email dan password yang diberikan administrator Satgas.
        </p>
      </div>

      <form action={formAction} className="mt-8 grid gap-5" noValidate>
        <div aria-live="polite">
          {message ? (
            <div
              role="alert"
              className="flex items-start gap-3 border-l-2 border-destructive bg-destructive/5 px-4 py-3"
            >
              <WarningCircle
                size={17}
                weight="fill"
                className="mt-0.5 shrink-0 text-destructive"
              />
              <span className="text-sm leading-relaxed text-destructive">
                {message}
              </span>
            </div>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-xs font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            placeholder="nama@gmail.com"
            className={inputClass}
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError ? (
            <p
              id="email-error"
              className="flex items-center gap-1.5 text-xs text-destructive"
            >
              <WarningCircle size={13} weight="fill" aria-hidden />
              {emailError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Gunakan email akun kampus atau email yang terdaftar.
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-xs font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "password-error" : undefined}
          />
          {passwordError ? (
            <p
              id="password-error"
              className="flex items-center gap-1.5 text-xs text-destructive"
            >
              <WarningCircle size={13} weight="fill" aria-hidden />
              {passwordError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Password dikelola Supabase Auth, tidak disimpan di profil.
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="mt-2 h-10 w-full gap-2 rounded-lg"
        >
          {pending ? (
            <>
              <span
                aria-hidden
                className="size-1.5 animate-pulse rounded-full bg-primary-foreground"
              />
              Memeriksa kredensial...
            </>
          ) : (
            <>
              Masuk
              <ArrowRight size={16} />
            </>
          )}
        </Button>

        <div className="mt-2 border-t border-border/80 pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Akun dibuat oleh administrator. Registrasi publik belum tersedia.
            Butuh akses? Hubungi Satgas PPKPT kampus Anda.
          </p>
        </div>
      </form>
    </div>
  );
}
