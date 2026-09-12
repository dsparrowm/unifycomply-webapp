"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getKybAccountPurpose,
  getKybCustomer,
  getKycAccountPurpose,
  getKycCustomer,
  putKybAccountPurpose,
  putKycAccountPurpose,
} from "@/lib/api/customers";
import { mapAccountPurposeFormToDto, mapApiAccountPurposeToForm } from "@/lib/api/mappers/account-purpose";
import { mapAvailableChecks } from "@/lib/api/mappers/verifications";
import { getAvailableChecks, startKybVerification, startKycVerification } from "@/lib/api/verifications";
import { customerAppId, customerCountryCode } from "@/lib/customers/live-id";
import { customerKeys } from "@/lib/hooks/use-customers";
import type { AccountPurposeFormValues, CustomerKind } from "@/types/account-purpose";
import type { StartVerificationSelection } from "@/types/verification";

export const intakeKeys = {
  purpose: (kind: CustomerKind, id: string) => ["customers", kind, id, "account-purpose"] as const,
  checks: (countryCode: string, kind: CustomerKind) =>
    ["verifications", "available-checks", countryCode, kind] as const,
};

export function useAccountPurpose(kind: CustomerKind, customerId: string) {
  return useQuery({
    queryKey: intakeKeys.purpose(kind, customerId),
    queryFn: async () => {
      const data = kind === "kyc" ? await getKycAccountPurpose(customerId) : await getKybAccountPurpose(customerId);
      return mapApiAccountPurposeToForm(data);
    },
    enabled: Boolean(customerId),
  });
}

export function useSaveAccountPurpose(kind: CustomerKind, customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: AccountPurposeFormValues) => {
      const dto = mapAccountPurposeFormToDto(values);
      if (kind === "kyc") {
        await putKycAccountPurpose(customerId, dto);
      } else {
        await putKybAccountPurpose(customerId, dto);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: intakeKeys.purpose(kind, customerId) });
    },
  });
}

export function useCustomerForIntake(kind: CustomerKind, customerId: string) {
  return useQuery({
    queryKey: ["customers", kind, customerId, "raw"] as const,
    queryFn: () => (kind === "kyc" ? getKycCustomer(customerId) : getKybCustomer(customerId)),
    enabled: Boolean(customerId),
  });
}

export function useAvailableChecks(kind: CustomerKind, countryCode: string | undefined) {
  const profileType = kind === "kyc" ? "individual" : "business";
  const code = countryCode ?? "";
  return useQuery({
    queryKey: intakeKeys.checks(code, kind),
    queryFn: async () => mapAvailableChecks(await getAvailableChecks(code, profileType)),
    enabled: Boolean(code),
  });
}

export function useStartVerification(kind: CustomerKind, customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { selections: StartVerificationSelection[]; customer: unknown }) => {
      const body = {
        customerId,
        verificationTypes: input.selections.map((selection) => ({
          type: selection.type,
          providerKey: selection.providerKey || undefined,
        })),
      };
      const appId = customerAppId(input.customer);
      if (kind === "kyc") {
        await startKycVerification(body, appId);
      } else {
        await startKybVerification(body, appId);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: kind === "kyc" ? customerKeys.kycDetail(customerId) : customerKeys.kybDetail(customerId),
      });
      await queryClient.invalidateQueries({
        queryKey: kind === "kyc" ? customerKeys.kycList : customerKeys.kybList,
      });
    },
  });
}

export { customerCountryCode };
