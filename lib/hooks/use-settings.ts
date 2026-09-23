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
import { requireSettingsAppId, useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import type { SettingsBusinessInformation, SettingsProfile } from "@/types/settings";

export const settingsKeys = {
  profile: ["settings", "profile"] as const,
  business: ["settings", "business"] as const,
  industries: ["settings", "industries"] as const,
  employeeCounts: ["settings", "employee-counts"] as const,
  teams: ["settings", "teams"] as const,
  roles: ["settings", "roles"] as const,
  roleOptions: ["settings", "role-options"] as const,
  apiKey: (appId: string) => ["settings", "api-key", appId] as const,
  approvals: (appId: string) => ["settings", "approvals", appId] as const,
  pep: (appId: string) => ["settings", "pep", appId] as const,
  notifications: (appId: string) => ["settings", "notifications", appId] as const,
  compliance: (appId: string) => ["settings", "compliance", appId] as const,
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
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: settingsKeys.apiKey(selectedAppId ?? "none"),
    queryFn: () => getApiKey(requireSettingsAppId(selectedAppId)),
    enabled: Boolean(selectedAppId),
  });
}

export function useRotateApiKey() {
  const queryClient = useQueryClient();
  const { selectedAppId } = useSettingsAppSelection();
  return useMutation({
    mutationFn: () => rotateApiKey(requireSettingsAppId(selectedAppId)),
    onSuccess: () => {
      if (selectedAppId) {
        void queryClient.invalidateQueries({ queryKey: settingsKeys.apiKey(selectedAppId) });
      }
    },
  });
}

export function useSettingsApprovals() {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: settingsKeys.approvals(selectedAppId ?? "none"),
    queryFn: async () => {
      const appId = requireSettingsAppId(selectedAppId);
      const [factors, thresholds] = await Promise.all([
        getRiskFactors(appId),
        getRiskScoreThreshold(appId),
      ]);
      return mapApprovalsToSettings(factors, thresholds);
    },
    enabled: Boolean(selectedAppId),
  });
}

export function useSaveSettingsApprovals() {
  const queryClient = useQueryClient();
  const { selectedAppId } = useSettingsAppSelection();
  return useMutation({
    mutationFn: async (input: {
      factors: Array<{ id: string; impact: "low" | "medium" | "high" }>;
      warningThreshold: number;
      blockThreshold: number;
    }) => {
      const appId = requireSettingsAppId(selectedAppId);
      const weightFromImpact = { low: 1, medium: 2, high: 3 } as const;
      await Promise.all([
        ...input.factors.map((factor) =>
          updateRiskFactor(appId, factor.id, weightFromImpact[factor.impact]),
        ),
        updateRiskScoreThreshold(appId, {
          warningThreshold: input.warningThreshold,
          blockThreshold: input.blockThreshold,
        }),
      ]);
    },
    onSuccess: () => {
      if (selectedAppId) {
        void queryClient.invalidateQueries({ queryKey: settingsKeys.approvals(selectedAppId) });
      }
    },
  });
}

export function useSettingsPep() {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: settingsKeys.pep(selectedAppId ?? "none"),
    queryFn: async () => mapPepToSettings(await getPepTiers(requireSettingsAppId(selectedAppId))),
    enabled: Boolean(selectedAppId),
  });
}

export function useUpdatePepTier() {
  const queryClient = useQueryClient();
  const { selectedAppId } = useSettingsAppSelection();
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
      updatePepTier(requireSettingsAppId(selectedAppId), input.tier, {
        name: input.name,
        description: input.description,
        riskScoreImpact: input.riskScoreImpact,
        requiresApproval: input.requiresApproval,
        autoEscalation: input.autoEscalation,
        positionExamples: input.examples,
      }),
    onSuccess: () => {
      if (selectedAppId) {
        void queryClient.invalidateQueries({ queryKey: settingsKeys.pep(selectedAppId) });
      }
    },
  });
}

export function useSettingsNotifications() {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: settingsKeys.notifications(selectedAppId ?? "none"),
    queryFn: async () =>
      mapNotificationsToSettings(await getNotificationPreferences(requireSettingsAppId(selectedAppId))),
    enabled: Boolean(selectedAppId),
  });
}

export function useUpdateSettingsNotifications() {
  const queryClient = useQueryClient();
  const { selectedAppId } = useSettingsAppSelection();
  return useMutation({
    mutationFn: async (input: { webhookEnabled: boolean; webhookUrl: string }) =>
      updateNotificationPreferences(requireSettingsAppId(selectedAppId), {
        eventCallbackUrl: input.webhookEnabled ? input.webhookUrl || null : null,
      }),
    onSuccess: () => {
      if (selectedAppId) {
        void queryClient.invalidateQueries({ queryKey: settingsKeys.notifications(selectedAppId) });
      }
    },
  });
}

export function useSettingsCompliance() {
  const { selectedAppId } = useSettingsAppSelection();
  return useQuery({
    queryKey: settingsKeys.compliance(selectedAppId ?? "none"),
    queryFn: async () =>
      mapComplianceRulesToSettings(await getComplianceRules(requireSettingsAppId(selectedAppId))),
    enabled: Boolean(selectedAppId),
  });
}

export function useUpdateSettingsCompliance() {
  const queryClient = useQueryClient();
  const { selectedAppId } = useSettingsAppSelection();
  return useMutation({
    mutationFn: async (input: {
      kycExpiryMonths: number;
      kybExpiryMonths: number;
      kycDocuments: string[];
      kybDocuments: string[];
      flaggedCountryCodes: string[];
    }) =>
      updateComplianceRules(requireSettingsAppId(selectedAppId), {
        kycExpiryDays: monthsToDays(input.kycExpiryMonths),
        kybExpiryDays: monthsToDays(input.kybExpiryMonths),
        kycDocuments: input.kycDocuments,
        kybDocuments: input.kybDocuments,
        flaggedCountryCodes: input.flaggedCountryCodes,
      }),
    onSuccess: () => {
      if (selectedAppId) {
        void queryClient.invalidateQueries({ queryKey: settingsKeys.compliance(selectedAppId) });
      }
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
