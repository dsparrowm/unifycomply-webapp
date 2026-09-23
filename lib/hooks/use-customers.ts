"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getKybCustomer,
  getKybCustomerStats,
  getKycCustomer,
  getKycCustomerStats,
} from "@/lib/api/customers";
import { ApiError } from "@/lib/api/errors";
import { mapApiKybToDetail, mapApiKycToDetail } from "@/lib/api/mappers/customers";
import {
  buildWorkflowOnlyKycDetail,
  buildWorkflowOnlyKybDetail,
  mapKycAmlScreeningTab,
  mapKycDeviceInformationTab,
  mapKycLivenessTab,
  mapKybComplianceChecksTab,
  mapKybDirectorsOfficersTab,
  mapKybDocumentsTab,
  mapKybShareholdersTab,
  mergeKybDetailWithBusinessOverview,
  mergeKycDetailWithDocumentsTab,
  mergeKycDetailWithRiskScoreTab,
  mapRiskScoreTab,
} from "@/lib/api/mappers/verification-detail-tabs";
import {
  mapApiKybVerificationList,
  mapApiKycVerificationList,
} from "@/lib/api/mappers/verifications";
import {
  getKycAmlScreening,
  getKycDeviceInformation,
  getKycLiveness,
  getKybBusinessOverview,
  getKybComplianceChecks,
  getKybDirectorsOfficers,
  getKybShareholdersTab,
  getKybVerificationDocuments,
  getKybVerificationRiskScore,
  getKycVerificationDocuments,
  getKycVerificationRiskScore,
  getVerification,
  listAllKybVerifications,
  listAllKycVerifications,
} from "@/lib/api/verifications";
import { kybBatchesMock } from "@/lib/data/kyb-batches";
import { getKybDetailById } from "@/lib/data/kyb-detail";
import { getKycDetailById } from "@/lib/data/kyc-detail";
import { useSettingsAppSelection } from "@/lib/hooks/use-tenant-apps";
import type { KycDetail } from "@/types/kyc";
import type { KybDetail } from "@/types/kyb";

export const customerKeys = {
  kycListRoot: ["customers", "kyc", "queue"] as const,
  kycList: (appId: string | null) => [...customerKeys.kycListRoot, appId ?? "default"] as const,
  kycDetail: (id: string, workflowId?: string | null) =>
    ["customers", "kyc", id, workflowId ?? "none"] as const,
  kycDocumentsTab: (workflowId: string) =>
    ["verifications", "kyc", workflowId, "documents"] as const,
  kycRiskTab: (workflowId: string) => ["verifications", "kyc", workflowId, "risk-score"] as const,
  kycAmlTab: (workflowId: string) =>
    ["verifications", "kyc", workflowId, "aml-screening"] as const,
  kycDeviceTab: (workflowId: string) =>
    ["verifications", "kyc", workflowId, "device-information"] as const,
  kycLivenessTab: (workflowId: string) =>
    ["verifications", "kyc", workflowId, "liveness"] as const,
  kybListRoot: ["customers", "kyb", "queue"] as const,
  kybList: (appId: string | null) => [...customerKeys.kybListRoot, appId ?? "default"] as const,
  kybDetail: (id: string, workflowId?: string | null) =>
    ["customers", "kyb", id, workflowId ?? "none"] as const,
  kybDocumentsTab: (workflowId: string) =>
    ["verifications", "kyb", workflowId, "document"] as const,
  kybRiskTab: (workflowId: string) => ["verifications", "kyb", workflowId, "risk-score"] as const,
  kybOverviewTab: (workflowId: string) =>
    ["verifications", "kyb", workflowId, "business-overview"] as const,
  kybDirectorsTab: (workflowId: string) =>
    ["verifications", "kyb", workflowId, "directors-officers"] as const,
  kybShareholdersTab: (workflowId: string) =>
    ["verifications", "kyb", workflowId, "shareholders"] as const,
  kybComplianceTab: (workflowId: string) =>
    ["verifications", "kyb", workflowId, "compliance-checks"] as const,
};

function isMissingCustomerError(error: unknown) {
  return error instanceof ApiError && (error.status === 404 || error.status === 403 || error.status === 502);
}

async function resolveKycDetail(routeId: string, workflowIdHint: string | undefined, appId?: string) {
  const fixture = getKycDetailById(routeId);
  if (fixture) {
    return fixture;
  }

  let workflowId = workflowIdHint;
  let detail: KycDetail | null = null;

  try {
    const customer = await getKycCustomer(routeId);
    detail = mapApiKycToDetail(customer, []);
  } catch (error) {
    if (!isMissingCustomerError(error)) {
      throw error;
    }
    // routeId may be a workflow id (legacy null-enrichment queue rows).
    workflowId = workflowId ?? routeId;
  }

  if (!workflowId && !detail) {
    throw new Error("Customer not found");
  }

  if (!workflowId) {
    return detail!;
  }

  if (detail) {
    return {
      ...detail,
      workflowId,
      riskAnalysis: null,
      amlScreening: null,
      ipDevice: null,
      liveness: null,
      documentViews: [],
      timeline: [],
      availability: {
        ...detail.availability,
        documentPreview: false,
        ocr: false,
        biometric: false,
        ipDevice: false,
        liveness: false,
        amlScreening: false,
        riskAnalysis: false,
      },
    };
  }

  const verification = await getVerification(workflowId, appId).catch(() => null);
  const workflow = verification?.workflow;
  return buildWorkflowOnlyKycDetail({
    workflowId,
    displayId: workflow?.id?.slice(-6).toUpperCase(),
    customerName: undefined,
    riskScore: workflow?.riskScore ?? 0,
    documentType: Array.isArray(workflow?.verificationTypes)
      ? workflow.verificationTypes.join(" + ")
      : workflow?.verificationType,
  });
}

async function resolveKybDetail(routeId: string, workflowIdHint: string | undefined, appId?: string) {
  const fixture = getKybDetailById(routeId);
  if (fixture) {
    return fixture;
  }

  let workflowId = workflowIdHint;
  let detail: KybDetail | null = null;

  try {
    const customer = await getKybCustomer(routeId);
    detail = mapApiKybToDetail(customer, [], []);
  } catch (error) {
    if (!isMissingCustomerError(error)) {
      throw error;
    }
    // routeId may be a workflow id (legacy null-enrichment queue rows).
    workflowId = workflowId ?? routeId;
  }

  if (!workflowId && !detail) {
    throw new Error("Business not found");
  }

  if (!workflowId) {
    // Customer-only detail (no verification run): keep roster fields; tab APIs need a workflow.
    return detail!;
  }

  if (detail) {
    // Live verification tabs fill these lazily — drop mock roster filler from buildKybDetailFromRecord.
    detail = {
      ...detail,
      workflowId,
      directors: null,
      complianceChecks: null,
      riskAnalysis: null,
      riskAnalysisAvailable: false,
      shareholders: { sectionStatus: "Pending", shareholders: [] },
      documents: { sectionStatus: "Pending", documents: [] },
    };
    return detail;
  }

  const verification = await getVerification(workflowId, appId).catch(() => null);
  const workflow = verification?.workflow;
  return buildWorkflowOnlyKybDetail({
    workflowId,
    displayId: workflow?.id?.slice(-6).toUpperCase(),
    riskScore: workflow?.riskScore ?? 0,
  });
}

export function useKycList() {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycList(selectedAppId),
    queryFn: async () => {
      const appId = selectedAppId ?? undefined;
      const [rows, stats] = await Promise.all([
        listAllKycVerifications(appId),
        getKycCustomerStats(appId).catch(() => null),
      ]);
      return mapApiKycVerificationList(rows, stats);
    },
  });
}

export function useKycDetail(routeId: string, workflowId?: string | null) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycDetail(routeId, workflowId),
    queryFn: () => resolveKycDetail(routeId, workflowId ?? undefined, selectedAppId ?? undefined),
    enabled: Boolean(routeId),
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

export function useKycVerificationRiskScore(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycRiskTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKycVerificationRiskScore(workflowId!, selectedAppId ?? undefined);
      return mapRiskScoreTab(tab, "customer");
    },
  });
}

export function useKycVerificationDocumentsTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycDocumentsTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: () => getKycVerificationDocuments(workflowId!, selectedAppId ?? undefined),
  });
}

export function useKycAmlScreeningTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycAmlTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKycAmlScreening(workflowId!, selectedAppId ?? undefined);
      return mapKycAmlScreeningTab(tab);
    },
  });
}

export function useKycDeviceInformationTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycDeviceTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKycDeviceInformation(workflowId!, selectedAppId ?? undefined);
      return mapKycDeviceInformationTab(tab);
    },
  });
}

export function useKycLivenessTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kycLivenessTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKycLiveness(workflowId!, selectedAppId ?? undefined);
      return mapKycLivenessTab(tab);
    },
  });
}

export function useKybList() {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybList(selectedAppId),
    queryFn: async () => {
      const appId = selectedAppId ?? undefined;
      const [rows, stats] = await Promise.all([
        listAllKybVerifications(appId),
        getKybCustomerStats(appId).catch(() => null),
      ]);
      return mapApiKybVerificationList(rows, kybBatchesMock, stats);
    },
  });
}

export function useKybDetail(routeId: string, workflowId?: string | null) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybDetail(routeId, workflowId),
    queryFn: () => resolveKybDetail(routeId, workflowId ?? undefined, selectedAppId ?? undefined),
    enabled: Boolean(routeId),
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

export function useKybVerificationRiskScore(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybRiskTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKybVerificationRiskScore(workflowId!, selectedAppId ?? undefined);
      return mapRiskScoreTab(tab, "business");
    },
  });
}

export function useKybBusinessOverviewTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybOverviewTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: () => getKybBusinessOverview(workflowId!, selectedAppId ?? undefined),
  });
}

export function useKybVerificationDocumentsTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybDocumentsTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKybVerificationDocuments(workflowId!, selectedAppId ?? undefined);
      return mapKybDocumentsTab(tab);
    },
  });
}

export function useKybDirectorsOfficersTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybDirectorsTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKybDirectorsOfficers(workflowId!, selectedAppId ?? undefined);
      return mapKybDirectorsOfficersTab(tab);
    },
  });
}

export function useKybShareholdersTabQuery(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybShareholdersTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKybShareholdersTab(workflowId!, selectedAppId ?? undefined);
      return mapKybShareholdersTab(tab);
    },
  });
}

export function useKybComplianceChecksTab(workflowId: string | undefined, enabled: boolean) {
  const { selectedAppId } = useSettingsAppSelection();

  return useQuery({
    queryKey: customerKeys.kybComplianceTab(workflowId ?? "none"),
    enabled: Boolean(workflowId) && enabled,
    queryFn: async () => {
      const tab = await getKybComplianceChecks(workflowId!, selectedAppId ?? undefined);
      return mapKybComplianceChecksTab(tab);
    },
  });
}

export {
  mergeKycDetailWithRiskScoreTab,
  mergeKycDetailWithDocumentsTab,
  mergeKybDetailWithBusinessOverview,
};
