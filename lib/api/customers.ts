import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { unwrapCollection } from "@/lib/api/mappers/customers";
import type {
  ApiCustomerCreateResult,
  ApiCustomerListQuery,
  ApiCustomerListStats,
  CreateTenantKybDocumentDto,
  CreateTenantKybDto,
  CreateTenantKybShareholderDto,
  CreateTenantKycDocumentDto,
  CreateTenantKycDto,
  DeclareAccountPurposeDto,
  SetCustomerFlagStatusDto,
} from "@/lib/api/types";

const DEFAULT_LIST_QUERY: ApiCustomerListQuery = {
  page: "1",
  limit: "100",
};

async function listAllCustomers(path: "/api/v1/customers/kyc" | "/api/v1/customers/kyb") {
  const first = await apiFetchEnvelope<unknown>(path, { query: DEFAULT_LIST_QUERY });
  const items = unwrapCollection(first.data);
  const totalPages = Math.min(first.meta?.totalPages ?? 1, 20);

  for (let page = 2; page <= totalPages; page += 1) {
    const next = await apiFetchEnvelope<unknown>(path, {
      query: { ...DEFAULT_LIST_QUERY, page: String(page) },
    });
    items.push(...unwrapCollection(next.data));
  }

  return items;
}

export function createKycCustomer(body: CreateTenantKycDto) {
  return apiFetch<ApiCustomerCreateResult>("/api/v1/customers/kyc", {
    method: "POST",
    body,
  });
}

export function createKycDocument(customerId: string, body: CreateTenantKycDocumentDto) {
  return apiFetch<unknown>(`/api/v1/customers/kyc/${customerId}/documents`, {
    method: "POST",
    body,
  });
}

export function createKybCustomer(body: CreateTenantKybDto) {
  return apiFetch<ApiCustomerCreateResult>("/api/v1/customers/kyb", {
    method: "POST",
    body,
  });
}

export function createKybDocument(customerId: string, body: CreateTenantKybDocumentDto) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}/documents`, {
    method: "POST",
    body,
  });
}

export function updateKybDocument(
  customerId: string,
  documentId: string,
  body: CreateTenantKybDocumentDto,
  appId?: string,
) {
  return apiFetch<unknown>(
    `/api/v1/customers/kyb/${customerId}/documents/${encodeURIComponent(documentId)}`,
    {
      method: "PUT",
      body,
      headers: appId ? { "x-app-id": appId } : undefined,
    },
  );
}

export function listKycCustomers(query: ApiCustomerListQuery = DEFAULT_LIST_QUERY) {
  return apiFetch<unknown>("/api/v1/customers/kyc", { query });
}

export function listAllKycCustomers() {
  return listAllCustomers("/api/v1/customers/kyc");
}

export function getKycCustomer(customerId: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyc/${customerId}`);
}

export function offboardKycCustomer(customerId: string, reason?: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyc/${customerId}`, {
    method: "DELETE",
    body: reason ? { reason } : undefined,
  });
}

export function listKycDocuments(customerId: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyc/${customerId}/documents`);
}

export function getKycCustomerStats(appId?: string) {
  return apiFetch<ApiCustomerListStats>("/api/v1/customers/kyc/stats", {
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}

export function listKybCustomers(query: ApiCustomerListQuery = DEFAULT_LIST_QUERY) {
  return apiFetch<unknown>("/api/v1/customers/kyb", { query });
}

export function listAllKybCustomers() {
  return listAllCustomers("/api/v1/customers/kyb");
}

export function getKybCustomer(customerId: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}`);
}

export function offboardKybCustomer(customerId: string, reason?: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}`, {
    method: "DELETE",
    body: reason ? { reason } : undefined,
  });
}

export function listKybDocuments(customerId: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}/documents`);
}

export function listKybShareholders(customerId: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}/shareholders`);
}

export function createKybShareholder(customerId: string, body: CreateTenantKybShareholderDto, appId?: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}/shareholders`, {
    method: "POST",
    body,
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}

export function updateKybShareholder(
  customerId: string,
  shareholderId: string,
  body: CreateTenantKybShareholderDto,
  appId?: string,
) {
  return apiFetch<unknown>(
    `/api/v1/customers/kyb/${customerId}/shareholders/${encodeURIComponent(shareholderId)}`,
    {
      method: "PUT",
      body,
      headers: appId ? { "x-app-id": appId } : undefined,
    },
  );
}

export function getKycDocumentRequirements(customerId: string, appId?: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyc/${customerId}/documents/requirements`, {
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}

export function getKybDocumentRequirements(customerId: string, appId?: string) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}/documents/requirements`, {
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}

export function patchKycFlagStatus(
  customerId: string,
  flagId: string,
  body: SetCustomerFlagStatusDto,
  appId?: string,
) {
  return apiFetch<unknown>(
    `/api/v1/customers/kyc/${customerId}/flags/${encodeURIComponent(flagId)}`,
    {
      method: "PATCH",
      body,
      headers: appId ? { "x-app-id": appId } : undefined,
    },
  );
}

export function patchKybFlagStatus(
  customerId: string,
  flagId: string,
  body: SetCustomerFlagStatusDto,
  appId?: string,
) {
  return apiFetch<unknown>(
    `/api/v1/customers/kyb/${customerId}/flags/${encodeURIComponent(flagId)}`,
    {
      method: "PATCH",
      body,
      headers: appId ? { "x-app-id": appId } : undefined,
    },
  );
}

export function getKybCustomerStats(appId?: string) {
  return apiFetch<ApiCustomerListStats>("/api/v1/customers/kyb/stats", {
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}

async function getAccountPurpose(path: string) {
  try {
    return await apiFetch<unknown>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function getKycAccountPurpose(customerId: string) {
  return getAccountPurpose(`/api/v1/customers/kyc/${customerId}/account-purpose`);
}

export function putKycAccountPurpose(customerId: string, body: DeclareAccountPurposeDto) {
  return apiFetch<unknown>(`/api/v1/customers/kyc/${customerId}/account-purpose`, {
    method: "PUT",
    body,
  });
}

export function getKybAccountPurpose(customerId: string) {
  return getAccountPurpose(`/api/v1/customers/kyb/${customerId}/account-purpose`);
}

export function putKybAccountPurpose(customerId: string, body: DeclareAccountPurposeDto) {
  return apiFetch<unknown>(`/api/v1/customers/kyb/${customerId}/account-purpose`, {
    method: "PUT",
    body,
  });
}

export function extractCustomerId(result: ApiCustomerCreateResult | null | undefined): string | null {
  if (!result || typeof result !== "object") {
    return null;
  }
  if (typeof result.id === "string" && result.id) {
    return result.id;
  }
  if (typeof result.customerId === "string" && result.customerId) {
    return result.customerId;
  }
  return null;
}
