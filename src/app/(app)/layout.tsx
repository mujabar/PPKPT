import { Suspense, type ReactNode } from "react";

import { AppHeader } from "@/components/shared/app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Suspense fallback={<div className="h-14 border-b" />}>
        <AppHeader />
      </Suspense>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
