"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRolePermissions,
  createTeamInvite,
  deleteRolePermissions,
  getApiKey,
  getBusinessIndustries,
  getBusinessInformation,
  getComplianceRules,
  getEmployeeCounts,
  getMfaStatus,
  getNotificationPreferences,
  getPepTiers,
  getRiskFactors,
  getRiskScoreThreshold,
  getRolePermissionOptions,
  getRolesPermissions,
  getTeams,
  getUserProfile,
  resendTeamInvite,
  revokeTeamInvite,
  rotateApiKey,
  updateBusinessInformation,
  updateComplianceRules,
  updateNotificationPreferences,
  updatePepTier,
  updateRiskFactor,
  updateRiskScoreThreshold,
  updateRolePermissions,
  updateUserProfile,
  updatePassword,
  enableMfa,
  disableMfa,
  setupMfa,
  switchDomain,
} from "@/lib/api/settings";
import {
  mapApprovalsToSettings,
  mapBusinessInformationToSettings,
  mapComplianceRulesToSettings,
  mapNotificationsToSettings,
  mapPepToSettings,
  mapRolesToSettings,
  mapTeamMembersToSettings,
  mapUserProfileToSettings,
  monthsToDays,
} from "@/lib/api/mappers/settings";
import type { SettingsBusinessInformation, SettingsProfile } from "@/types/settings";

export const settingsKeys = {
  profile: ["settings", "profile"] as const,
  business: ["settings", "business"] as const,
  industries: ["settings", "industries"] as const,
  employeeCounts: ["settings", "employee-counts"] as const,
  teams: ["settings", "teams"] as const,
  roles: ["settings", "roles"] as const,
  roleOptions: ["settings", "role-options"] as const,
  apiKey: ["settings", "api-key"] as const,
  riskFactors: ["settings", "risk-factors"] as const,
  riskThreshold: ["settings", "risk-threshold"] as const,
  pep: ["settings", "pep"] as const,
  notifications: ["settings", "notifications"] as const,
  compliance: ["settings", "compliance"] as const,
  mfa: ["settings", "mfa"] as const,
};

export function useSettingsProfile() {
  return useQuery({
    queryKey: settingsKeys.profile,
    queryFn: async () => mapUserProfileToSettings(await getUserProfile()),
  });
}

export function useUpdateSettingsProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: SettingsProfile) => {
      await updateUserProfile({
        personalInformation: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone || undefined,
        },
        preferences: {
          timezone: profile.timezone,
          language: profile.language,
        },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.profile });
    },
  });
}

export function useSettingsBusiness() {
  return useQuery({
    queryKey: settingsKeys.business,
    queryFn: async () => mapBusinessInformationToSettings(await getBusinessInformation()),
  });
}

export function useBusinessSelectOptions() {
  const industries = useQuery({
    queryKey: settingsKeys.industries,
    queryFn: getBusinessIndustries,
  });
  const employeeCounts = useQuery({
    queryKey: settingsKeys.employeeCounts,
    queryFn: getEmployeeCounts,
  });
  return { industries, employeeCounts };
}

export function useUpdateSettingsBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (business: SettingsBusinessInformation) => {
      await updateBusinessInformation({
        name: business.companyName,
        registrationNumber: business.registrationNumber,
        tin: business.taxIdentificationNumber,
        industry: business.industry,
        website: business.website,
        yearFounded: business.yearOfEstablishment,
        companySize: business.numberOfEmployees,
        address: {
          houseNo: business.streetAddress.split(" ")[0] || "N/A",
          street: business.streetAddress,
          city: business.city,
          stateCode: business.stateRegion.slice(0, 2).toUpperCase() || "LA",
          countryCode: business.country || "NG",
          zipCode: business.postalCode,
          coordinates: { lat: 0, lng: 0 },
        },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.business });
    },
  });
}

export function useSettingsTeams() {
  return useQuery({
    queryKey: settingsKeys.teams,
    queryFn: async () => mapTeamMembersToSettings(await getTeams()),
  });
}

export function useCreateTeamInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeamInvite,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.teams });
    },
  });
}

export function useResendTeamInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resendTeamInvite(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.teams });
    },
  });
}

export function useRevokeTeamInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => revokeTeamInvite(inviteId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.teams });
    },
  });
}

export function useTeamRoleOptions() {
  return useQuery({
    queryKey: [...settingsKeys.roles, "options-for-invite"] as const,
    queryFn: async () => {
      const roles = await getRolesPermissions();
      return roles.map((role) => ({
        value: role.id,
        label: role.name,
      }));
    },
  });
}

export function useSettingsRoles() {
  return useQuery({
    queryKey: settingsKeys.roles,
    queryFn: async () => {
      const [roles, options] = await Promise.all([
        getRolesPermissions(),
        getRolePermissionOptions(),
      ]);
      return mapRolesToSettings(roles, options);
    },
  });
}

export function useRolePermissionOptions() {
  return useQuery({
    queryKey: settingsKeys.roleOptions,
    queryFn: getRolePermissionOptions,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRolePermissions,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.roles });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      body,
    }: {
      roleId: string;
      body: {
        name?: string;
        riskLevelMinimum?: number;
        riskLevelMaximum?: number;
        permissions?: string[];
        department?: string;
        description?: string;
      };
    }) => updateRolePermissions(roleId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.roles });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => deleteRolePermissions(roleId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.roles });
    },
  });
}

export function useSettingsApiKey() {
  return useQuery({
    queryKey: settingsKeys.apiKey,
    queryFn: getApiKey,
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rotateApiKey,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.apiKey });
    },
  });
}

export function useSettingsApprovals() {
  return useQuery({
    queryKey: [...settingsKeys.riskFactors, ...settingsKeys.riskThreshold],
    queryFn: async () => {
      const [factors, thresholds] = await Promise.all([
        getRiskFactors(),
        getRiskScoreThreshold(),
      ]);
      return mapApprovalsToSettings(factors, thresholds);
    },
  });
}

export function useSaveSettingsApprovals() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      factors: Array<{ id: string; impact: "low" | "medium" | "high" }>;
      warningThreshold: number;
      blockThreshold: number;
    }) => {
      const weightFromImpact = { low: 1, medium: 2, high: 3 } as const;
      await Promise.all([
        ...input.factors.map((factor) =>
          updateRiskFactor(factor.id, weightFromImpact[factor.impact]),
        ),
        updateRiskScoreThreshold({
          warningThreshold: input.warningThreshold,
          blockThreshold: input.blockThreshold,
        }),
      ]);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.riskFactors });
      void queryClient.invalidateQueries({ queryKey: settingsKeys.riskThreshold });
    },
  });
}

export function useSettingsPep() {
  return useQuery({
    queryKey: settingsKeys.pep,
    queryFn: async () => mapPepToSettings(await getPepTiers()),
  });
}

export function useUpdatePepTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      tier: "tier-1" | "tier-2" | "tier-3" | "tier-4";
      name: string;
      description: string;
      riskScoreImpact: number;
      requiresApproval: boolean;
      autoEscalation: boolean;
      examples: string[];
    }) =>
      updatePepTier(input.tier, {
        name: input.name,
        description: input.description,
        riskScoreImpact: input.riskScoreImpact,
        requiresApproval: input.requiresApproval,
        autoEscalation: input.autoEscalation,
        positionExamples: input.examples,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.pep });
    },
  });
}

export function useSettingsNotifications() {
  return useQuery({
    queryKey: settingsKeys.notifications,
    queryFn: async () => mapNotificationsToSettings(await getNotificationPreferences()),
  });
}

export function useUpdateSettingsNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { webhookEnabled: boolean; webhookUrl: string }) =>
      updateNotificationPreferences({
        eventCallbackUrl: input.webhookEnabled ? input.webhookUrl || null : null,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.notifications });
    },
  });
}

export function useSettingsCompliance() {
  return useQuery({
    queryKey: settingsKeys.compliance,
    queryFn: async () => mapComplianceRulesToSettings(await getComplianceRules()),
  });
}

export function useUpdateSettingsCompliance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      kycExpiryMonths: number;
      kybExpiryMonths: number;
      kycDocuments: string[];
      kybDocuments: string[];
      flaggedCountryCodes: string[];
    }) =>
      updateComplianceRules({
        kycExpiryDays: monthsToDays(input.kycExpiryMonths),
        kybExpiryDays: monthsToDays(input.kybExpiryMonths),
        kycDocuments: input.kycDocuments,
        kybDocuments: input.kybDocuments,
        flaggedCountryCodes: input.flaggedCountryCodes,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: settingsKeys.compliance });
    },
  });
}

export function useSettingsMfa() {
  return useQuery({
    queryKey: settingsKeys.mfa,
    queryFn: getMfaStatus,
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) => updatePassword(password),
  });
}

export function useMfaActions() {
  const queryClient = useQueryClient();
  return {
    setup: useMutation({ mutationFn: setupMfa }),
    enable: useMutation({
      mutationFn: enableMfa,
      onSuccess: () => void queryClient.invalidateQueries({ queryKey: settingsKeys.mfa }),
    }),
    disable: useMutation({
      mutationFn: disableMfa,
      onSuccess: () => void queryClient.invalidateQueries({ queryKey: settingsKeys.mfa }),
    }),
  };
}

export function useSwitchDomain() {
  return useMutation({
    mutationFn: (domain: "sandbox" | "production") => switchDomain({ domain }),
  });
}
