import { apiFetch } from "@/lib/api/client";
import type {
  ApiApiKey,
  ApiBusinessInformation,
  ApiComplianceRules,
  ApiEmployeeCount,
  ApiLabelValue,
  ApiPublicOptionSet,
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

export async function getBusinessIndustries() {
  const set = await apiFetch<ApiPublicOptionSet | null>(
    "/api/v1/public/misc/options/business-industries",
  );
  return (set?.options ?? []).map((option): ApiLabelValue => ({
    value: option.value,
    label: option.label,
  }));
}

export async function getEmployeeCounts() {
  const set = await apiFetch<ApiPublicOptionSet | null>(
    "/api/v1/public/misc/options/employee-counts",
  );
  return (set?.options ?? []).map((option): ApiEmployeeCount => ({
    id: option.value,
    label: option.label,
  }));
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

function appSettingsPath(appId: string, suffix: string) {
  return `/api/v1/tenants/apps/${appId}/${suffix}`;
}

export function getApiKey(appId: string) {
  return apiFetch<ApiApiKey>(appSettingsPath(appId, "api-key"));
}

export function rotateApiKey(appId: string) {
  return apiFetch<ApiApiKey>(appSettingsPath(appId, "api-key/rotate"), { method: "POST" });
}

export function getRiskFactors(appId: string) {
  return apiFetch<ApiRiskFactor[]>(appSettingsPath(appId, "risk-factor-configurations"));
}

export function updateRiskFactor(appId: string, slug: string, riskWeight: number) {
  return apiFetch(appSettingsPath(appId, `risk-factor-configurations/${slug}`), {
    method: "PUT",
    body: { riskWeight },
  });
}

export function getRiskScoreThreshold(appId: string) {
  return apiFetch<ApiRiskScoreThreshold>(appSettingsPath(appId, "risk-score-threshold"));
}

export function updateRiskScoreThreshold(
  appId: string,
  body: {
    warningThreshold: number;
    blockThreshold: number;
  },
) {
  return apiFetch(appSettingsPath(appId, "risk-score-threshold"), { method: "PUT", body });
}

export function getPepTiers(appId: string) {
  return apiFetch<ApiPepTier[]>(appSettingsPath(appId, "pep-tier-configurations"));
}

export function updatePepTier(
  appId: string,
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
  return apiFetch(appSettingsPath(appId, `pep-tier-configurations/${tier}`), {
    method: "PUT",
    body,
  });
}

export function getNotificationPreferences(appId: string) {
  return apiFetch<ApiNotificationPreferences>(appSettingsPath(appId, "notification-preferences"));
}

export function updateNotificationPreferences(
  appId: string,
  body: {
    eventCallbackUrl?: string | null;
    ipWhitelistEnabled?: boolean;
    allowedIps?: string[];
  },
) {
  return apiFetch(appSettingsPath(appId, "notification-preferences"), {
    method: "PUT",
    body,
  });
}

export function getComplianceRules(appId: string) {
  return apiFetch<ApiComplianceRules>(appSettingsPath(appId, "compliance-rules"));
}

export function updateComplianceRules(
  appId: string,
  body: Partial<{
    kycExpiryDays: number;
    kybExpiryDays: number;
    kycDocuments: string[];
    kybDocuments: string[];
    flaggedCountryCodes: string[];
  }>,
) {
  return apiFetch(appSettingsPath(appId, "compliance-rules"), { method: "PUT", body });
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
