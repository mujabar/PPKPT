import { SignOut } from "@phosphor-icons/react/dist/ssr";

import { BrandMark } from "@/components/shared/brand-mark";
import { SubmitButton } from "@/components/shared/submit-button";
import { logoutAction } from "@/feature/auth/actions";
import { ROLE_LABELS } from "@/feature/auth/roles";
import { requireProfile } from "@/feature/auth/service";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export async function AppHeader() {
  const profile = await requireProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <BrandMark compact />
          <span className="hidden h-5 w-px bg-border sm:block" />
          <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-breathe rounded-full bg-primary/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            <span className="max-w-[9rem] truncate">
              {ROLE_LABELS[profile.role]}
            </span>
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="hidden min-w-0 flex-col items-end leading-tight sm:flex">
            <span className="max-w-[18rem] truncate text-xs font-medium">
              {profile.fullName}
            </span>
            <span className="max-w-[18rem] truncate font-mono text-[10px] text-muted-foreground">
              {profile.email}
            </span>
          </div>

          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full border border-primary/15 bg-accent font-mono text-[10px] font-medium uppercase text-accent-foreground"
          >
            {initials(profile.fullName)}
          </span>

          <form action={logoutAction}>
            <SubmitButton
              variant="ghost"
              size="sm"
              pendingLabel="Keluar..."
              className="gap-2"
            >
              <SignOut size={15} />
              <span className="hidden sm:inline">Keluar</span>
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  );
}
