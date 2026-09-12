"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createKybCustomer,
  createKybDocument,
  createKycCustomer,
  createKycDocument,
  findVerificationForCustomer,
  getAvailableChecks,
  getKybCustomer,
  getKycCustomer,
  getVerification,
  listKybCustomers,
  listKybDocuments,
  listKybShareholders,
  listKycCustomers,
  listKycDocuments,
  startKybVerification,
  startKycVerification,
} from "@/lib/api/compliance";
import { mapKybDetail, mapKybListData, mapKycDetail, mapKycListData } from "@/lib/api/mappers/compliance";
import { mergeKycDetailWithVerification } from "@/lib/api/mappers/kyc-detail-merge";
import { isVerificationSettled } from "@/lib/api/mappers/verification";
import type { CreateKybCustomerDto, CreateKycCustomerDto } from "@/lib/api/types";
import { fileToDataUri } from "@/lib/compliance/format";
import { startKycLookup } from "@/lib/compliance/lookup-run";

export const complianceKeys = {
  kycList: ["compliance", "kyc", "list"] as const,
  kycDetail: (id: string) => ["compliance", "kyc", id] as const,
  verification: (id: string) => ["compliance", "verification", id] as const,
  kybList: ["compliance", "kyb", "list"] as const,
  kybDetail: (id: string) => ["compliance", "kyb", id] as const,
  checks: (country: string, profile: "individual" | "business") =>
    ["compliance", "available-checks", country, profile] as const,
};

export function useKycList() {
  return useQuery({
    queryKey: complianceKeys.kycList,
    queryFn: async () => {
      const customers = (await listKycCustomers()).items;
      const documentLists = await Promise.all(
        customers.map((customer) => listKycDocuments(customer.id).catch(() => [])),
      );
      const documentsByCustomerId = Object.fromEntries(
        customers.map((customer, index) => [customer.id, documentLists[index]]),
      );
      return mapKycListData(customers, documentsByCustomerId);
    },
  });
}

export function useKycDocuments(customerId: string) {
  return useQuery({
    queryKey: [...complianceKeys.kycDetail(customerId), "documents"] as const,
    enabled: Boolean(customerId),
    queryFn: () => listKycDocuments(customerId),
  });
}

export function useKycDetail(customerId: string) {
  return useQuery({
    queryKey: complianceKeys.kycDetail(customerId),
    enabled: Boolean(customerId),
    queryFn: async () => {
      const [customer, documents] = await Promise.all([
        getKycCustomer(customerId),
        listKycDocuments(customerId).catch(() => []),
      ]);
      const verification = await findVerificationForCustomer(
        customerId,
        customer.statusRunId,
      ).catch(() => null);

      let detail = mapKycDetail(customer, documents);
      if (verification) {
        detail = mergeKycDetailWithVerification(detail, verification);
      }

      return { detail };
    },
  });
}

export function useVerification(workflowId: string) {
  return useQuery({
    queryKey: complianceKeys.verification(workflowId),
    enabled: Boolean(workflowId),
    queryFn: () => getVerification(workflowId),
    refetchInterval: (query) => {
      if (query.state.data && isVerificationSettled(query.state.data)) return false;
      return 2000;
    },
  });
}

export function useKycCustomer(customerId: string) {
  return useQuery({
    queryKey: ["compliance", "kyc", "customer", customerId] as const,
    enabled: Boolean(customerId),
    queryFn: () => getKycCustomer(customerId),
  });
}

export function useStartKycLookup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startKycLookup,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: complianceKeys.kycList });
      await queryClient.invalidateQueries({ queryKey: ["compliance", "kyc"] });
    },
  });
}

export function useKybList() {
  return useQuery({
    queryKey: complianceKeys.kybList,
    queryFn: async () => mapKybListData((await listKybCustomers()).items),
  });
}

export function useKybDetail(customerId: string) {
  return useQuery({
    queryKey: complianceKeys.kybDetail(customerId),
    enabled: Boolean(customerId),
    queryFn: async () => {
      const [customer, documents, shareholders] = await Promise.all([
        getKybCustomer(customerId),
        listKybDocuments(customerId).catch(() => []),
        listKybShareholders(customerId).catch(() => []),
      ]);
      return mapKybDetail(customer, documents, shareholders);
    },
  });
}

export function useAvailableChecks(countryCode: string, profileType: "individual" | "business") {
  return useQuery({
    queryKey: complianceKeys.checks(countryCode, profileType),
    enabled: countryCode.length >= 2,
    queryFn: () => getAvailableChecks(countryCode, profileType),
  });
}

export function useCreateKycCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      customer: CreateKycCustomerDto;
      documents?: Array<{
        type: string;
        file: File;
        idNumber?: string;
        issueDate?: string;
        expiryDate?: string;
      }>;
      verificationTypes: string[];
    }) => {
      const created = await createKycCustomer(input.customer);
      for (const document of input.documents ?? []) {
        const file = await fileToDataUri(document.file);
        await createKycDocument(created.id, {
          type: document.type,
          idNumber: document.idNumber,
          issueDate: document.issueDate,
          expiryDate: document.expiryDate,
          file,
        });
      }
      if (input.verificationTypes.length > 0) {
        try {
          await startKycVerification({
            customerId: created.id,
            verificationTypes: input.verificationTypes,
          });
        } catch {
          // Customer is still created if the run cannot start yet.
        }
      }
      return created;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: complianceKeys.kycList });
    },
  });
}

export function useCreateKybCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      customer: CreateKybCustomerDto;
      documents?: Array<{
        type: string;
        file: File;
        idNumber?: string;
        issueDate?: string;
        expiryDate?: string;
      }>;
      verificationTypes: string[];
    }) => {
      const created = await createKybCustomer(input.customer);
      for (const document of input.documents ?? []) {
        const file = await fileToDataUri(document.file);
        await createKybDocument(created.id, {
          type: document.type,
          idNumber: document.idNumber,
          issueDate: document.issueDate,
          expiryDate: document.expiryDate,
          file,
        });
      }
      if (input.verificationTypes.length > 0) {
        try {
          await startKybVerification({
            customerId: created.id,
            verificationTypes: input.verificationTypes,
          });
        } catch {
          // Customer is still created if the run cannot start yet.
        }
      }
      return created;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: complianceKeys.kybList });
    },
  });
}
