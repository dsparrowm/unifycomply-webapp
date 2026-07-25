import type {
  ApiBusinessInformation,
  ApiComplianceRules,
  ApiNotificationPreferences,
  ApiPepTier,
  ApiRiskFactor,
  ApiRiskScoreThreshold,
  ApiTeamMember,
  ApiTenantRole,
  ApiUserProfile,
  ApiPermissionOption,
} from "@/lib/api/types";
import type {
  SettingsApprovals,
  SettingsBusinessInformation,
  SettingsComplianceRules,
  SettingsNotifications,
  SettingsPepSettings,
  SettingsPepTier,
  SettingsProfile,
  SettingsRole,
  SettingsTeamMember,
  SettingsTeamMemberStatus,
} from "@/types/settings";

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}

export function mapUserProfileToSettings(profile: ApiUserProfile): SettingsProfile {
  const firstName = profile.personalInformation.firstName ?? "";
  const lastName = profile.personalInformation.lastName ?? "";
  const displayName = `${firstName} ${lastName}`.trim();
  return {
    firstName,
    lastName,
    email: profile.personalInformation.email ?? "",
    phone: profile.personalInformation.phone ?? "",
    role: profile.personalInformation.role ?? "",
    department: profile.personalInformation.department ?? "",
    timezone: profile.preferences.timezone || "Africa/Lagos",
    language: profile.preferences.language || "en-US",
    initials: initialsFromName(displayName || profile.personalInformation.email || "U"),
    displayName: displayName || profile.personalInformation.email || "",
  };
}

export function mapBusinessInformationToSettings(
  data: ApiBusinessInformation,
): SettingsBusinessInformation {
  const address = data.address;
  return {
    companyName: data.name ?? "",
    registrationNumber: data.registrationNumber ?? "",
    taxIdentificationNumber: data.tin ?? "",
    industry: data.industry ?? "",
    website: data.website ?? "",
    yearOfEstablishment: data.yearFounded ?? "",
    numberOfEmployees: data.companySize ?? "",
    streetAddress: address
      ? [address.houseNo, address.street].filter(Boolean).join(" ")
      : "",
    city: address?.city ?? "",
    stateRegion: address?.state ?? address?.stateCode ?? "",
    country: address?.countryCode ?? "",
    postalCode: address?.zipCode ?? "",
  };
}

function mapTeamStatus(status: string | undefined): SettingsTeamMemberStatus {
  const normalized = (status ?? "active").toLowerCase();
  if (normalized === "pending" || normalized === "invited") return "pending";
  if (normalized === "removed" || normalized === "revoked" || normalized === "inactive") {
    return "removed";
  }
  return "active";
}

export function mapTeamMembersToSettings(members: ApiTeamMember[]): SettingsTeamMember[] {
  const list = Array.isArray(members) ? members : [];
  return list.map((member) => {
    const name = member.fullName ?? member.name ?? member.email;
    const lastActiveRaw = member.lastActivityAt ?? member.lastActiveAt;
    return {
      id: member.id,
      name,
      email: member.email,
      initials: initialsFromName(name),
      role: member.roleName ?? member.role ?? "Member",
      lastActive: lastActiveRaw ? new Date(lastActiveRaw).toLocaleString() : "—",
      status: mapTeamStatus(member.status),
    };
  });
}

const ROLE_PERMISSION_SHORT_LABELS: Record<string, string> = {
  "team-member:create": "Add members",
  "team-member:update": "Update members",
  "role-permission:create": "Create roles",
  "role-permission:update": "Update roles",
  "verification:approve": "Approve",
  "verification:reject": "Reject",
  "case:escalate": "Escalate",
  "approval:escalate": "Escalate",
  "compliance:update": "Compliance",
  "tenant-settings:update": "Settings",
};

export function mapRolesToSettings(
  roles: ApiTenantRole[],
  options: ApiPermissionOption[],
): SettingsRole[] {
  const labelByValue = new Map(options.map((option) => [option.value, option.label]));
  return roles.map((role) => {
    const permissions = role.permissions.map((permission) => ({
      id: permission,
      label: labelByValue.get(permission) ?? permission,
      enabled: true,
    }));
    const summaryParts = role.permissions.map(
      (permission) =>
        ROLE_PERMISSION_SHORT_LABELS[permission] ??
        (labelByValue.get(permission) ?? permission).replace(/^Can\s+/i, ""),
    );
    return {
      id: role.id,
      name: role.name,
      riskLevel: `Risk Level ${role.riskLevelMinimum} - ${role.riskLevelMaximum}`,
      riskLevelMinimum: role.riskLevelMinimum,
      riskLevelMaximum: role.riskLevelMaximum,
      department: role.department,
      description: role.description,
      permissions,
      summary: summaryParts.join(" • ") || "No permissions",
    };
  });
}

function impactFromWeight(weight: number): "low" | "medium" | "high" {
  if (weight >= 3) return "high";
  if (weight >= 2) return "medium";
  return "low";
}

export function mapApprovalsToSettings(
  factors: ApiRiskFactor[],
  thresholds: ApiRiskScoreThreshold,
): SettingsApprovals {
  return {
    riskFactors: factors.map((factor) => ({
      id: factor.slug,
      title: factor.name,
      description: factor.description,
      enabled: factor.riskWeight > 0,
      impact: impactFromWeight(factor.riskWeight),
    })),
    thresholds: {
      warningThreshold: thresholds.warningThreshold,
      approvalBlockThreshold: thresholds.blockThreshold,
      maxScore: 4,
    },
  };
}

export function mapPepToSettings(tiers: ApiPepTier[]): SettingsPepSettings {
  const mapped: SettingsPepTier[] = tiers.map((tier) => {
    const level = Number(tier.tier.replace("tier-", "")) as 1 | 2 | 3 | 4;
    return {
      id: tier.tier,
      level,
      title: tier.name,
      description: tier.description,
      riskScoreImpact: tier.riskScoreImpact,
      requiresApproval: tier.requiresApproval,
      autoEscalation: tier.autoEscalation,
      examples: tier.positionExamples,
    };
  });
  return { tiers: mapped };
}

export function mapNotificationsToSettings(
  data: ApiNotificationPreferences,
): SettingsNotifications {
  return {
    webhookEnabled: Boolean(data.eventCallbackUrl),
    webhookUrl: data.eventCallbackUrl ?? "",
  };
}

const DOCUMENT_LABELS: Record<string, string> = {
  "id-document": "ID Document",
  "proof-of-address": "Proof of Address",
  "liveness-check": "Liveness Check",
  "certificat-of-incorporation": "Certificate of Incorporation",
  "tax-id": "Tax ID",
  "proof-of-business-address": "Proof of Business Address",
  "directors-id": "Directors ID",
};

function daysToMonths(days: number): number {
  return Math.max(1, Math.round(days / 30));
}

export function mapComplianceRulesToSettings(data: ApiComplianceRules): SettingsComplianceRules {
  return {
    verificationExpiry: {
      kycExpiryMonths: String(daysToMonths(data.kycExpiryDays)),
      kybExpiryMonths: String(daysToMonths(data.kybExpiryDays)),
    },
    kycDocuments: data.kycDocuments.map((id) => ({
      id,
      label: DOCUMENT_LABELS[id] ?? id,
    })),
    kybDocuments: data.kybDocuments.map((id) => ({
      id,
      label: DOCUMENT_LABELS[id] ?? id,
    })),
    flaggedCountries: data.flaggedCountryCodes.map((code) => ({
      id: code,
      label: code,
    })),
  };
}

export function monthsToDays(months: number): number {
  return Math.max(1, Math.round(months * 30));
}
