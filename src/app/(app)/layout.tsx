import { Suspense, type ReactNode } from "react";

import { AppHeader } from "@/components/shared/app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Suspense fallback={<div className="h-[57px] border-b border-border/80" />}>
        <AppHeader />
      </Suspense>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
