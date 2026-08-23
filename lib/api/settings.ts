import { apiFetch } from "@/lib/api/client";
import type {
  ApiApiKey,
  ApiBusinessInformation,
  ApiComplianceRules,
  ApiEmployeeCount,
  ApiLabelValue,
  ApiMfaSetup,
  ApiMfaStatus,
  ApiNotificationPreferences,
  ApiPepTier,
  ApiPermissionOption,
  ApiRiskFactor,
  ApiRiskScoreThreshold,
  ApiTeamMember,
  ApiTenantRole,
  ApiUserProfile,
  CreateTenantTeamInviteDto,
  DomainSwitchDto,
  UpdateTenantBusinessInformationDto,
  UpdateUserProfileDto,
} from "@/lib/api/types";

export function getUserProfile() {
  return apiFetch<ApiUserProfile>("/api/v1/users/me/profiles");
}

export function updateUserProfile(body: UpdateUserProfileDto) {
  return apiFetch<ApiUserProfile>("/api/v1/users/me/profiles", { method: "PUT", body });
}

export function getBusinessInformation() {
  return apiFetch<ApiBusinessInformation>("/api/v1/tenants/settings/business-information");
}

export function updateBusinessInformation(body: UpdateTenantBusinessInformationDto) {
  return apiFetch<ApiBusinessInformation>("/api/v1/tenants/settings/business-information", {
    method: "PUT",
    body,
  });
}

export function getBusinessIndustries() {
  return apiFetch<ApiLabelValue[]>("/api/v1/public/misc/business-industries");
}

export function getEmployeeCounts() {
  return apiFetch<ApiEmployeeCount[]>("/api/v1/public/misc/employee-counts");
}

export function getTeams() {
  return apiFetch<ApiTeamMember[]>("/api/v1/tenants/settings/teams").then((data) =>
    Array.isArray(data) ? data : [],
  );
}

export function createTeamInvite(body: CreateTenantTeamInviteDto) {
  return apiFetch("/api/v1/tenants/settings/teams", { method: "POST", body });
}

export function resendTeamInvite(id: string) {
  return apiFetch("/api/v1/tenants/settings/teams/resend", { method: "POST", body: { id } });
}

export function revokeTeamInvite(inviteId: string) {
  return apiFetch(`/api/v1/tenants/settings/teams/${inviteId}/revoke`, { method: "DELETE" });
}

export function getRolesPermissions() {
  return apiFetch<ApiTenantRole[]>("/api/v1/tenants/settings/roles-permissions");
}

export function getRolePermissionOptions() {
  return apiFetch<ApiPermissionOption[]>("/api/v1/tenants/settings/roles-permissions/options");
}

export function createRolePermissions(body: {
  name: string;
  riskLevelMinimum: number;
  riskLevelMaximum: number;
  permissions: string[];
  department?: string;
  description?: string;
}) {
  return apiFetch("/api/v1/tenants/settings/roles-permissions", { method: "POST", body });
}

export function updateRolePermissions(
  roleId: string,
  body: {
    name?: string;
    riskLevelMinimum?: number;
    riskLevelMaximum?: number;
    permissions?: string[];
    department?: string;
    description?: string;
  },
) {
  // Upstream OpenAPI typo: roles-permissons
  return apiFetch(`/api/v1/tenants/settings/roles-permissons/${roleId}`, {
    method: "PUT",
    body,
  });
}

export function deleteRolePermissions(roleId: string) {
  return apiFetch(`/api/v1/tenants/settings/roles-permissons/${roleId}`, { method: "DELETE" });
}

export function getApiKey() {
  return apiFetch<ApiApiKey>("/api/v1/tenants/settings/api-key");
}

export function rotateApiKey() {
  return apiFetch<ApiApiKey>("/api/v1/tenants/settings/api-key/rotate", { method: "POST" });
}

export function getRiskFactors() {
  return apiFetch<ApiRiskFactor[]>("/api/v1/tenants/settings/risk-factor-configurations");
}

export function updateRiskFactor(slug: string, riskWeight: number) {
  return apiFetch(`/api/v1/tenants/settings/risk-factor-configurations/${slug}`, {
    method: "PUT",
    body: { riskWeight },
  });
}

export function getRiskScoreThreshold() {
  return apiFetch<ApiRiskScoreThreshold>("/api/v1/tenants/settings/risk-score-threshold");
}

export function updateRiskScoreThreshold(body: {
  warningThreshold: number;
  blockThreshold: number;
}) {
  return apiFetch("/api/v1/tenants/settings/risk-score-threshold", { method: "PUT", body });
}

export function getPepTiers() {
  return apiFetch<ApiPepTier[]>("/api/v1/tenants/settings/pep-tier-configurations");
}

export function updatePepTier(
  tier: ApiPepTier["tier"],
  body: Partial<{
    description: string;
    name: string;
    riskScoreImpact: number;
    requiresApproval: boolean;
    autoEscalation: boolean;
    positionDescription: string;
    positionExamples: string[];
  }>,
) {
  return apiFetch(`/api/v1/tenants/settings/pep-tier-configurations/${tier}`, {
    method: "PUT",
    body,
  });
}

export function getNotificationPreferences() {
  return apiFetch<ApiNotificationPreferences>(
    "/api/v1/tenants/settings/notification-preferences",
  );
}

export function updateNotificationPreferences(body: {
  eventCallbackUrl?: string | null;
  ipWhitelistEnabled?: boolean;
  allowedIps?: string[];
}) {
  return apiFetch("/api/v1/tenants/settings/notification-preferences", {
    method: "PUT",
    body,
  });
}

export function getComplianceRules() {
  return apiFetch<ApiComplianceRules>("/api/v1/tenants/settings/compliance-rules");
}

export function updateComplianceRules(body: Partial<{
  kycExpiryDays: number;
  kybExpiryDays: number;
  kycDocuments: string[];
  kybDocuments: string[];
  flaggedCountryCodes: string[];
}>) {
  return apiFetch("/api/v1/tenants/settings/compliance-rules", { method: "PUT", body });
}

export function getMfaStatus() {
  return apiFetch<ApiMfaStatus>("/api/v1/auth/mfa/status");
}

export function setupMfa() {
  return apiFetch<ApiMfaSetup>("/api/v1/auth/mfa/setup", { method: "POST" });
}

export function enableMfa(token: string) {
  return apiFetch("/api/v1/auth/mfa/enable", { method: "PUT", body: { token } });
}

export function disableMfa(token: string) {
  return apiFetch("/api/v1/auth/mfa/disable", { method: "PUT", body: { token } });
}

export function updatePassword(password: string) {
  return apiFetch("/api/v1/auth/password", { method: "PUT", body: { password } });
}

export function switchDomain(body: DomainSwitchDto) {
  return apiFetch("/api/v1/tenants/settings/domain/switch", { method: "POST", body });
}
