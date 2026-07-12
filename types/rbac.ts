export const TENANT_ROLES = [
  "admin",
  "compliance-officer",
  "compliance-manager",
  "mlro",
  "developer",
  "support",
] as const;

export type TenantRole = (typeof TENANT_ROLES)[number];

export type NavPermission =
  | "nav.overview"
  | "nav.kyc"
  | "nav.kyb"
  | "nav.bank-analysis"
  | "nav.packages"
  | "nav.request"
  | "nav.aml-screening"
  | "nav.transaction-monitoring"
  | "nav.transactions"
  | "nav.tm-not-blocked"
  | "nav.stop-payment"
  | "nav.cumulative-frequency"
  | "nav.tm-blocked"
  | "nav.sar"
  | "nav.pnd-watchlist"
  | "nav.rules"
  | "nav.risk-score"
  | "nav.settings"
  | "nav.billing"
  | "settings.profile"
  | "settings.business-information"
  | "settings.teams"
  | "settings.roles-and-permission"
  | "settings.security"
  | "settings.audit-logs"
  | "settings.approvals"
  | "settings.pep-settings"
  | "settings.notification"
  | "settings.compliance-rules"
  | "settings.api-keys";
