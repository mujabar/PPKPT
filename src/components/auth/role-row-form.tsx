"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/generated/prisma/enums";
import {
  updateProfileRoleAction,
  type RoleUpdateState,
} from "@/feature/auth/admin-actions";
import { ROLE_LABELS } from "@/feature/auth/roles";

const initialState: RoleUpdateState = { status: "idle", message: "" };

type RoleRowFormProps = {
  profileId: string;
  role: Role;
  disabled?: boolean;
};

export function RoleRowForm({ profileId, role, disabled }: RoleRowFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfileRoleAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <input type="hidden" name="profileId" value={profileId} />
        <Select name="role" defaultValue={role} disabled={disabled}>
          <SelectTrigger size="sm" aria-label="Pilih peran pengguna">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={pending || disabled}
        >
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      {state.message ? (
        <p
          className={
            state.status === "error"
              ? "text-xs text-destructive"
              : "text-xs text-muted-foreground"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
