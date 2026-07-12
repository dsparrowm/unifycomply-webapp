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

  return useMemo(() => {
    const role = normalizeTenantRole(tenantRole);

    return {
      role,
      roleLabel: role ? getTenantRoleLabel(role) : null,
      hasPermission: (permission: NavPermission) =>
        role ? hasPermission(role, permission) : false,
      canAccessPath: (pathname: string) => (role ? canAccessPath(role, pathname) : false),
      getDefaultSettingsPath: () => (role ? getDefaultSettingsPath(role) : null),
    };
  }, [tenantRole]);
}

export function useTenantRole(): TenantRole | null {
  const tenantRole = useAuthStore((state) => state.tenant?.role);
  return normalizeTenantRole(tenantRole);
}
