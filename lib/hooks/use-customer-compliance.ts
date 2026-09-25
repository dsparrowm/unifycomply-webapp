"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createKybShareholder,
  getKycDocumentRequirements,
  getKybDocumentRequirements,
  listKybShareholders,
  offboardKybCustomer,
  offboardKycCustomer,
  updateKybShareholder,
  updateKybDocument,
  patchKycFlagStatus,
  patchKybFlagStatus,
} from "@/lib/api/customers";
import {
  mapCustomerFlags,
  mapDocumentRequirements,
} from "@/lib/api/mappers/customer-compliance";
import { mapKybShareholders, unwrapCollection } from "@/lib/api/mappers/customers";
import type {
  ApiCustomerFlagStatus,
  CreateTenantKybDocumentDto,
  CreateTenantKybShareholderDto,
} from "@/lib/api/types";
import { isLiveCustomerId } from "@/lib/customers/live-id";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import type { CustomerFlag } from "@/types/customer-compliance";

export const complianceKeys = {
  kycRequirements: (customerId: string, appId: string | null) =>
    ["customers", "kyc", customerId, "document-requirements", appId ?? "default"] as const,
  kybRequirements: (customerId: string, appId: string | null) =>
    ["customers", "kyb", customerId, "document-requirements", appId ?? "default"] as const,
  kybShareholders: (customerId: string) =>
    ["customers", "kyb", customerId, "shareholders"] as const,
};

export function useKycDocumentRequirements(customerId: string, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();
  const live = isLiveCustomerId(customerId);

  return useQuery({
    queryKey: complianceKeys.kycRequirements(customerId, selectedAppId),
    enabled: enabled && live,
    queryFn: async () => {
      const data = await getKycDocumentRequirements(customerId, selectedAppId ?? undefined);
      return mapDocumentRequirements(data);
    },
  });
}

export function useKybDocumentRequirements(customerId: string, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();
  const live = isLiveCustomerId(customerId);

  return useQuery({
    queryKey: complianceKeys.kybRequirements(customerId, selectedAppId),
    enabled: enabled && live,
    queryFn: async () => {
      const data = await getKybDocumentRequirements(customerId, selectedAppId ?? undefined);
      return mapDocumentRequirements(data);
    },
  });
}

export function useKybCustomerShareholders(customerId: string, enabled: boolean) {
  const live = isLiveCustomerId(customerId);

  return useQuery({
    queryKey: complianceKeys.kybShareholders(customerId),
    enabled: enabled && live,
    queryFn: async () => {
      const data = await listKybShareholders(customerId);
      return mapKybShareholders(unwrapCollection(data));
    },
  });
}

export function useCreateKybShareholder(customerId: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateTenantKybShareholderDto) =>
      createKybShareholder(customerId, body, selectedAppId ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers", "kyb", customerId] });
      await queryClient.invalidateQueries({ queryKey: complianceKeys.kybShareholders(customerId) });
      await queryClient.invalidateQueries({ queryKey: ["verifications", "kyb"] });
    },
  });
}

export function useUpdateKybShareholder(customerId: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shareholderId, body }: { shareholderId: string; body: CreateTenantKybShareholderDto }) =>
      updateKybShareholder(customerId, shareholderId, body, selectedAppId ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: complianceKeys.kybShareholders(customerId) });
      await queryClient.invalidateQueries({ queryKey: ["verifications", "kyb"] });
    },
  });
}

export function useUpdateKybDocument(customerId: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ documentId, body }: { documentId: string; body: CreateTenantKybDocumentDto }) =>
      updateKybDocument(customerId, documentId, body, selectedAppId ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["verifications", "kyb"] });
      await queryClient.invalidateQueries({ queryKey: ["customers", "kyb", customerId] });
    },
  });
}

export function usePatchCustomerFlag(kind: "kyc" | "kyb", customerId: string) {
  const { selectedAppId } = useSettingsAppSelection();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      flagId,
      status,
      note,
    }: {
      flagId: string;
      status: ApiCustomerFlagStatus;
      note?: string;
    }) =>
      kind === "kyc"
        ? patchKycFlagStatus(customerId, flagId, { status, note }, selectedAppId ?? undefined)
        : patchKybFlagStatus(customerId, flagId, { status, note }, selectedAppId ?? undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          kind === "kyc" ? ["customers", "kyc", customerId] : ["customers", "kyb", customerId],
      });
    },
  });
}

export function useOffboardCustomer(kind: "kyc" | "kyb", customerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) =>
      kind === "kyc"
        ? offboardKycCustomer(customerId, reason)
        : offboardKybCustomer(customerId, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers", kind] });
      await queryClient.invalidateQueries({ queryKey: ["verifications", kind] });
    },
  });
}

export function applyFlagStatus(
  flags: CustomerFlag[] | undefined,
  flagId: string,
  status: ApiCustomerFlagStatus,
): CustomerFlag[] {
  return (flags ?? []).map((flag) => (flag.id === flagId ? { ...flag, status } : flag));
}

/** Re-export for callers that already hold raw flag payloads. */
export { mapCustomerFlags };
