"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";
import { DeleteRoleConfirmModal } from "@/components/settings/DeleteRoleConfirmModal";
import {
  RoleEditorModal,
  type RoleEditorValues,
} from "@/components/settings/RoleEditorModal";
import { RolePermissionCard } from "@/components/settings/RolePermissionCard";
import { getErrorMessage } from "@/lib/api/errors";
import type { ApiPermissionOption } from "@/lib/api/types";
import type { SettingsRole } from "@/types/settings";

type RolesAndPermissionPanelProps = {
  roles: SettingsRole[];
  permissionOptions: ApiPermissionOption[];
  onCreateRole: (values: RoleEditorValues) => Promise<void>;
  onUpdateRole: (roleId: string, values: RoleEditorValues) => Promise<void>;
  onDeleteRole: (roleId: string) => Promise<void>;
};

export function RolesAndPermissionPanel({
  roles,
  permissionOptions,
  onCreateRole,
  onUpdateRole,
  onDeleteRole,
}: RolesAndPermissionPanelProps) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [editingRole, setEditingRole] = useState<SettingsRole | null>(null);
  const [deletingRole, setDeletingRole] = useState<SettingsRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openCreate = () => {
    setEditorMode("create");
    setEditingRole(null);
    setEditorOpen(true);
  };

  const openEdit = (roleId: string) => {
    const role = roles.find((item) => item.id === roleId) ?? null;
    if (!role) return;
    setEditorMode("edit");
    setEditingRole(role);
    setEditorOpen(true);
  };

  const handleEditorSubmit = async (values: RoleEditorValues) => {
    if (editorMode === "edit" && editingRole) {
      await onUpdateRole(editingRole.id, values);
      return;
    }
    await onCreateRole(values);
  };

  const handleConfirmDelete = async () => {
    if (!deletingRole) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await onDeleteRole(deletingRole.id);
      setDeletingRole(null);
    } catch (error) {
      setDeleteError(getErrorMessage(error, "Could not delete role"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              Role and permission
            </h2>
            <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
              Add, remove, and manage team members and their access levels
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex shrink-0 items-center justify-center rounded-lg border border-[color:var(--accent-primary-hover)] bg-transparent px-4 py-2.5 text-xs font-medium text-[color:var(--accent-primary-hover)] transition-colors hover:bg-[color:var(--accent-primary-soft)]"
          >
            Create a Role
          </button>
        </div>

        {roles.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No roles yet"
            description="Create a role to define permissions for your team."
            action={
              <button
                type="button"
                onClick={openCreate}
                className="rounded-lg border border-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-[color:var(--accent-primary-hover)] hover:bg-[color:var(--accent-primary-soft)]"
              >
                Create a Role
              </button>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {roles.map((role) => (
              <RolePermissionCard
                key={role.id}
                role={role}
                onEdit={openEdit}
                onDelete={(roleId) => {
                  const match = roles.find((item) => item.id === roleId) ?? null;
                  setDeleteError(null);
                  setDeletingRole(match);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <RoleEditorModal
        open={editorOpen}
        mode={editorMode}
        role={editingRole}
        permissionOptions={permissionOptions}
        onClose={() => setEditorOpen(false)}
        onSubmit={handleEditorSubmit}
      />

      <DeleteRoleConfirmModal
        open={deletingRole !== null}
        roleName={deletingRole?.name ?? ""}
        isDeleting={isDeleting}
        error={deleteError}
        onClose={() => {
          if (isDeleting) return;
          setDeletingRole(null);
          setDeleteError(null);
        }}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />
    </>
  );
}
