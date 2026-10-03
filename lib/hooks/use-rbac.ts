import { useMemo } from "react";
import {
  canAccessPath,
  getDefaultSettingsPath,
  getTenantRoleLabel,
  hasPermission,
  normalizeTenantRole,
} from "@/lib/rbac/permissions";
import type { NavPermission, TenantRole } from "@/types/rbac";
import { useAuthStore } from "@/store/auth.store";

export function useRbac() {
  const tenantRole = useAuthStore((state) => state.tenant?.role);
  const apiPermissions = useAuthStore((state) => state.tenant?.apiPermissions);

  return useMemo(() => {
    const role = normalizeTenantRole(tenantRole);
    const permissions = apiPermissions ?? [];

    return {
      role,
      roleLabel: role ? getTenantRoleLabel(role) : null,
      hasPermission: (permission: NavPermission) =>
        role ? hasPermission(role, permission) : false,
      canAccessPath: (pathname: string) => (role ? canAccessPath(role, pathname) : false),
      getDefaultSettingsPath: () => (role ? getDefaultSettingsPath(role) : null),
      /** Empty permission list means the role payload has not loaded — keep the control enabled. */
      canPerform: (permission: string) =>
        permissions.length === 0 || permissions.includes(permission),
    };
  }, [apiPermissions, tenantRole]);
}

export function useTenantRole(): TenantRole | null {
  const tenantRole = useAuthStore((state) => state.tenant?.role);
  return normalizeTenantRole(tenantRole);
}
