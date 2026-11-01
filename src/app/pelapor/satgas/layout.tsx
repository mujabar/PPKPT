import { AppShell } from "@/components/shared/app-shell";

export default function SatgasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
