import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { unwrapCollection } from "@/lib/api/mappers/customers";
import type {
  ApiAvailableChecks,
  ApiKycAmlScreeningTab,
  ApiKycDeviceInformationTab,
  ApiKycLivenessTab,
  ApiKycVerificationDocumentsTab,
  ApiKybBusinessOverviewTab,
  ApiKybComplianceChecksTab,
  ApiKybDirectorsOfficersTab,
  ApiKybShareholdersTab,
  ApiKybVerificationDocumentTab,
  ApiProfileType,
  ApiVerificationDetail,
  ApiVerificationListQuery,
  ApiVerificationRiskScoreTab,
  StartKybVerificationDto,
  StartKycVerificationDto,
} from "@/lib/api/types";

const DEFAULT_QUEUE_QUERY: ApiVerificationListQuery = {
  page: "1",
  limit: "100",
};

function appHeaders(appId?: string): Record<string, string> | undefined {
  return appId ? { "x-app-id": appId } : undefined;
}

async function listAllVerificationRows(
  path: "/api/v1/verifications/kyc" | "/api/v1/verifications/kyb",
  appId?: string,
) {
  const first = await apiFetchEnvelope<unknown>(path, {
    query: DEFAULT_QUEUE_QUERY,
    headers: appHeaders(appId),
  });
  const items = unwrapCollection(first.data);
  const totalPages = Math.min(first.meta?.totalPages ?? 1, 20);

  for (let page = 2; page <= totalPages; page += 1) {
    const next = await apiFetchEnvelope<unknown>(path, {
      query: { ...DEFAULT_QUEUE_QUERY, page: String(page) },
      headers: appHeaders(appId),
    });
    items.push(...unwrapCollection(next.data));
  }

  return items;
}

export function getAvailableChecks(countryCode: string, profileType: ApiProfileType) {
  return apiFetch<ApiAvailableChecks>("/api/v1/verifications/available-checks", {
    query: { countryCode, profileType },
  });
}

export function startKycVerification(body: StartKycVerificationDto, appId?: string) {
  return apiFetch<unknown>("/api/v1/verifications/kyc", {
    method: "POST",
    body,
    headers: appHeaders(appId),
  });
}

export function startKybVerification(body: StartKybVerificationDto, appId?: string) {
  return apiFetch<unknown>("/api/v1/verifications/kyb", {
    method: "POST",
    body,
    headers: appHeaders(appId),
  });
}

export function listAllKycVerifications(appId?: string) {
  return listAllVerificationRows("/api/v1/verifications/kyc", appId);
}

export function listAllKybVerifications(appId?: string) {
  return listAllVerificationRows("/api/v1/verifications/kyb", appId);
}

export function getVerification(workflowId: string, appId?: string) {
  return apiFetch<ApiVerificationDetail>(`/api/v1/verifications/${workflowId}`, {
    headers: appHeaders(appId),
  });
}

export function getKycVerificationDocuments(workflowId: string, appId?: string) {
  return apiFetch<ApiKycVerificationDocumentsTab>(
    `/api/v1/verifications/kyc/${workflowId}/documents`,
    { headers: appHeaders(appId) },
  );
}

export function getKycVerificationRiskScore(workflowId: string, appId?: string) {
  return apiFetch<ApiVerificationRiskScoreTab>(
    `/api/v1/verifications/kyc/${workflowId}/risk-score`,
    { headers: appHeaders(appId) },
  );
}

export function getKycAmlScreening(workflowId: string, appId?: string) {
  return apiFetch<ApiKycAmlScreeningTab>(
    `/api/v1/verifications/kyc/${workflowId}/aml-screening`,
    { headers: appHeaders(appId) },
  );
}

export function getKycDeviceInformation(workflowId: string, appId?: string) {
  return apiFetch<ApiKycDeviceInformationTab>(
    `/api/v1/verifications/kyc/${workflowId}/device-information`,
    { headers: appHeaders(appId) },
  );
}

export function getKycLiveness(workflowId: string, appId?: string) {
  return apiFetch<ApiKycLivenessTab>(
    `/api/v1/verifications/kyc/${workflowId}/liveness`,
    { headers: appHeaders(appId) },
  );
}

export function getKybVerificationDocuments(workflowId: string, appId?: string) {
  return apiFetch<ApiKybVerificationDocumentTab>(
    `/api/v1/verifications/kyb/${workflowId}/document`,
    { headers: appHeaders(appId) },
  );
}

export function getKybVerificationRiskScore(workflowId: string, appId?: string) {
  return apiFetch<ApiVerificationRiskScoreTab>(
    `/api/v1/verifications/kyb/${workflowId}/risk-score`,
    { headers: appHeaders(appId) },
  );
}

export function getKybBusinessOverview(workflowId: string, appId?: string) {
  return apiFetch<ApiKybBusinessOverviewTab>(
    `/api/v1/verifications/kyb/${workflowId}/business-overview`,
    { headers: appHeaders(appId) },
  );
}

export function getKybDirectorsOfficers(workflowId: string, appId?: string) {
  return apiFetch<ApiKybDirectorsOfficersTab>(
    `/api/v1/verifications/kyb/${workflowId}/directors-officers`,
    { headers: appHeaders(appId) },
  );
}

export function getKybShareholdersTab(workflowId: string, appId?: string) {
  return apiFetch<ApiKybShareholdersTab>(
    `/api/v1/verifications/kyb/${workflowId}/shareholders`,
    { headers: appHeaders(appId) },
  );
}

export function getKybComplianceChecks(workflowId: string, appId?: string) {
  return apiFetch<ApiKybComplianceChecksTab>(
    `/api/v1/verifications/kyb/${workflowId}/compliance-checks`,
    { headers: appHeaders(appId) },
  );
}
