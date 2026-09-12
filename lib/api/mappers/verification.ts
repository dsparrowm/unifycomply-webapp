import type { ApiComplianceDocument, ApiKycCustomer, ApiRiskAssessment, ApiVerificationDetail, ApiVerificationReason, ApiVerificationTask } from "@/lib/api/types";
import { newestIdentityDocument, verificationTypeForDocument } from "@/lib/compliance/document-type";
import { countryNameFromCode } from "@/lib/compliance/format";
import { mapCheckToKycLookupType } from "@/lib/compliance/lookup-checks";
import { verificationTypeForLookup } from "@/lib/compliance/lookup-run";
import { buildRiskAnalysisData } from "@/lib/compliance/risk-analysis";
import { clampRiskScore, getAmlRiskLevelLabel, getAmlScreeningStatusLabel, RISK_SCORE_MAX } from "@/lib/kyc/risk-score";
import type {
  KycAmlScreeningData,
  KycAmlScreeningRow,
  KycBvnLookupResult,
  KycLookupType,
  KycRiskAnalysisData,
} from "@/types/kyc";

const IDENTITY_TYPES = new Set(["bank-account", "national-id", "passport", "driver-license"]);
const COUNTRY_FLAGS: Record<string, string> = {
  NG: "🇳🇬",
  GH: "🇬🇭",
  KE: "🇰🇪",
  ZA: "🇿🇦",
  GB: "🇬🇧",
  US: "🇺🇸",
};

export type LookupValidationRow = {
  id: string;
  field: string;
  message: string;
  matched: boolean;
};

export type MappedVerificationView = {
  lookupType: KycLookupType;
  identityTitle: string;
  identityNumberLabel: string;
  usesLookupLayout: boolean;
  result: KycBvnLookupResult;
  riskAnalysis: KycRiskAnalysisData;
  amlScreening: KycAmlScreeningData;
  validation: LookupValidationRow[];
  polling: boolean;
};

export function unwrapRun(detail: ApiVerificationDetail) {
  return detail.run?.run ?? null;
}

export function unwrapTasks(detail: ApiVerificationDetail): ApiVerificationTask[] {
  return detail.run?.tasks ?? [];
}

export function isVerificationSettled(detail: ApiVerificationDetail) {
  const runStatus = unwrapRun(detail)?.status;
  const workflowStatus = detail.workflow.status;
  if (runStatus === "failed" || workflowStatus === "failed") return true;
  if (runStatus === "completed" && (detail.risk || workflowStatus === "verified" || workflowStatus === "in-review")) {
    return true;
  }
  return false;
}

export function identityTask(tasks: ApiVerificationTask[], preferredType?: string) {
  if (preferredType) {
    const preferred = tasks.find((task) => task.verificationType === preferredType);
    if (preferred) return preferred;
  }
  return tasks.find((task) => IDENTITY_TYPES.has(task.verificationType)) ?? null;
}

export function usesLookupLayout(tasks: ApiVerificationTask[], workflowType?: string) {
  const types = new Set(tasks.map((task) => task.verificationType));
  if (types.has("selfie")) return false;
  const identity = identityTask(tasks)?.verificationType ?? workflowType;
  return IDENTITY_TYPES.has(identity ?? "");
}

function titleCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDob(value: string) {
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  return value;
}

function formatLookupTimestamp(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${day}/${month}/${year} | ${hour12}:${minutes}${suffix}`;
}

function evidenceString(evidence: Record<string, unknown> | undefined, key: string) {
  const value = evidence?.[key];
  return typeof value === "string" && value.trim() ? value : "";
}

function fieldValue(reasons: ApiVerificationReason[], field: string, fallback: string) {
  const mismatch = reasons.find((reason) => reason.field === field && reason.code === "identity.field-mismatch");
  const actual = evidenceString(mismatch?.evidence, "actual");
  if (actual) return actual;
  const match = reasons.find((reason) => reason.field === field && reason.code === "identity.field-match");
  const expected = evidenceString(match?.evidence, "expected");
  if (expected) return expected;
  return fallback;
}

function identityCopy(lookupType: KycLookupType) {
  if (lookupType === "nin-basic") {
    return { title: "National Identification Number", label: "NIN", tab: "National Identification Number" };
  }
  if (lookupType === "passport-basic") {
    return { title: "International Passport", label: "Passport Number", tab: "International Passport" };
  }
  if (lookupType === "drivers-license-basic") {
    return { title: "Driver's License", label: "License Number", tab: "Driver's License" };
  }
  return { title: "Bank Verification Number", label: "BVN", tab: "Bank Verification Number" };
}

function lookupStatus(identity: ApiVerificationTask | null, settled: boolean): KycBvnLookupResult["status"] {
  if (!settled || !identity) return "pending";
  if (identity.outcome === "passed") return "successful";
  if (identity.outcome === "pending") return "pending";
  return "failed";
}

function screeningRow(
  task: ApiVerificationTask | undefined,
  label: string,
  description: string,
  matchDescription: string,
): KycAmlScreeningRow {
  const outcome = task?.outcome;
  if (outcome === "review-required" || outcome === "failed") {
    const hit = task?.reasons?.find((reason) => reason.code.includes("match"));
    return {
      label,
      description: hit?.message ?? matchDescription,
      status: outcome === "failed" ? "flagged" : "match",
      statusLabel: outcome === "failed" ? "Flagged" : "Match",
    };
  }
  return {
    label,
    description,
    status: "no-match",
    statusLabel: "No Match",
  };
}

export function mapAmlFromVerification(tasks: ApiVerificationTask[], risk?: ApiRiskAssessment | null): KycAmlScreeningData {
  const score = clampRiskScore(risk?.score ?? 0);
  const pep = tasks.find((task) => task.verificationType === "pep-screening");
  const sanctions = tasks.find((task) => task.verificationType === "sanctions-screening");
  const pepHit = pep?.outcome === "review-required" || pep?.outcome === "failed";
  const sanctionHit = sanctions?.outcome === "failed" || sanctions?.outcome === "review-required";
  const listStatus = sanctionHit ? "flagged" : "no-match";

  return {
    clearanceStatus: sanctionHit || score >= 3 ? "Review Required" : "Cleared",
    screeningStatus: getAmlScreeningStatusLabel(score),
    screeningStatusNote: pepHit ? "PEP Detected" : sanctionHit ? "Sanctions hit" : "No matches found",
    riskLevelLabel: getAmlRiskLevelLabel(score),
    riskLevel: score,
    riskScore: score,
    riskScoreMax: RISK_SCORE_MAX,
    pepCheck: screeningRow(
      pep,
      "PEP Match",
      "Political Exposed Person (Not Exposed)",
      "Political Exposed Person",
    ),
    sanctionsLists: [
      { id: "ofac", label: "OFAC", status: listStatus },
      { id: "un", label: "UN", status: listStatus },
      { id: "eu", label: "EU", status: listStatus },
      { id: "uk-hmt", label: "UK HMT", status: listStatus },
    ],
    warningEnforcement: screeningRow(
      pep,
      "Warning Matches",
      "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
      "Adverse media or enforcement proceedings were flagged.",
    ),
    watchlist: screeningRow(
      sanctions,
      "Watchlist Matches",
      "Individual not found on any monitored watchlists",
      "Individual matched a monitored watchlist",
    ),
  };
}

export function mapRiskFromVerification(risk?: ApiRiskAssessment | null): KycRiskAnalysisData {
  const data = buildRiskAnalysisData(clampRiskScore(risk?.score ?? 0));
  const contributions = (risk?.contributions ?? [])
    .map((item) => item.message ?? item.label ?? item.detail ?? item.code)
    .filter((item): item is string => Boolean(item));
  if (contributions.length > 0) {
    return {
      ...data,
      recommendation: `${data.recommendation} ${contributions.join(". ")}.`,
    };
  }
  return data;
}

export function mapValidationRows(identity: ApiVerificationTask | null): LookupValidationRow[] {
  if (!identity?.reasons?.length) return [];
  return identity.reasons.map((reason, index) => ({
    id: `${reason.code}-${reason.field ?? index}`,
    field: reason.field ?? reason.code,
    message: reason.message,
    matched: reason.code === "identity.field-match" || reason.code === "identity.verified" || reason.code === "screening.clear",
  }));
}

export function mapVerificationView(
  detail: ApiVerificationDetail,
  extras?: {
    customer?: ApiKycCustomer | null;
    documents?: ApiComplianceDocument[];
    identifier?: string;
    lookupType?: KycLookupType;
    countryCode?: string;
  },
): MappedVerificationView {
  const tasks = unwrapTasks(detail);
  const run = unwrapRun(detail);
  const newestIdentity = newestIdentityDocument(extras?.documents);
  const preferredType = extras?.lookupType
    ? verificationTypeForLookup(extras.lookupType)
    : verificationTypeForDocument(newestIdentity?.type ?? "");
  const identity = identityTask(tasks, preferredType);
  const lookupType =
    extras?.lookupType ?? mapCheckToKycLookupType(identity?.verificationType ?? detail.workflow.verificationType ?? "bank-account");
  const copy = identityCopy(lookupType);
  const reasons = identity?.reasons ?? [];
  const customer = extras?.customer;
  const countryCode = (extras?.countryCode ?? customer?.countryCode ?? "NG").toUpperCase();
  const identifier =
    extras?.identifier?.trim() ||
    newestIdentity?.idNumber ||
    evidenceString(reasons.find((reason) => reason.field === "idNumber")?.evidence, "actual") ||
    "";
  const firstName = fieldValue(reasons, "firstName", customer?.firstName ?? "");
  const lastName = fieldValue(reasons, "lastName", customer?.lastName ?? "");
  const dateOfBirth = formatDob(fieldValue(reasons, "dateOfBirth", customer?.dob ?? ""));
  const riskScore = clampRiskScore(detail.risk?.score ?? detail.workflow.riskScore ?? customer?.riskScore ?? 0);
  const settled = isVerificationSettled(detail);
  const notes =
    reasons.find((reason) => reason.code.startsWith("identity."))?.message ??
    (settled
      ? "Verification completed. Review identity, risk, and screening results before deciding."
      : "Verification is still running. Identity and screening results will fill in as tasks complete.");

  return {
    lookupType,
    identityTitle: copy.title,
    identityNumberLabel: copy.label,
    usesLookupLayout: usesLookupLayout(tasks, detail.workflow.verificationType),
    polling: !settled,
    validation: mapValidationRows(identity),
    riskAnalysis: mapRiskFromVerification(detail.risk),
    amlScreening: mapAmlFromVerification(tasks, detail.risk),
    result: {
      lookupType,
      country: countryNameFromCode(countryCode),
      countryCode,
      countryFlag: COUNTRY_FLAGS[countryCode] ?? "🇳🇬",
      identifier,
      bvn: identifier,
      firstName,
      lastName,
      middleName: customer?.middleName ?? "",
      gender: titleCase(customer?.gender ?? ""),
      phoneNumber: customer?.phone ?? "",
      dateOfBirth,
      riskScore,
      priority: titleCase(detail.risk?.priority ?? detail.workflow.priority ?? "standard"),
      initializedAt: formatLookupTimestamp(run?.startedAt ?? detail.workflow.createdAt),
      updatedAt: formatLookupTimestamp(run?.updatedAt ?? detail.workflow.updatedAt),
      address: {
        residentialAddress: customer?.address?.formatted ?? customer?.address?.street ?? "—",
        city: customer?.address?.city ?? "—",
        state: customer?.address?.state ?? "—",
        lga: "—",
      },
      notes,
      status: lookupStatus(identity, settled),
    },
  };
}
