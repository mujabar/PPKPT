"use client";

import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "@/feature/auth/actions";

const initialState: LoginState = {
  message: "",
  fieldErrors: {},
};

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
    <Card>
      <CardHeader>
        <CardTitle>Masuk</CardTitle>
        <CardDescription>
          Gunakan email dan password akun Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4" noValidate>
          {message ? (
            <Alert variant={state.message ? "destructive" : "default"}>
              <AlertTitle>Gagal masuk</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          ) : null}

          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nama@gmail.com"
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError ? (
              <p id="email-error" className="text-xs text-destructive">
                {emailError}
              </p>
            ) : null}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? "password-error" : undefined}
            />
            {passwordError ? (
              <p id="password-error" className="text-xs text-destructive">
                {passwordError}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="w-full"
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Akun dibuat oleh administrator. Registrasi publik belum tersedia.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
