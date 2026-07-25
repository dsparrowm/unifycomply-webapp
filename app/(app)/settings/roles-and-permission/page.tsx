"use client";

import { RolesAndPermissionPanel } from "@/components/settings/RolesAndPermissionPanel";
import { SettingsQueryGate } from "@/components/settings/SettingsQueryGate";
import {
  useCreateRole,
  useDeleteRole,
  useRolePermissionOptions,
  useSettingsRoles,
  useUpdateRole,
} from "@/lib/hooks/use-settings";
import { runAction } from "@/lib/toast";

export default function RolesAndPermissionPage() {
  const rolesQuery = useSettingsRoles();
  const optionsQuery = useRolePermissionOptions();
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  const deleteRole = useDeleteRole();

  const isLoading = rolesQuery.isLoading || optionsQuery.isLoading;
  const isError = rolesQuery.isError || optionsQuery.isError;
  const error = rolesQuery.error ?? optionsQuery.error;

  return (
    <SettingsQueryGate
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={() => {
        void rolesQuery.refetch();
        void optionsQuery.refetch();
      }}
    >
      <RolesAndPermissionPanel
        roles={rolesQuery.data ?? []}
        permissionOptions={optionsQuery.data ?? []}
        onCreateRole={async (values) => {
          await runAction(() => createRole.mutateAsync(values), {
            success: "Role created",
            error: "Could not create role",
          });
        }}
        onUpdateRole={async (roleId, values) => {
          await runAction(() => updateRole.mutateAsync({ roleId, body: values }), {
            success: "Role updated",
            error: "Could not update role",
          });
        }}
        onDeleteRole={async (roleId) => {
          await runAction(() => deleteRole.mutateAsync(roleId), {
            success: "Role deleted",
            error: "Could not delete role",
          });
        }}
      />
    </SettingsQueryGate>
  );
}
