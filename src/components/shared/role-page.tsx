import type { ReactNode } from "react";

import type { Role } from "@/generated/prisma/enums";
import { ROLE_LABELS } from "@/feature/auth/roles";
import { cn } from "@/lib/utils";

type RolePageProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  profile: {
    fullName: string;
    email: string;
    role: Role;
    unit: string | null;
  };
  children: ReactNode;
  aside?: ReactNode;
};

export function RolePage({
  index,
  eyebrow,
  title,
  description,
  profile,
  children,
  aside,
}: RolePageProps) {
  const details = [
    { label: "Nama", value: profile.fullName },
    { label: "Email", value: profile.email },
    { label: "Peran", value: ROLE_LABELS[profile.role] },
    { label: "Unit", value: profile.unit ?? "Belum diisi" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:gap-12 lg:py-14">
      <header className="grid animate-rise gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="text-primary">{index}</span>
            <span className="h-px w-8 bg-border" />
            <span>{eyebrow}</span>
          </div>
          <h1 className="mt-5 max-w-[24ch] text-3xl font-semibold leading-[1.05] tracking-tighter text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-breathe rounded-full bg-primary/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
          </span>
          Sesi aktif
        </div>
      </header>

      <section className="grid animate-rise gap-px overflow-hidden border-y border-border/80 bg-border/70 [animation-delay:80ms] sm:grid-cols-2 lg:grid-cols-4">
        {details.map((detail) => (
          <div
            key={detail.label}
            className="flex min-w-0 flex-col gap-1.5 bg-background px-4 py-4 sm:px-5"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              {detail.label}
            </span>
            <span className="truncate text-sm font-medium">{detail.value}</span>
          </div>
        ))}
      </section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-14">
        <div className="min-w-0 animate-rise [animation-delay:140ms]">
          {children}
        </div>

        {aside ? (
          <aside className="animate-rise border-t border-border/80 pt-6 [animation-delay:200ms] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {aside}
          </aside>
        ) : null}
      </div>
    </main>
  );
}

export function EmptyArea({
  icon,
  title,
  description,
  meta,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  meta?: string;
}) {
  return (
    <div className="border border-dashed border-border/90 bg-muted/15 px-6 py-10 sm:px-8">
      <div className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-accent text-primary">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-medium tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {meta ? (
        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          {meta}
        </p>
      ) : null}
    </div>
  );
}

export function AccessList({
  title,
  items,
}: {
  title: string;
  items: { label: string; detail: string }[];
}) {
  return (
    <div>
      <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h2>
      <ul className="mt-4 divide-y divide-border/80 border-y border-border/80">
        {items.map((item, index) => (
          <li
            key={item.label}
            className={cn("grid grid-cols-[auto_1fr] gap-3 py-3.5")}
          >
            <span className="font-mono text-[10px] text-primary/70">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RolePageFallback() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-col gap-3">
        <div className="h-3 w-36 animate-pulse rounded bg-muted" />
        <div className="h-9 w-72 max-w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded bg-muted" />
      </div>
      <div className="h-20 animate-pulse border-y border-border/80 bg-muted/30" />
      <div className="grid gap-10 lg:grid-cols-[1.55fr_1fr]">
        <div className="h-56 animate-pulse border border-dashed border-border/80 bg-muted/20" />
        <div className="h-40 animate-pulse border-t border-border/80 bg-muted/20 lg:border-l lg:border-t-0" />
      </div>
    </main>
  );
}
