import { Suspense, type ReactNode } from "react";

import { AppHeader } from "./app-header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Suspense fallback={<div className="h-[57px] border-b border-border/80" />}>
        <AppHeader />
      </Suspense>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
