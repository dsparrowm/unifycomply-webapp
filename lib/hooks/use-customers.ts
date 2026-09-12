"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getKybCustomer,
  getKycCustomer,
  listAllKybCustomers,
  listAllKycCustomers,
  listKybDocuments,
  listKybShareholders,
  listKycDocuments,
} from "@/lib/api/customers";
import { ApiError } from "@/lib/api/errors";
import { mapApiKybList, mapApiKybToDetail, mapApiKycList, mapApiKycToDetail } from "@/lib/api/mappers/customers";
import { kybBatchesMock } from "@/lib/data/kyb-batches";
import { getKybDetailById } from "@/lib/data/kyb-detail";
import { getKycDetailById } from "@/lib/data/kyc-detail";

export const customerKeys = {
  kycList: ["customers", "kyc"] as const,
  kycDetail: (id: string) => ["customers", "kyc", id] as const,
  kybList: ["customers", "kyb"] as const,
  kybDetail: (id: string) => ["customers", "kyb", id] as const,
};

export function useKycList() {
  return useQuery({
    queryKey: customerKeys.kycList,
    queryFn: async () => mapApiKycList(await listAllKycCustomers()),
  });
}

export function useKycDetail(customerId: string) {
  const fixture = getKycDetailById(customerId);

  return useQuery({
    queryKey: customerKeys.kycDetail(customerId),
    queryFn: async () => {
      if (fixture) {
        return fixture;
      }
      const [customer, documents] = await Promise.all([
        getKycCustomer(customerId),
        listKycDocuments(customerId).catch(() => []),
      ]);
      const detail = mapApiKycToDetail(customer, documents);
      if (!detail) {
        throw new Error("Customer not found");
      }
      return detail;
    },
    enabled: Boolean(customerId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
        return false;
      }
      if (error instanceof Error && error.message === "Customer not found") {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useKybList() {
  return useQuery({
    queryKey: customerKeys.kybList,
    queryFn: async () => mapApiKybList(await listAllKybCustomers(), kybBatchesMock),
  });
}

export function useKybDetail(customerId: string) {
  const fixture = getKybDetailById(customerId);

  return useQuery({
    queryKey: customerKeys.kybDetail(customerId),
    queryFn: async () => {
      if (fixture) {
        return fixture;
      }
      const [customer, documents, shareholders] = await Promise.all([
        getKybCustomer(customerId),
        listKybDocuments(customerId).catch(() => []),
        listKybShareholders(customerId).catch(() => []),
      ]);
      const detail = mapApiKybToDetail(customer, documents, shareholders);
      if (!detail) {
        throw new Error("Business not found");
      }
      return detail;
    },
    enabled: Boolean(customerId),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
        return false;
      }
      if (error instanceof Error && error.message === "Business not found") {
        return false;
      }
      return failureCount < 2;
    },
  });
}
