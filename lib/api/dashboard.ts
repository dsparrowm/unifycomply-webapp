import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import { unwrapCollection } from "@/lib/api/mappers/customers";

export type ApiDashboardSummary = {
  total?: number;
  successRate?: number;
  failureRate?: number;
  pendingReviewRate?: number;
};

export type ApiDashboardActivity = {
  id?: string;
  event?: string;
  action?: string;
  message?: string;
  user?: string;
  actor?: string;
  customerName?: string;
  createdAt?: string;
  timestamp?: string;
  status?: string;
};

export type ApiDashboardVerificationType = {
  type?: string;
  label?: string;
  count?: number;
  percentage?: number;
};

export type ApiDashboardCallPoint = {
  month?: string | number;
  label?: string | number;
  successful?: number;
  success?: number;
  failed?: number;
  errors?: number;
};

export async function getDashboardSummary() {
  return apiFetch<ApiDashboardSummary>("/api/v1/dashboard/summary");
}

export async function getDashboardHighRiskAlerts() {
  return apiFetchEnvelope<unknown>("/api/v1/dashboard/high-risk-alerts", {
    query: { page: "1", limit: "1" },
  });
}

export async function getDashboardActivity() {
  const response = await apiFetchEnvelope<unknown>("/api/v1/dashboard/activity", {
    query: { page: "1", limit: "5" },
  });
  return unwrapCollection(response.data) as ApiDashboardActivity[];
}

export async function getDashboardVerificationTypes() {
  return apiFetch<ApiDashboardVerificationType[]>("/api/v1/dashboard/verification-types");
}

export async function getDashboardApiCalls(year = String(new Date().getFullYear())) {
  return apiFetch<ApiDashboardCallPoint[]>("/api/v1/dashboard/api-calls", {
    query: { year },
  });
}