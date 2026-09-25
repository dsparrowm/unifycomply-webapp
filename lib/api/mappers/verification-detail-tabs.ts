import { buildRiskAnalysisData, type RiskAnalysisSubject } from "@/lib/compliance/risk-analysis";
import { clampRiskScore, getRiskAnalysisScoreLabel } from "@/lib/kyc/risk-score";
import { kycDetailAvailability } from "@/lib/api/mappers/kyc-detail-merge";
import { mapAmlFromVerification, mapRiskFromVerification } from "@/lib/api/mappers/verification";
import type {
  ApiKycAmlScreeningTab,
  ApiKycDeviceInformationTab,
  ApiKycLivenessTab,
  ApiKycVerificationDocumentsTab,
  ApiKybBusinessOverviewTab,
  ApiKybComplianceChecksTab,
  ApiKybDirectorsOfficersTab,
  ApiKybScreeningTask,
  ApiKybShareholdersTab,
  ApiKybVerificationDocumentTab,
  ApiVerificationDocumentRow,
  ApiVerificationEvent,
  ApiVerificationRiskScoreTab,
  ApiVerificationTask,
} from "@/lib/api/types";
import type {
  KycAmlScreeningData,
  KycDetail,
  KycDocumentView,
  KycExtractedField,
  KycIpDeviceData,
  KycLivenessData,
  KycRiskAnalysisData,
  KycTimelineEvent,
} from "@/types/kyc";
import type {
  KybComplianceChecksData,
  KybComplianceScreeningStatus,
  KybDetail,
  KybDirector,
  KybDirectorAmlCheck,
  KybDirectorAmlCheckStatus,
  KybDirectorsData,
  KybShareCapitalData,
  KybShareholder,
  KybSubmittedDocument,
  KybSubmittedDocumentsData,
  KybVerificationStatus,
} from "@/types/kyb";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function humanizeLabel(value: string): string {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatRelativeTime(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return iso;
  }
  const minutes = Math.max(0, Math.floor((Date.now() - then.getTime()) / 60000));
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatShortDate(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function formatDisplayDate(iso: string | undefined): string | undefined {
  if (!iso) {
    return undefined;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function documentLabel(type: string | undefined): string {
  if (!type) {
    return "Document";
  }
  const labels: Record<string, string> = {
    "selfie-photo": "Selfie",
    selfie: "Selfie",
    passport: "Passport",
    "national-identity": "National ID",
    "national-id": "National ID",
    "driver-license": "Driver's License",
    "certificate-of-incorporation": "Certificate of Incorporation",
    tin: "TIN",
    "proof-of-business-address": "Proof of Business Address",
    memart: "Memorandum & Articles of Association",
  };
  return labels[type] ?? humanizeLabel(type);
}

function mapTimeline(events: ApiVerificationEvent[] | undefined): KycTimelineEvent[] {
  if (!events?.length) {
    return [];
  }
  return events.map((event, index) => {
    const title =
      asString(event.action)?.replace(/[._]/g, " ") ??
      asString(event.toStatus) ??
      "Workflow update";
    return {
      id: asString(event.id) ?? `event-${index}`,
      title: humanizeLabel(title),
      timestamp: formatRelativeTime(asString(event.createdAt)),
      status: index === 0 ? "in-progress" : "completed",
    };
  });
}

function viewForDocument(doc: ApiVerificationDocumentRow): KycDocumentView | null {
  const signedUrl = asString(doc.signedUrl);
  if (!signedUrl) {
    return null;
  }
  const type = (asString(doc.type) ?? "").toLowerCase();
  const category = (asString(doc.category) ?? "").toLowerCase();
  let label = documentLabel(type);
  if (type.includes("selfie") || category.includes("liveness")) {
    label = "Selfie";
  } else if (category.includes("back") || type.includes("back")) {
    label = "ID Back";
  } else if (
    type.includes("passport") ||
    type.includes("national") ||
    type.includes("driver") ||
    category.includes("identity")
  ) {
    label = "ID Front";
  }
  return { id: asString(doc.id) ?? label, label, src: signedUrl };
}

export function mapKycDocumentsTabToViews(
  tab: ApiKycVerificationDocumentsTab | null | undefined,
): KycDocumentView[] {
  const docs = tab?.documents ?? [];
  const views = docs
    .map(viewForDocument)
    .filter((view): view is KycDocumentView => view !== null);

  // Prefer ID Front / ID Back / Selfie order when labels match Figma chrome.
  const order = ["ID Front", "ID Back", "Selfie"];
  return [...views].sort((a, b) => {
    const ai = order.indexOf(a.label);
    const bi = order.indexOf(b.label);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function mapKycDocumentsTabExtractedFields(
  tab: ApiKycVerificationDocumentsTab | null | undefined,
  fallbackName?: string,
): KycExtractedField[] {
  const docs = tab?.documents ?? [];
  const identity =
    docs.find((doc) => {
      const type = (asString(doc.type) ?? "").toLowerCase();
      return (
        type.includes("passport") ||
        type.includes("national") ||
        type.includes("driver") ||
        type.includes("identity")
      );
    }) ?? docs[0];

  const fields: KycExtractedField[] = [
    {
      id: "full-name",
      label: "Full Name",
      value: fallbackName ?? "—",
    },
    {
      id: "date-of-birth",
      label: "Date Of Birth",
      value: "—",
    },
    {
      id: "document-number",
      label: "Document Number",
      value: asString(identity?.idNumber) ?? "—",
    },
    {
      id: "issued-date",
      label: "Issued Date",
      value: formatDisplayDate(asString(identity?.issueDate)) ?? "—",
    },
    {
      id: "expiry-date",
      label: "Expiry Date",
      value: formatDisplayDate(asString(identity?.expiryDate)) ?? "—",
    },
    {
      id: "address",
      label: "Address",
      value: "—",
    },
  ];

  // OCR is platform-wide null today — never invent confidence.
  return fields.map((field) => ({ ...field, confidence: null }));
}

export function mapKycDocumentsTabTimeline(
  tab: ApiKycVerificationDocumentsTab | null | undefined,
): KycTimelineEvent[] {
  return mapTimeline(tab?.timeline);
}

export function mapRiskScoreTab(
  tab: ApiVerificationRiskScoreTab | null | undefined,
  subject: RiskAnalysisSubject = "customer",
): {
  available: boolean;
  riskScore: number;
  riskAnalysis: KycRiskAnalysisData | null;
  canApprove?: boolean;
  requiresEscalation?: boolean;
} {
  if (!tab?.available || !tab.risk) {
    return {
      available: false,
      riskScore: 0,
      riskAnalysis: null,
    };
  }

  const score = clampRiskScore(tab.risk.score ?? 0);
  const base = mapRiskFromVerification(tab.risk);
  const themed =
    subject === "business"
      ? {
          ...base,
          ...buildRiskAnalysisData(score, "business"),
          recommendation:
            (tab.risk.contributions?.length ?? 0) > 0
              ? `${buildRiskAnalysisData(score, "business").recommendation} ${(tab.risk.contributions ?? [])
                  .map((item) => item.message ?? item.label ?? item.code)
                  .filter(Boolean)
                  .join(". ")}.`
              : buildRiskAnalysisData(score, "business").recommendation,
        }
      : base;

  return {
    available: true,
    riskScore: score,
    riskAnalysis: themed,
    canApprove: tab.risk.canApprove,
    requiresEscalation: tab.risk.requiresEscalation,
  };
}

export function mergeKycDetailWithDocumentsTab(
  detail: KycDetail,
  tab: ApiKycVerificationDocumentsTab | null | undefined,
): KycDetail {
  if (!tab) {
    return detail;
  }

  const views = mapKycDocumentsTabToViews(tab);
  const timeline = mapKycDocumentsTabTimeline(tab);
  const score =
    typeof tab.riskScore === "number" ? clampRiskScore(tab.riskScore) : detail.riskScore;

  return {
    ...detail,
    workflowId: tab.workflowId || detail.workflowId,
    riskScore: score,
    riskSummary: getRiskAnalysisScoreLabel(score),
    documentViews: views.length > 0 ? views : detail.documentViews,
    timeline: timeline.length > 0 ? timeline : detail.timeline,
    extractedFields: mapKycDocumentsTabExtractedFields(tab, detail.customerName),
    extractionStatus: "Pending OCR",
    availability: kycDetailAvailability({
      ...detail.availability,
      documentPreview: views.length > 0,
      ocr: false,
    }),
  };
}

export function mergeKycDetailWithRiskScoreTab(
  detail: KycDetail,
  tab: ApiVerificationRiskScoreTab | null | undefined,
): KycDetail {
  const mapped = mapRiskScoreTab(tab, "customer");
  if (!mapped.available || !mapped.riskAnalysis) {
    return {
      ...detail,
      availability: kycDetailAvailability({
        ...detail.availability,
        riskAnalysis: false,
      }),
      riskAnalysis: null,
    };
  }

  return {
    ...detail,
    riskScore: mapped.riskScore,
    riskSummary: getRiskAnalysisScoreLabel(mapped.riskScore),
    riskAnalysis: mapped.riskAnalysis,
    canApprove: mapped.canApprove,
    requiresEscalation: mapped.requiresEscalation,
    availability: kycDetailAvailability({
      ...detail.availability,
      riskAnalysis: true,
    }),
  };
}

function asVerificationTasks(value: unknown): ApiVerificationTask[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }
    const id = asString(item.id);
    const verificationType = asString(item.verificationType);
    const outcome = asString(item.outcome);
    if (!id || !verificationType || !outcome) {
      return [];
    }
    return [
      {
        id,
        verificationType,
        outcome,
        reasons: Array.isArray(item.reasons) ? (item.reasons as ApiVerificationTask["reasons"]) : undefined,
        providerKey: asString(item.providerKey) ?? null,
        providerReference: asString(item.providerReference) ?? null,
        completedAt: asString(item.completedAt) ?? null,
      },
    ];
  });
}

export function mapKycAmlScreeningTab(
  tab: ApiKycAmlScreeningTab | null | undefined,
): KycAmlScreeningData | null {
  const tasks = asVerificationTasks(tab?.tasks);
  if (tasks.length === 0) {
    return null;
  }
  return mapAmlFromVerification(tasks);
}

export function mapKycDeviceInformationTab(
  tab: ApiKycDeviceInformationTab | null | undefined,
): { available: boolean; data: KycIpDeviceData | null; reason: string } {
  if (!tab || !tab.available) {
    return {
      available: false,
      data: null,
      reason:
        asString(tab?.reason) ??
        "IP and device capture is not implemented on the platform yet.",
    };
  }

  const geo = isRecord(tab.geolocation) ? tab.geolocation : null;
  const device = isRecord(tab.device) ? tab.device : null;
  const city = geo ? asString(geo.city) ?? asString(geo.region) : undefined;
  const country =
    geo
      ? asString(geo.country) ?? asString(geo.countryCode) ?? asString(geo.countryName)
      : undefined;
  const vpn = Boolean(tab.vpnDetected);
  const proxy = Boolean(tab.proxyDetected);

  return {
    available: true,
    reason: asString(tab.reason) ?? "",
    data: {
      clearanceStatus: vpn || proxy ? "Review Required" : "Cleared",
      ipAddress: asString(tab.ip) ?? "—",
      ipAddressNote: "No matches found",
      location: city ?? "—",
      countryLabel: country ? `Country: ${country}` : "Country: —",
      vpnDetection: {
        label: "VPN Detection",
        statusLabel: vpn ? "Detected" : "No Match",
        detected: vpn,
      },
      proxyDetection: {
        label: "Proxy Detection",
        statusLabel: proxy ? "Detected" : "No Match",
        detected: proxy,
      },
      device: {
        label: asString(device?.type) ? `Device: ${asString(device?.type)}` : "Device: —",
        version: asString(device?.os) ?? asString(device?.version) ?? "—",
        status: "pass",
      },
      usageStats: {
        count: "—",
        deviceType: asString(device?.type) ?? "—",
        status: "pass",
      },
    },
  };
}

export function mapKycLivenessTab(
  tab: ApiKycLivenessTab | null | undefined,
): { available: boolean; data: KycLivenessData | null; reason: string } {
  if (!tab || !tab.available) {
    const reasonMessage =
      Array.isArray(tab?.reasons) && tab.reasons[0] && isRecord(tab.reasons[0])
        ? asString(tab.reasons[0].message)
        : undefined;
    return {
      available: false,
      data: null,
      reason:
        reasonMessage ??
        "Dedicated liveness provider results are not returned yet. Selfie checks may show as skipped for this country.",
    };
  }

  const detection = (asString(tab.livenessDetection) ?? "pending").toLowerCase();
  const skipped = detection === "skipped";
  const passed = detection === "passed";
  const failed = detection === "failed";
  const reasonMessage =
    Array.isArray(tab.reasons) && tab.reasons[0] && isRecord(tab.reasons[0])
      ? asString(tab.reasons[0].message)
      : undefined;

  if (skipped) {
    return {
      available: false,
      data: null,
      reason:
        reasonMessage ??
        "Liveness check was skipped for this verification (often unsupported in the customer country).",
    };
  }

  const matchScore =
    typeof tab.matchScoreRate === "number" && Number.isFinite(tab.matchScoreRate)
      ? `${Math.round(tab.matchScoreRate)}%`
      : "—";
  const attempts =
    typeof tab.attempts === "number" && Number.isFinite(tab.attempts) ? tab.attempts : null;

  return {
    available: true,
    reason: reasonMessage ?? "",
    data: {
      overallStatusLabel: passed ? "Passed" : failed ? "Failed" : humanizeLabel(detection),
      livenessStatus: passed ? "Passed" : failed ? "Failed" : humanizeLabel(detection),
      livenessStatusNote: reasonMessage ?? (passed ? "Real person detected" : "Review required"),
      confidenceScore: matchScore,
      confidenceNote: matchScore === "—" ? "Score unavailable" : "Match score",
      completionTime: tab.completedAt ? formatShortDate(asString(tab.completedAt)) : "—",
      attemptsLabel: attempts != null ? `${attempts} attempts` : "—",
      checks: [],
    },
  };
}

export function mapKybDocumentsTab(
  tab: ApiKybVerificationDocumentTab | null | undefined,
): KybSubmittedDocumentsData {
  const docs = tab?.documents ?? [];
  const mapped: KybSubmittedDocument[] = docs.map((doc, index) => {
    const statusRaw = (asString(doc.status) ?? "pending").toLowerCase();
    const status =
      statusRaw === "validated" || statusRaw === "verified"
        ? "verified"
        : statusRaw === "rejected" || statusRaw === "failed"
          ? "rejected"
          : "pending";
    return {
      id: asString(doc.id) ?? `doc-${index}`,
      name: documentLabel(asString(doc.type)),
      uploadedAt: formatShortDate(asString(doc.createdAt) ?? asString(doc.updatedAt)),
      status,
      previewSrc: asString(doc.signedUrl) ?? asString(doc.url) ?? "",
      type: asString(doc.type) as KybSubmittedDocument["type"],
      idNumber: asString(doc.idNumber),
      issueDate: asString(doc.issueDate),
      expiryDate: asString(doc.expiryDate),
    };
  });

  return {
    sectionStatus: mapped.some((doc) => doc.status === "verified")
      ? "Active"
      : mapped.length > 0
        ? "Pending"
        : "Pending",
    documents: mapped,
  };
}

export function buildWorkflowOnlyKycDetail(input: {
  workflowId: string;
  displayId?: string;
  customerName?: string;
  country?: string;
  documentType?: string;
  status?: KycDetail["status"];
  priority?: KycDetail["priority"];
  riskScore?: number;
}): KycDetail {
  const score = clampRiskScore(input.riskScore ?? 0);
  return {
    id: input.workflowId,
    workflowId: input.workflowId,
    kycId: input.displayId ?? `KYC-${input.workflowId.slice(-6).toUpperCase()}`,
    customerName: input.customerName ?? `Customer ${input.displayId ?? input.workflowId.slice(-6)}`,
    documentType: input.documentType ?? "—",
    country: input.country ?? "—",
    status: input.status ?? "pending",
    priority: input.priority ?? "low",
    riskScore: score,
    riskSummary: getRiskAnalysisScoreLabel(score),
    matchScore: 0,
    livenessStatus: "Pending",
    extractionStatus: "Pending OCR",
    extractedFields: mapKycDocumentsTabExtractedFields(undefined, input.customerName),
    timeline: [],
    riskAnalysis: null,
    amlScreening: null,
    ipDevice: null,
    liveness: null,
    availability: kycDetailAvailability({
      documentPreview: false,
      ocr: false,
      biometric: false,
      ipDevice: false,
      liveness: false,
      amlScreening: false,
      riskAnalysis: false,
    }),
  };
}

/** Shell for verification-queue rows with null customer enrichment (legacy KYB). */
export function buildWorkflowOnlyKybDetail(input: {
  workflowId: string;
  displayId?: string;
  businessName?: string;
  businessType?: string;
  country?: string;
  status?: KybDetail["status"];
  priority?: KybDetail["priority"];
  riskScore?: number;
  registrationNumber?: string;
  tin?: string;
  industry?: string;
  registeredAddress?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  dateRegistered?: string;
  businessActivities?: string[];
}): KybDetail {
  const score = clampRiskScore(input.riskScore ?? 0);
  const shortId = (input.displayId ?? input.workflowId.slice(-6)).toUpperCase();
  const businessName = input.businessName ?? `Business ${shortId}`;

  return {
    id: input.workflowId,
    workflowId: input.workflowId,
    kybId: input.displayId ?? `KYB-${shortId}`,
    businessName,
    businessType: input.businessType ?? "Business",
    country: input.country ?? "—",
    status: input.status ?? "pending",
    priority: input.priority ?? "low",
    riskScore: score,
    riskSummary: getRiskAnalysisScoreLabel(score),
    registryStatus: "—",
    legalBusinessName: businessName,
    registrationNumber: input.registrationNumber ?? "—",
    dateRegistered: input.dateRegistered ?? "—",
    tin: input.tin ?? "—",
    industry: input.industry ?? "—",
    registeredAddress: input.registeredAddress ?? "—",
    phoneNumber: input.phoneNumber ?? "—",
    email: input.email ?? "—",
    website: input.website ?? "—",
    businessActivities: input.businessActivities ?? [],
    submittedAt: "—",
    lastUpdatedAt: "—",
    employeeCount: "—",
    annualRevenue: "—",
    businessPermit: "—",
    operatingCountries: input.country ?? "—",
    riskFactors: [],
    riskAnalysis: null,
    directors: null,
    shareholders: { sectionStatus: "Pending", shareholders: [] },
    documents: { sectionStatus: "Pending", documents: [] },
    complianceChecks: null,
    riskAnalysisAvailable: false,
  };
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function formatAddressLike(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (!isRecord(value)) {
    return undefined;
  }
  const formatted = asString(value.formatted);
  if (formatted) {
    return formatted;
  }
  const parts = [asString(value.street), asString(value.city), asString(value.country)].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

function mapWorkflowStatusToKyb(value: unknown): KybVerificationStatus {
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
  if (status === "failed" || status === "rejected" || status === "blocked" || status === "offboarded") {
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

function mapScreeningOutcome(outcome: string | undefined): KybDirectorAmlCheckStatus {
  const value = (outcome ?? "").toLowerCase();
  if (value === "passed" || value === "clear" || value === "no-match" || value === "approved") {
    return "no-match";
  }
  if (value === "failed" || value === "rejected" || value === "blocked" || value === "flagged") {
    return "flagged";
  }
  if (value === "match" || value === "hit" || value === "review" || value === "warning") {
    return "match";
  }
  return "no-match";
}

function mapScreeningToComplianceStatus(outcome: string | undefined): KybComplianceScreeningStatus {
  return mapScreeningOutcome(outcome);
}

function screeningLabel(verificationType: string | undefined): string {
  const type = (verificationType ?? "").toLowerCase();
  if (type.includes("sanction")) {
    return "SANCTIONS";
  }
  if (type.includes("pep")) {
    return "PEP (Political Exposed Person)";
  }
  if (type.includes("adverse")) {
    return "ADVERSE MEDIA";
  }
  if (type.includes("watch")) {
    return "WATCHLIST";
  }
  return humanizeLabel(verificationType ?? "Check").toUpperCase();
}

function mapDirectorScreening(tasks: ApiKybScreeningTask[] | null | undefined): {
  amlChecks: KybDirectorAmlCheck[];
  pepStatus: KybDirector["pepStatus"];
  amlClearanceStatus: KybDirector["amlClearanceStatus"];
} {
  const list = Array.isArray(tasks) ? tasks : [];
  const amlChecks: KybDirectorAmlCheck[] = list.map((task, index) => {
    const status = mapScreeningOutcome(asString(task.outcome));
    const label = screeningLabel(asString(task.verificationType));
    return {
      id: asString(task.id) ?? `screen-${index}`,
      label,
      status,
      matchSeverity:
        status !== "no-match" && label.includes("SANCTION")
          ? ("critical" as const)
          : status !== "no-match"
            ? ("warning" as const)
            : undefined,
    };
  });

  const pepTask = list.find((task) => (asString(task.verificationType) ?? "").toLowerCase().includes("pep"));
  const pepOutcome = mapScreeningOutcome(asString(pepTask?.outcome));
  const hasFlag = amlChecks.some((check) => check.status === "flagged");
  const hasMatch = amlChecks.some((check) => check.status === "match");

  return {
    amlChecks,
    pepStatus: pepOutcome === "no-match" ? "non-pep" : pepOutcome === "flagged" ? "pep" : "possible-pep",
    amlClearanceStatus: hasFlag ? "flagged" : hasMatch ? "review" : "clear",
  };
}

/** Merge live business-overview tab into an existing KYB detail shell. */
export function mergeKybDetailWithBusinessOverview(
  detail: KybDetail,
  tab: ApiKybBusinessOverviewTab | null | undefined,
): KybDetail {
  if (!tab) {
    return detail;
  }

  const business = isRecord(tab.business) ? tab.business : null;
  const businessName =
    (business && asString(business.businessName)) || detail.businessName;
  const industry = business ? asString(business.industry) : undefined;
  const country =
    (business && (asString(business.countryCode) ?? asString(business.country))) || detail.country;
  const activities = Array.isArray(tab.activities)
    ? tab.activities.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    : null;
  const score =
    typeof tab.riskScore === "number" ? clampRiskScore(tab.riskScore) : detail.riskScore;

  return {
    ...detail,
    workflowId: tab.workflowId || detail.workflowId,
    businessName,
    legalBusinessName: businessName,
    businessType: industry ? humanizeLabel(industry) : detail.businessType,
    country: country || detail.country,
    status: tab.status ? mapWorkflowStatusToKyb(tab.status) : detail.status,
    riskScore: score,
    riskSummary: getRiskAnalysisScoreLabel(score),
    registrationNumber: asString(tab.registrationNumber) ?? detail.registrationNumber,
    tin: asString(tab.tin) ?? detail.tin,
    industry: industry ? humanizeLabel(industry) : detail.industry,
    registeredAddress:
      (business ? formatAddressLike(business.address) : undefined) ?? detail.registeredAddress,
    phoneNumber: (business && asString(business.contactPhone)) || detail.phoneNumber,
    email: (business && asString(business.contactEmail)) || detail.email,
    website: (business && asString(business.website)) || detail.website,
    dateRegistered:
      (business && asString(business.registrationDate)) || detail.dateRegistered,
    businessActivities: activities && activities.length > 0 ? activities : detail.businessActivities,
    registryStatus:
      business && asString(business.status)
        ? humanizeLabel(asString(business.status)!)
        : detail.registryStatus,
    operatingCountries: country && country !== "—" ? country : detail.operatingCountries,
  };
}

export function mapKybDirectorsOfficersTab(
  tab: ApiKybDirectorsOfficersTab | null | undefined,
): KybDirectorsData | null {
  const directors = Array.isArray(tab?.directors) ? tab.directors : [];
  if (directors.length === 0) {
    return null;
  }

  const mapped: KybDirector[] = directors.map((row, index) => {
    const fullName =
      [asString(row.firstName), asString(row.lastName)].filter(Boolean).join(" ").trim() ||
      "Director";
    const screening = mapDirectorScreening(row.screening ?? undefined);
    const hasIssue = screening.amlClearanceStatus !== "clear";

    return {
      id: asString(row.id) ?? `director-${index}`,
      fullName,
      role: asString(row.role) ?? "—",
      verificationStatus: hasIssue ? "pending" : "verified",
      pepStatus: screening.pepStatus,
      shareholdingPercent: asNumber(row.sharePercentage) ?? 0,
      nationality: asString(row.nationality) ?? "—",
      dateAppointed: formatShortDate(asString(row.dateAppointed)),
      idType: asString(row.idType) ?? "—",
      idNumber: asString(row.idNumber) ?? "—",
      phone: asString(row.phone) ?? "—",
      email: asString(row.email) ?? "—",
      address: formatAddressLike(row.address) ?? "—",
      amlClearanceStatus: screening.amlClearanceStatus,
      amlRiskLevel:
        screening.amlClearanceStatus === "clear"
          ? "Low Risk"
          : screening.amlClearanceStatus === "flagged"
            ? "High Risk"
            : "Medium Risk",
      amlChecks: screening.amlChecks,
    };
  });

  const needsReview = mapped.some((director) => director.amlClearanceStatus !== "clear");
  return {
    sectionStatus: needsReview ? "Review Required" : "Active",
    directors: mapped,
  };
}

export function mapKybShareholdersTab(
  tab: ApiKybShareholdersTab | null | undefined,
): KybShareCapitalData {
  const rows = Array.isArray(tab?.shareholders) ? tab.shareholders : [];
  const shareholders: KybShareholder[] = rows.map((row, index) => {
    const name =
      [asString(row.firstName), asString(row.lastName)].filter(Boolean).join(" ").trim() ||
      asString(row.name) ||
      "Shareholder";
    return {
      id: asString(row.id) ?? `shareholder-${index}`,
      name,
      type: asString(row.type) === "corporate" ? "corporate" : "individual",
      shares: asNumber(row.shareCountTotal) ?? 0,
      percentage: asNumber(row.sharePercentage) ?? 0,
      shareClass: asString(row.shareClass) ?? "Ordinary",
    };
  });

  return {
    sectionStatus: shareholders.length > 0 ? "Active" : "Pending",
    shareholders,
  };
}

export function mapKybComplianceChecksTab(
  tab: ApiKybComplianceChecksTab | null | undefined,
): KybComplianceChecksData | null {
  const tasks = Array.isArray(tab?.tasks) ? tab.tasks : [];
  if (tasks.length === 0) {
    return null;
  }

  const findTask = (needle: string) =>
    tasks.find((task) => (asString(task.verificationType) ?? "").toLowerCase().includes(needle));

  const sanctions = findTask("sanction");
  const pep = findTask("pep");
  const adverse = findTask("adverse");
  const cac = findTask("cac") ?? findTask("registration") ?? findTask("incorporation");
  const tin = findTask("tin") ?? findTask("tax");

  const sanctionsStatus = mapScreeningToComplianceStatus(asString(sanctions?.outcome));
  const pepStatus = mapScreeningToComplianceStatus(asString(pep?.outcome));
  const adverseStatus = mapScreeningToComplianceStatus(asString(adverse?.outcome));

  const registryChecks: KybComplianceChecksData["registryChecks"] = [];
  if (cac) {
    const status = mapScreeningOutcome(asString(cac.outcome));
    registryChecks.push({
      id: "cac",
      title: "CAC Registration Verification",
      description: "Registration confirmed with Corporate Affairs Commission",
      status: status === "no-match" ? "passed" : status === "flagged" ? "failed" : "review",
    });
  }
  if (tin) {
    const status = mapScreeningOutcome(asString(tin.outcome));
    registryChecks.push({
      id: "tin",
      title: "Tax identification number",
      description: "TIN verified with Federal Inland Revenue Service",
      status: status === "no-match" ? "passed" : status === "flagged" ? "failed" : "review",
    });
  }

  const needsReview =
    sanctionsStatus !== "no-match" || pepStatus !== "no-match" || adverseStatus !== "no-match";

  return {
    clearanceStatus: needsReview ? "Review Required" : "Cleared",
    registryChecks,
    sanctionsLists: [
      { id: "ofac", label: "OFAC", status: sanctionsStatus },
      { id: "un", label: "UN", status: sanctionsStatus },
      { id: "eu", label: "EU", status: sanctionsStatus },
      { id: "uk-hmt", label: "UK HMT", status: sanctionsStatus },
    ],
    pepCheck: {
      id: "pep",
      label: "PEP Screening",
      description: "Politically exposed person",
      status: pepStatus,
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description:
        adverseStatus === "no-match"
          ? "No negative news or adverse media mentions detected"
          : "Adverse media references require review",
      status: adverseStatus,
    },
  };
}

export function customerIdFromDocumentsTab(
  tab: ApiKycVerificationDocumentsTab | ApiKybVerificationDocumentTab | null | undefined,
): string | null {
  const docs = tab && "documents" in tab ? tab.documents : [];
  for (const doc of docs) {
    const id = asString(doc.customerId);
    if (id) {
      return id;
    }
  }
  return null;
}

export function asVerificationEventList(value: unknown): ApiVerificationEvent[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(isRecord) as ApiVerificationEvent[];
}
