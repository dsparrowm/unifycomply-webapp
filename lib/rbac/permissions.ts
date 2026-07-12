import { settingsNavGroups } from "@/lib/constants/settings-nav";
import { isPathEnabledForCurrentMilestone } from "@/lib/constants/navigation";
import type { NavPermission, TenantRole } from "@/types/rbac";

const ALL_PERMISSIONS: NavPermission[] = [
  "nav.overview",
  "nav.kyc",
  "nav.kyb",
  "nav.bank-analysis",
  "nav.packages",
  "nav.request",
  "nav.aml-screening",
  "nav.transaction-monitoring",
  "nav.transactions",
  "nav.tm-not-blocked",
  "nav.stop-payment",
  "nav.cumulative-frequency",
  "nav.tm-blocked",
  "nav.sar",
  "nav.pnd-watchlist",
  "nav.rules",
  "nav.risk-score",
  "nav.settings",
  "nav.billing",
  "settings.profile",
  "settings.business-information",
  "settings.teams",
  "settings.roles-and-permission",
  "settings.security",
  "settings.audit-logs",
  "settings.approvals",
  "settings.pep-settings",
  "settings.notification",
  "settings.compliance-rules",
  "settings.api-keys",
];

const CUSTOMER_OPERATIONS: NavPermission[] = [
  "nav.overview",
  "nav.kyc",
  "nav.kyb",
  "nav.bank-analysis",
  "nav.packages",
  "nav.request",
  "nav.aml-screening",
];

const COMPLIANCE_CONFIGURATION: NavPermission[] = [
  "settings.approvals",
  "settings.pep-settings",
  "settings.notification",
  "settings.compliance-rules",
];

const TRANSACTION_MONITORING: NavPermission[] = [
  "nav.transaction-monitoring",
  "nav.transactions",
  "nav.tm-not-blocked",
  "nav.stop-payment",
  "nav.cumulative-frequency",
  "nav.tm-blocked",
];

const REGULATORY_REPORTING: NavPermission[] = [
  "nav.sar",
  "nav.pnd-watchlist",
  "nav.rules",
  "nav.risk-score",
];

export const TENANT_ROLE_LABELS: Record<TenantRole, string> = {
  admin: "Admin",
  "compliance-officer": "Compliance Officer",
  "compliance-manager": "Compliance Manager",
  mlro: "MLRO",
  developer: "Developer",
  support: "Support",
};

const ROLE_ALIASES: Record<string, TenantRole> = {
  admin: "admin",
  "compliance officer": "compliance-officer",
  "compliance-officer": "compliance-officer",
  "compliance manager": "compliance-manager",
  "compliance-manager": "compliance-manager",
  mlro: "mlro",
  developer: "developer",
  support: "support",
};

export const ROLE_PERMISSIONS: Record<TenantRole, readonly NavPermission[]> = {
  admin: ALL_PERMISSIONS,
  "compliance-manager": [
    ...CUSTOMER_OPERATIONS,
    "nav.settings",
    "nav.billing",
    "settings.profile",
    "settings.business-information",
    "settings.teams",
    "settings.security",
    "settings.audit-logs",
    ...COMPLIANCE_CONFIGURATION,
  ],
  "compliance-officer": [
    "nav.overview",
    ...CUSTOMER_OPERATIONS.filter((permission) => permission !== "nav.overview"),
    "nav.settings",
    "settings.profile",
    "settings.security",
  ],
  mlro: [
    "nav.overview",
    ...CUSTOMER_OPERATIONS.filter((permission) => permission !== "nav.overview"),
    ...TRANSACTION_MONITORING,
    ...REGULATORY_REPORTING,
    "nav.settings",
    "settings.profile",
    "settings.security",
    "settings.audit-logs",
    ...COMPLIANCE_CONFIGURATION,
  ],
  developer: [
    "nav.overview",
    "nav.settings",
    "settings.profile",
    "settings.security",
    "settings.notification",
    "settings.api-keys",
  ],
  support: [
    "nav.overview",
    "nav.kyc",
    "nav.kyb",
    "nav.settings",
    "settings.profile",
    "settings.security",
    "settings.teams",
    "settings.audit-logs",
  ],
};

const ROUTE_PERMISSION_ENTRIES: Array<{ path: string; permission: NavPermission }> = [
  { path: "/overview", permission: "nav.overview" },
  { path: "/kyc", permission: "nav.kyc" },
  { path: "/kyb", permission: "nav.kyb" },
  { path: "/bank-analysis", permission: "nav.bank-analysis" },
  { path: "/packages", permission: "nav.packages" },
  { path: "/request", permission: "nav.request" },
  { path: "/aml-screening", permission: "nav.aml-screening" },
  { path: "/transaction-monitoring", permission: "nav.transaction-monitoring" },
  { path: "/transactions", permission: "nav.transactions" },
  { path: "/tm-not-blocked", permission: "nav.tm-not-blocked" },
  { path: "/stop-payment", permission: "nav.stop-payment" },
  { path: "/cumulative-frequency", permission: "nav.cumulative-frequency" },
  { path: "/tm-blocked", permission: "nav.tm-blocked" },
  { path: "/sar", permission: "nav.sar" },
  { path: "/pnd-watchlist", permission: "nav.pnd-watchlist" },
  { path: "/rules", permission: "nav.rules" },
  { path: "/risk-score", permission: "nav.risk-score" },
  { path: "/billing", permission: "nav.billing" },
  { path: "/settings/api-keys", permission: "settings.api-keys" },
  { path: "/settings/business-information", permission: "settings.business-information" },
  { path: "/settings/teams", permission: "settings.teams" },
  { path: "/settings/roles-and-permission", permission: "settings.roles-and-permission" },
  { path: "/settings/security", permission: "settings.security" },
  { path: "/settings/audit-logs", permission: "settings.audit-logs" },
  { path: "/settings/approvals", permission: "settings.approvals" },
  { path: "/settings/pep-settings", permission: "settings.pep-settings" },
  { path: "/settings/notification", permission: "settings.notification" },
  { path: "/settings/compliance-rules", permission: "settings.compliance-rules" },
  { path: "/settings", permission: "settings.profile" },
];

export function normalizeTenantRole(role: string | null | undefined): TenantRole | null {
  if (!role) {
    return null;
  }

  const normalized = role.trim().toLowerCase();
  return ROLE_ALIASES[normalized] ?? null;
}

export function getTenantRoleLabel(role: TenantRole): string {
  return TENANT_ROLE_LABELS[role];
}

export function hasPermission(role: TenantRole, permission: NavPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getPermissionForPath(pathname: string): NavPermission | null {
  const match = ROUTE_PERMISSION_ENTRIES.find(
    (entry) => pathname === entry.path || pathname.startsWith(`${entry.path}/`),
  );

  if (match) {
    return match.permission;
  }

  if (pathname.startsWith("/settings/")) {
    return "nav.settings";
  }

  return null;
}

export function canAccessPath(role: TenantRole, pathname: string): boolean {
  if (!isPathEnabledForCurrentMilestone(pathname)) {
    return false;
  }

  const permission = getPermissionForPath(pathname);

  if (!permission) {
    return true;
  }

  if (permission.startsWith("settings.") && !hasPermission(role, permission)) {
    return false;
  }

  if (permission.startsWith("nav.") && !hasPermission(role, permission)) {
    return false;
  }

  if (pathname.startsWith("/settings") && !hasPermission(role, "nav.settings")) {
    return false;
  }

  return true;
}

export function getDefaultSettingsPath(role: TenantRole): string | null {
  for (const group of settingsNavGroups) {
    for (const item of group.items) {
      if (hasPermission(role, item.permission)) {
        return item.href;
      }
    }
  }

  return null;
}
