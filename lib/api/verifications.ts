import { apiFetch } from "@/lib/api/client";
import type {
  ApiAvailableChecks,
  ApiProfileType,
  StartKybVerificationDto,
  StartKycVerificationDto,
} from "@/lib/api/types";

export function getAvailableChecks(countryCode: string, profileType: ApiProfileType) {
  return apiFetch<ApiAvailableChecks>("/api/v1/verifications/available-checks", {
    query: { countryCode, profileType },
  });
}

export function startKycVerification(body: StartKycVerificationDto, appId?: string) {
  return apiFetch<unknown>("/api/v1/verifications/kyc", {
    method: "POST",
    body,
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}

export function startKybVerification(body: StartKybVerificationDto, appId?: string) {
  return apiFetch<unknown>("/api/v1/verifications/kyb", {
    method: "POST",
    body,
    headers: appId ? { "x-app-id": appId } : undefined,
  });
}
