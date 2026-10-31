import Link from "next/link";

import { SubmitButton } from "@/components/shared/submit-button";
import { logoutAction } from "@/feature/auth/actions";
import { ROLE_LABELS } from "@/feature/auth/roles";
import { requireProfile } from "@/feature/auth/service";

export async function AppHeader() {
  const profile = await requireProfile();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
            PPKPT
          </Link>
          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
            {ROLE_LABELS[profile.role]}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <span className="min-w-0 truncate text-xs text-muted-foreground sm:text-sm">
            {profile.fullName} · {profile.email}
          </span>
          <form action={logoutAction}>
            <SubmitButton variant="outline" size="sm" pendingLabel="Keluar...">
              Keluar
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  );
}
