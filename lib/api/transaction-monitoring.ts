import { apiFetch, apiFetchEnvelope } from "@/lib/api/client";
import type { ApiTransaction } from "@/lib/api/types";
import { unwrapCollection } from "@/lib/api/mappers/customers";
import type { TmQueueId } from "@/types/transaction-monitoring";
import type { SarWizardState } from "@/types/sar-rationale";

export type ApiTmOverview = {
  windowStart?: string;
  windowEnd?: string;
  totalVolume?: number;
  totalValue?: number;
  activeUsers?: number;
  avgRiskScore?: number;
  highRiskAlerts?: number;
  activityChart?: Record<string, number>;
  riskDistribution?: {
    low?: number;
    medium?: number;
    high?: number;
  };
  tmConditions?: Partial<Record<TmQueueId, number>>;
  monthlyVolume?: Record<string, number>;
};

export type ApiTmQueueSummary = {
  category?: string;
  totalTransactions?: number;
  totalAmount?: number;
  pendingReview?: number;
  resolved?: number;
};

export type ApiTmQueue = {
  data: ApiTransaction[];
  summary?: ApiTmQueueSummary;
  meta?: {
    totalItems?: number;
    itemsCount?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
  };
};

export type ApiCustomerStatement = {
  data: ApiTransaction[];
  summary?: {
    currentBalance?: number;
    totalCredit?: number;
    totalDebit?: number;
    totalTransactions?: number;
    accountOpeningDate?: string;
    openingBalance?: number;
  };
  meta?: ApiTmQueue["meta"];
};

export type ResolveCasePayload = {
  resolutionType:
    | "cleared-no-issues"
    | "false-positive"
    | "escalated-to-authorities"
    | "resolved-after-contact"
    | "documentation-provided-cleared";
  outcomeSummary?: string;
  actionsTaken?: string[];
  resolutionNotes?: string;
};

export type PlacePndPayload = {
  entityType: "individual" | "business";
  fullName: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  reasonForListing: string;
  narrative?: string;
  evidenceReference?: string;
};

export type GenerateSarRationalePayload = {
  subjectFullName: string;
  entityType: "individual" | "business";
  accountNumberMasked?: string;
  totalAmount?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  activityType?: string;
  detectionDate?: string;
  activityStartDate?: string;
  activityEndDate?: string;
  filingJurisdiction?: string;
  narrative: {
    basicInformation: string;
    suspiciousIndications: string;
    detailedNarrative: string;
  };
  suspiciousActivityCategories?: string[];
  relatedTransactionIds?: string[];
};

export function buildSarRationalePayload(state: SarWizardState): GenerateSarRationalePayload {
  return {
    subjectFullName: state.basic.fullName,
    entityType: state.basic.entityType === "Organization" ? "business" : "individual",
    accountNumberMasked: state.basic.accountNumber,
    totalAmount: state.basic.amount,
    riskLevel: state.basic.riskLevel.toLowerCase() as GenerateSarRationalePayload["riskLevel"],
    activityType: state.basic.transferType,
    detectionDate: state.basic.detectionDate,
    activityStartDate: state.basic.transactionDate,
    activityEndDate: state.basic.transactionDate,
    filingJurisdiction: state.jurisdictionIds.join(","),
    narrative: {
      basicInformation: state.rationale.opening,
      suspiciousIndications: [
        ...state.redFlagIds,
        state.additionalObservations,
      ].filter(Boolean).join(", "),
      detailedNarrative: [state.rationale.activity, state.rationale.whySuspicious, state.rationale.investigation, state.rationale.summary].filter(Boolean).join("\n\n"),
    },
    suspiciousActivityCategories: state.redFlagIds,
    relatedTransactionIds: [state.basic.transactionId],
  };
}

const queuePaths: Record<TmQueueId, string> = {
  "tm-not-blocked": "tm-not-blocked",
  "stop-payment": "stop-payment",
  "cumulative-frequency": "cumulative-frequency",
  "tm-blocked": "tm-blocked",
};

function appHeaders(appId?: string): Record<string, string> | undefined {
  return appId ? { "x-app-id": appId } : undefined;
}

export function getTransactionMonitoringOverview(appId?: string) {
  return apiFetch<ApiTmOverview>("/api/v1/transaction-monitoring/overview", {
    headers: appHeaders(appId),
  });
}

export async function listTransactionMonitoringQueue(
  queueId: TmQueueId,
  query: { page?: string; limit?: string; status?: string } = {},
  appId?: string,
) {
  const envelope = await apiFetchEnvelope<ApiTransaction[]>(
    `/api/v1/transaction-monitoring/${queuePaths[queueId]}`,
    {
      query: {
        page: query.page ?? "1",
        limit: query.limit ?? "100",
        status: query.status,
      },
      headers: appHeaders(appId),
    },
  );

  return {
    data: unwrapCollection(envelope.data) as ApiTransaction[],
    summary: envelope.summary as ApiTmQueueSummary | undefined,
    meta: envelope.meta,
  } satisfies ApiTmQueue;
}

export async function getCustomerStatement(customerId: string, appId?: string) {
  const envelope = await apiFetchEnvelope<ApiTransaction[]>(
    `/api/v1/customers/${encodeURIComponent(customerId)}/statement`,
    {
      query: { page: "1", limit: "100" },
      headers: appHeaders(appId),
    },
  );

  return {
    data: unwrapCollection(envelope.data) as ApiTransaction[],
    summary: envelope.summary,
    meta: envelope.meta,
  } satisfies ApiCustomerStatement;
}

export function getTransactionCase(id: string, appId?: string) {
  return apiFetch<Record<string, unknown>>(
    `/api/v1/transactions/${encodeURIComponent(id)}/case`,
    { headers: appHeaders(appId) },
  );
}

export function resolveTransactionCase(id: string, body: ResolveCasePayload, appId?: string) {
  return apiFetch<unknown>(
    `/api/v1/transactions/${encodeURIComponent(id)}/actions/resolve-case`,
    { method: "POST", body, headers: appHeaders(appId) },
  );
}

export function escalateTransactionCase(id: string, notes: string, appId?: string) {
  return apiFetch<unknown>(
    `/api/v1/transactions/${encodeURIComponent(id)}/actions/escalate-case`,
    { method: "POST", body: { notes }, headers: appHeaders(appId) },
  );
}

export function placeTransactionPnd(id: string, body: PlacePndPayload, appId?: string) {
  return apiFetch<unknown>(
    `/api/v1/transactions/${encodeURIComponent(id)}/actions/place-pnd`,
    { method: "POST", body, headers: appHeaders(appId) },
  );
}

export function generateTransactionSarRationale(id: string, body: GenerateSarRationalePayload, appId?: string) {
  return apiFetch<unknown>(
    `/api/v1/transactions/${encodeURIComponent(id)}/sar-rationale`,
    { method: "POST", body, headers: appHeaders(appId) },
  );
}