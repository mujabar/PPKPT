import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Role } from "@/generated/prisma/enums";
import { ROLE_LABELS } from "@/feature/auth/roles";

type RolePageProps = {
  title: string;
  description: string;
  profile: {
    fullName: string;
    email: string;
    role: Role;
    unit: string | null;
  };
  children?: ReactNode;
};

export function RolePage({
  title,
  description,
  profile,
  children,
}: RolePageProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{profile.fullName}</CardTitle>
          <CardDescription>
            {ROLE_LABELS[profile.role]} · {profile.email}
          </CardDescription>
        </CardHeader>
        {profile.unit ? (
          <CardContent className="text-sm text-muted-foreground">
            Unit: {profile.unit}
          </CardContent>
        ) : null}
      </Card>

      {children}
    </main>
  );
}

export function RolePageFallback() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-2">
        <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="h-28 animate-pulse rounded-xl bg-muted" />
    </main>
  );
}
