import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import type {
  ApiCreateTransactionDto,
  ApiTransaction,
  ApiTransactionDetail,
  ApiTransactionListQuery,
} from "@/lib/api/types";
import { unwrapCollection } from "@/lib/api/mappers/customers";

function appHeaders(appId?: string): Record<string, string> | undefined {
  return appId ? { "x-app-id": appId } : undefined;
}

export async function listTransactions(query: ApiTransactionListQuery = {}, appId?: string) {
  const envelope = await apiFetchEnvelope<unknown>("/api/v1/transactions", {
    query: {
      page: query.page ?? "1",
      limit: query.limit ?? "100",
      customerId: query.customerId,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    },
    headers: appHeaders(appId),
  });

  return {
    items: unwrapCollection(envelope.data) as ApiTransaction[],
    meta: envelope.meta,
  };
}

export function getTransaction(id: string, appId?: string) {
  return apiFetch<ApiTransaction>(`/api/v1/transactions/${encodeURIComponent(id)}`, {
    headers: appHeaders(appId),
  });
}

export function getTransactionDetail(id: string, appId?: string) {
  return apiFetch<ApiTransactionDetail>(
    `/api/v1/transactions/${encodeURIComponent(id)}/detail`,
    { headers: appHeaders(appId) },
  );
}

export function createTransaction(body: ApiCreateTransactionDto, appId?: string) {
  return apiFetch<ApiTransaction>("/api/v1/transactions", {
    method: "POST",
    body,
    headers: appHeaders(appId),
  });
}
