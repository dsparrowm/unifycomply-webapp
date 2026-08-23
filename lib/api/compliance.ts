import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import type {
  ApiAvailableChecks,
  ApiComplianceDocument,
  ApiKybCustomer,
  ApiKybShareholder,
  ApiKycCustomer,
  ApiPageMeta,
  ApiVerificationDetail,
  ApiVerificationStart,
  ApiVerificationWorkflow,
  CreateComplianceDocumentDto,
  CreateKybCustomerDto,
  CreateKycCustomerDto,
  StartVerificationDto,
} from "@/lib/api/types";

export type PagedResult<T> = {
  items: T;
  meta?: ApiPageMeta;
};

function pageQuery(page?: number, limit?: number) {
  return {
    page: page ? String(page) : undefined,
    limit: limit ? String(limit) : undefined,
  };
}

export async function listKycCustomers(page = 1, limit = 50): Promise<PagedResult<ApiKycCustomer[]>> {
  const envelope = await apiFetchEnvelope<ApiKycCustomer[]>("/api/v1/customers/kyc", {
    query: pageQuery(page, limit),
  });
  return { items: envelope.data ?? [], meta: envelope.meta };
}

export async function getKycCustomer(customerId: string) {
  return apiFetch<ApiKycCustomer>(`/api/v1/customers/kyc/${customerId}`);
}

export async function createKycCustomer(dto: CreateKycCustomerDto) {
  return apiFetch<ApiKycCustomer>("/api/v1/customers/kyc", { method: "POST", body: dto });
}

export async function listKycDocuments(customerId: string) {
  return apiFetch<ApiComplianceDocument[]>(`/api/v1/customers/kyc/${customerId}/documents`);
}

export async function createKycDocument(customerId: string, dto: CreateComplianceDocumentDto) {
  return apiFetch<ApiComplianceDocument>(`/api/v1/customers/kyc/${customerId}/documents`, {
    method: "POST",
    body: dto,
  });
}

export async function updateKycDocument(
  customerId: string,
  documentId: string,
  dto: CreateComplianceDocumentDto,
) {
  return apiFetch<ApiComplianceDocument>(`/api/v1/customers/kyc/${customerId}/documents/${documentId}`, {
    method: "PUT",
    body: dto,
  });
}

export async function listKybCustomers(page = 1, limit = 50): Promise<PagedResult<ApiKybCustomer[]>> {
  const envelope = await apiFetchEnvelope<ApiKybCustomer[]>("/api/v1/customers/kyb", {
    query: pageQuery(page, limit),
  });
  return { items: envelope.data ?? [], meta: envelope.meta };
}

export async function getKybCustomer(customerId: string) {
  return apiFetch<ApiKybCustomer>(`/api/v1/customers/kyb/${customerId}`);
}

export async function createKybCustomer(dto: CreateKybCustomerDto) {
  return apiFetch<ApiKybCustomer>("/api/v1/customers/kyb", { method: "POST", body: dto });
}

export async function listKybDocuments(customerId: string) {
  return apiFetch<ApiComplianceDocument[]>(`/api/v1/customers/kyb/${customerId}/documents`);
}

export async function createKybDocument(customerId: string, dto: CreateComplianceDocumentDto) {
  return apiFetch<ApiComplianceDocument>(`/api/v1/customers/kyb/${customerId}/documents`, {
    method: "POST",
    body: dto,
  });
}

export async function listKybShareholders(customerId: string) {
  return apiFetch<ApiKybShareholder[]>(`/api/v1/customers/kyb/${customerId}/shareholders`);
}

export async function getAvailableChecks(
  countryCode: string,
  profileType: "individual" | "business",
) {
  return apiFetch<ApiAvailableChecks>("/api/v1/verifications/available-checks", {
    query: { countryCode, profileType },
  });
}

export async function startKycVerification(dto: StartVerificationDto) {
  return apiFetch<ApiVerificationStart>("/api/v1/verifications/kyc", { method: "POST", body: dto });
}

export async function startKybVerification(dto: StartVerificationDto) {
  return apiFetch<ApiVerificationStart>("/api/v1/verifications/kyb", { method: "POST", body: dto });
}

export async function listVerifications(filters?: {
  profileType?: "individual" | "business";
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PagedResult<ApiVerificationWorkflow[]>> {
  const envelope = await apiFetchEnvelope<ApiVerificationWorkflow[]>("/api/v1/verifications", {
    query: {
      ...pageQuery(filters?.page, filters?.limit),
      profileType: filters?.profileType,
      status: filters?.status,
    },
  });
  return { items: envelope.data ?? [], meta: envelope.meta };
}

export async function getVerification(workflowId: string) {
  return apiFetch<ApiVerificationDetail>(`/api/v1/verifications/${workflowId}`);
}

export async function findVerificationForCustomer(customerId: string) {
  const { items } = await listVerifications({ profileType: "individual", limit: 40 });
  const details = await Promise.all(items.map((workflow) => getVerification(workflow.id).catch(() => null)));
  return (
    details.find((detail) => {
      if (!detail) return false;
      if (detail.run?.run.customerId === customerId) return true;
      return detail.events?.some((event) => event.detail?.customerId === customerId) ?? false;
    }) ?? null
  );
}

export function workflowIdFromStart(started: ApiVerificationStart) {
  return started.workflow?.id ?? started.workflowId ?? started.id ?? started.run?.run.workflowId;
}
