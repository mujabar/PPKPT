import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "./login-form";

function LoginCardSkeleton() {
  return <div className="h-80 animate-pulse rounded-xl bg-muted" />;
}

export function AuthPage() {
  return (
    <main className="flex min-h-screen flex-1 items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col gap-1">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            PPKPT
          </Link>
          <p className="text-xs text-muted-foreground">
            Sistem Pelaporan Satgas PPKPT
          </p>
        </div>

        <Suspense fallback={<LoginCardSkeleton />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
