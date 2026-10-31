import { Suspense } from "react";

import { RoleRowForm } from "@/components/auth/role-row-form";
import { RolePage, RolePageFallback } from "@/components/shared/role-page";
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

  return (
    <RolePage
      title="Administrasi akun"
      description="Kelola peran akun dan status keaktifan. Halaman ini tidak membuka isi kasus."
      profile={profile}
    >
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ubah peran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.fullName}
                  {user.id === profile.id ? " (Anda)" : ""}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>{ROLE_LABELS[user.role]}</TableCell>
                <TableCell>
                  {user.isActive ? "Aktif" : "Nonaktif"}
                </TableCell>
                <TableCell>
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

      <p className="text-xs text-muted-foreground">
        Peran bawaan akun baru adalah Pelapor. Akun uji dibuat lewat script
        admin (`npm run auth:seed-users`), bukan lewat formulir ini. Admin tidak
        dapat mengubah perannya sendiri dari halaman ini.
      </p>
    </RolePage>
  );
}
