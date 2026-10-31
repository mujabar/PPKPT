import { Suspense } from "react";

import { RoleRowForm } from "@/components/auth/role-row-form";
import {
  AccessList,
  RolePage,
  RolePageFallback,
} from "@/components/shared/role-page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROLE_LABELS } from "@/feature/auth/roles";
import { requireRole } from "@/feature/auth/service";
import { prisma } from "@/lib/prisma";

export default function AdminPage() {
  return (
    <Suspense fallback={<RolePageFallback />}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const profile = await requireRole(["ADMIN"]);

  const users = await prisma.profile.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const total = users.length;
  const active = users.filter((user) => user.isActive).length;
  const rolesUsed = new Set(users.map((user) => user.role)).size;

  const stats = [
    { label: "Total akun", value: total },
    { label: "Akun aktif", value: active },
    { label: "Peran terpakai", value: rolesUsed },
  ];

  return (
    <RolePage
      index="05"
      eyebrow="Administrasi"
      title="Akun dan peran, tanpa isi kasus."
      description="Admin mengelola peran dan status akun. Halaman ini tidak membuka laporan, pemeriksaan, atau keputusan."
      profile={profile}
      aside={
        <AccessList
          title="Prinsip admin"
          items={[
            {
              label: "Peran dari server",
              detail: "Perubahan peran diproses di server, bukan dari metadata pengguna.",
            },
            {
              label: "Akun sendiri dikunci",
              detail: "Admin tidak dapat mengubah perannya sendiri dari halaman ini.",
            },
            {
              label: "Tanpa isi kasus",
              detail: "Admin tidak otomatis mendapat akses ke isi laporan.",
            },
          ]}
        />
      }
    >
      <div className="grid gap-px overflow-hidden border-y border-border/80 bg-border/70 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 bg-background px-4 py-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
              {stat.label}
            </span>
            <span className="font-mono text-2xl tracking-tight">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-sm font-medium">Daftar akun</h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {total} baris
          </span>
        </div>

        <div className="mt-3 border-y border-border/80">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Akun
                </TableHead>
                <TableHead className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Peran
                </TableHead>
                <TableHead className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  Ubah peran
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell className="py-3">
                    <div className="flex min-w-0 flex-col leading-tight">
                      <span className="truncate text-sm font-medium">
                        {user.fullName}
                        {user.id === profile.id ? (
                          <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.16em] text-primary">
                            Anda
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{ROLE_LABELS[user.role]}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      <span
                        className={
                          user.isActive
                            ? "size-1.5 rounded-full bg-primary"
                            : "size-1.5 rounded-full bg-muted-foreground/40"
                        }
                      />
                      {user.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <RoleRowForm
                      profileId={user.id}
                      role={user.role}
                      disabled={user.id === profile.id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 max-w-[62ch] text-xs leading-relaxed text-muted-foreground">
          Peran bawaan akun baru adalah Pelapor. Akun uji dibuat lewat script admin
          (`npm run auth:seed-users`), bukan lewat formulir ini.
        </p>
      </div>
    </RolePage>
  );
}
