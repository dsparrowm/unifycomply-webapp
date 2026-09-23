import { countryLabelFromCode } from "@/lib/api/mappers/onboarding";
import { clampRiskScore } from "@/lib/kyc/risk-score";
import type { ApiAvailableCheck, ApiAvailableChecks, ApiCustomerListStats } from "@/lib/api/types";
import type { KycListData, KycMetric, KycPriority, KycRecord, KycVerificationStatus } from "@/types/kyc";
import type { KybListData, KybRecord, KybVerificationType } from "@/types/kyb";
import type { VerificationCheckOption } from "@/types/verification";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function humanizeLabel(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function humanizeProvider(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function preferredProvider(providers: string[]): string {
  return providers.find((provider) => provider.startsWith("sandbox")) ?? providers[0] ?? "";
}

export function mapAvailableChecks(data: ApiAvailableChecks | null | undefined): VerificationCheckOption[] {
  const checks = data?.checks ?? [];
  return checks.map((check: ApiAvailableCheck) => ({
    type: check.type,
    label: check.label,
    authority: check.authority,
    providers: check.eligibleProviders.map((provider) => ({
      value: provider,
      label: humanizeProvider(provider),
    })),
  }));
}

export function defaultProviderForCheck(check: VerificationCheckOption): string {
  return preferredProvider(check.providers.map((provider) => provider.value));
}

function displayCode(prefix: string, id: string, preferred?: string): string {
  if (preferred) {
    return preferred;
  }
  const short = id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() || "000000";
  return `${prefix}-${short}`;
}

/** Workflow statuses from core-platform → Figma list badges. */
function mapWorkflowStatus(value: unknown): KycVerificationStatus {
  const status = asString(value)?.toLowerCase().replace(/_/g, "-");
  if (
    status === "verified" ||
    status === "onboarded" ||
    status === "approved" ||
    status === "passed" ||
    status === "success"
  ) {
    return "approved";
  }
  if (status === "in-review" || status === "review" || status === "review-required") {
    return "in-review";
  }
  if (status === "processing" || status === "running" || status === "queued") {
    return "pending";
  }
  if (
    status === "failed" ||
    status === "rejected" ||
    status === "blocked" ||
    status === "offboarded"
  ) {
    return "rejected";
  }
  if (status === "escalated") {
    return "escalated";
  }
  if (status === "resubmission" || status === "resubmitted") {
    return "resubmission";
  }
  return "pending";
}

function mapPriority(value: unknown, riskScore: number): KycPriority {
  const priority = asString(value)?.toLowerCase();
  if (priority === "critical" || priority === "urgent") {
    return "critical";
  }
  if (priority === "high") {
    return "high";
  }
  if (priority === "medium") {
    return "medium";
  }
  if (priority === "low" || priority === "standard") {
    return "low";
  }
  if (riskScore >= 4) {
    return "critical";
  }
  if (riskScore >= 3) {
    return "high";
  }
  if (riskScore >= 2) {
    return "medium";
  }
  return "low";
}

function mapRiskScore(record: Record<string, unknown>): number {
  const nestedRisk = isRecord(record.risk) ? record.risk : null;
  const raw =
    asNumber(record.riskScore) ??
    asNumber(record.riskLevel) ??
    (nestedRisk ? asNumber(nestedRisk.score) : undefined);
  return clampRiskScore(raw ?? 0);
}

function mapAssignedTo(record: Record<string, unknown>): string | null {
  const direct = asString(record.assignedTo) ?? asString(record.assignee);
  if (direct && direct.toLowerCase() !== "unassigned") {
    return direct;
  }
  if (isRecord(record.assignedTo)) {
    const nestedName =
      asString(record.assignedTo.fullName) ??
      asString(record.assignedTo.name) ??
      [asString(record.assignedTo.firstName), asString(record.assignedTo.lastName)]
        .filter(Boolean)
        .join(" ")
        .trim();
    return nestedName || null;
  }
  return null;
}

function formatTimeInQueueMs(ms: number | undefined): string | null {
  if (ms === undefined || !Number.isFinite(ms) || ms < 0) {
    return null;
  }
  const minutes = Math.floor(ms / 60000);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ${minutes % 60}m`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

function formatTimeInQueueFromIso(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return "—";
  }
  return formatTimeInQueueMs(Date.now() - then.getTime()) ?? "—";
}

function formatSubmittedAt(iso: string | undefined): string {
  if (!iso) {
    return "";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toISOString().slice(0, 10);
}

function mapCountry(record: Record<string, unknown>): string {
  const direct = asString(record.country);
  if (direct && direct.length > 2) {
    return direct;
  }
  const code = asString(record.countryCode) ?? (direct && direct.length === 2 ? direct : undefined);
  if (code) {
    return countryLabelFromCode(code) ?? code;
  }
  return "—";
}

function documentTypeFromRow(record: Record<string, unknown>): string {
  const labeled = asString(record.documentType);
  if (labeled) {
    return labeled;
  }
  const types = Array.isArray(record.verificationTypes)
    ? record.verificationTypes.filter((item): item is string => typeof item === "string")
    : [];
  const singular = asString(record.verificationType);
  const values = types.length > 0 ? types : singular ? [singular] : [];
  if (values.length === 0) {
    return "—";
  }
  return values.map(humanizeLabel).join(" + ");
}

function kybVerificationType(record: Record<string, unknown>): KybVerificationType {
  const labeled = asString(record.documentType)?.toLowerCase() ?? "";
  const joined = [
    labeled,
    asString(record.verificationType)?.toLowerCase() ?? "",
    ...(Array.isArray(record.verificationTypes)
      ? record.verificationTypes.map((item) => String(item).toLowerCase())
      : []),
  ].join(" ");

  if (joined.includes("tin") || joined.includes("tax")) {
    return "TIN";
  }
  if (joined.includes("memorandum") || joined.includes("constitutional")) {
    return "Memorandum";
  }
  if (joined.includes("due-diligence") || joined.includes("due diligence")) {
    return "Due Diligence";
  }
  if (joined.includes("scuml") || joined.includes("licence") || joined.includes("license")) {
    return "SCUML";
  }
  return "CAC";
}

function unwrapRow(item: unknown): Record<string, unknown> | null {
  if (!isRecord(item)) {
    return null;
  }
  if (isRecord(item.workflow)) {
    return { ...item.workflow, ...item };
  }
  return item;
}

function customerIdFrom(record: Record<string, unknown>): string | null {
  return (
    asString(record.customerId) ??
    (isRecord(record.customer) ? asString(record.customer.id) : undefined) ??
    null
  );
}

function workflowIdFrom(record: Record<string, unknown>): string | undefined {
  return asString(record.workflowId) ?? asString(record.id);
}

/** Prefer customer id for detail links; fall back to workflow id when enrichment is null. */
function rowNavigationId(record: Record<string, unknown>): string | null {
  return customerIdFrom(record) ?? workflowIdFrom(record) ?? null;
}

export function mapApiVerificationToKycRecord(item: unknown): KycRecord | null {
  const record = unwrapRow(item);
  if (!record) {
    return null;
  }
  const navigationId = rowNavigationId(record);
  if (!navigationId) {
    return null;
  }

  const riskScore = mapRiskScore(record);
  const workflowId = workflowIdFrom(record);
  const timeFromMs = formatTimeInQueueMs(asNumber(record.timeInQueueMs));
  const displayId = asString(record.displayId);

  return {
    id: navigationId,
    workflowId,
    kycId: displayCode("KYC", navigationId, displayId),
    customerName: asString(record.customerName) ?? (displayId ? `Customer ${displayId}` : "Customer"),
    documentType: documentTypeFromRow(record),
    country: mapCountry(record),
    status: mapWorkflowStatus(record.status),
    priority: mapPriority(record.priority, riskScore),
    riskScore,
    assignedTo: mapAssignedTo(record),
    timeInQueue: timeFromMs ?? formatTimeInQueueFromIso(asString(record.createdAt) ?? asString(record.updatedAt)),
    submittedAt: formatSubmittedAt(asString(record.createdAt) ?? asString(record.updatedAt)),
  };
}

export function mapApiVerificationToKybRecord(item: unknown): KybRecord | null {
  const record = unwrapRow(item);
  if (!record) {
    return null;
  }
  const navigationId = rowNavigationId(record);
  if (!navigationId) {
    return null;
  }

  const riskScore = mapRiskScore(record);
  const workflowId = workflowIdFrom(record);
  const timeFromMs = formatTimeInQueueMs(asNumber(record.timeInQueueMs));
  const displayId = asString(record.displayId);

  return {
    id: navigationId,
    workflowId,
    kybId: displayCode("KYB", navigationId, displayId),
    businessName:
      asString(record.businessName) ??
      asString(record.customerName) ??
      (displayId ? `Business ${displayId}` : "Business"),
    businessType: asString(record.industry) ? humanizeLabel(asString(record.industry)!) : "Business",
    verificationType: kybVerificationType(record),
    country: mapCountry(record),
    status: mapWorkflowStatus(record.status),
    priority: mapPriority(record.priority, riskScore),
    riskScore,
    assignedTo: mapAssignedTo(record),
    timeInQueue: timeFromMs ?? formatTimeInQueueFromIso(asString(record.createdAt) ?? asString(record.updatedAt)),
    submittedAt: formatSubmittedAt(asString(record.createdAt) ?? asString(record.updatedAt)),
  };
}

export function mapApiCustomerStatsToMetrics(stats: ApiCustomerListStats | null | undefined): KycMetric[] {
  return [
    {
      id: "successful",
      label: "Successful verification",
      value: stats?.successful ?? 0,
      tone: "success",
    },
    {
      id: "pending",
      label: "Pending Verification",
      value: stats?.pending ?? 0,
      tone: "info",
    },
    {
      id: "high-risk",
      label: "High Risk Alert",
      value: stats?.highRisk ?? 0,
      tone: "warning",
    },
    {
      id: "rejected",
      label: "Rejected verification",
      value: stats?.rejected ?? 0,
      tone: "error",
    },
  ];
}

export function mapApiKycVerificationList(
  rows: unknown[],
  stats?: ApiCustomerListStats | null,
): KycListData {
  const records = rows
    .map(mapApiVerificationToKycRecord)
    .filter((record): record is KycRecord => record !== null);

  return {
    records,
    metrics: mapApiCustomerStatsToMetrics(stats),
  };
}

export function mapApiKybVerificationList(
  rows: unknown[],
  batches: KybListData["batches"],
  stats?: ApiCustomerListStats | null,
): KybListData {
  const records = rows
    .map(mapApiVerificationToKybRecord)
    .filter((record): record is KybRecord => record !== null);

  return {
    records,
    batches,
    metrics: mapApiCustomerStatsToMetrics(stats),
  };
}
