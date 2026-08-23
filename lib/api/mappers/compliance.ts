import type {
  ApiComplianceDocument,
  ApiKybCustomer,
  ApiKybShareholder,
  ApiKycCustomer,
} from "@/lib/api/types";
import { kycDocumentTypeLabel } from "@/lib/compliance/document-type";
import {
  countryNameFromCode,
  formatAddress,
  formatTimeInQueue,
  mapLifecycleStatus,
  priorityFromRisk,
  shortCustomerRef,
} from "@/lib/compliance/format";
import { buildRiskAnalysisData } from "@/lib/compliance/risk-analysis";
import { clampRiskScore, getAmlRiskLevelLabel, getAmlScreeningStatusLabel, RISK_SCORE_MAX } from "@/lib/kyc/risk-score";
import type {
  KycAmlScreeningData,
  KycAmlScreeningRow,
  KycDetail,
  KycExtractedField,
  KycIpDeviceData,
  KycListData,
  KycLivenessData,
  KycMetric,
  KycRecord,
} from "@/types/kyc";
import type {
  KybComplianceChecksData,
  KybDetail,
  KybListData,
  KybRecord,
  KybShareCapitalData,
  KybSubmittedDocumentsData,
} from "@/types/kyb";

const emptyMetrics = (): KycMetric[] => [
  { id: "successful", label: "Successful verification", value: 0, tone: "success" },
  { id: "pending", label: "Pending Verification", value: 0, tone: "info" },
  { id: "high-risk", label: "High Risk Alert", value: 0, tone: "warning" },
  { id: "rejected", label: "Rejected verification", value: 0, tone: "error" },
];

function metricsFromStatuses(records: Array<{ status: KycRecord["status"]; riskScore: number }>): KycMetric[] {
  const metrics = emptyMetrics();
  for (const record of records) {
    if (record.status === "approved") metrics[0].value += 1;
    if (record.status === "pending" || record.status === "in-review") metrics[1].value += 1;
    if (record.riskScore >= 3) metrics[2].value += 1;
    if (record.status === "rejected") metrics[3].value += 1;
  }
  return metrics;
}

function noMatchRow(label: string): KycAmlScreeningRow {
  return { label, status: "no-match", statusLabel: "No Match" };
}

function emptyAmlScreening(score: number): KycAmlScreeningData {
  return {
    clearanceStatus: score === 0 ? "Cleared" : "Review",
    screeningStatus: getAmlScreeningStatusLabel(score),
    screeningStatusNote: "No screening payload on this customer yet.",
    riskLevelLabel: getAmlRiskLevelLabel(score),
    riskLevel: score,
    riskScore: score,
    riskScoreMax: RISK_SCORE_MAX,
    pepCheck: noMatchRow("PEP Check"),
    sanctionsLists: [
      { id: "ofac", label: "OFAC", status: "no-match" },
      { id: "un", label: "UN", status: "no-match" },
      { id: "eu", label: "EU", status: "no-match" },
      { id: "uk", label: "UK", status: "no-match" },
    ],
    warningEnforcement: noMatchRow("Warning / Enforcement"),
    watchlist: noMatchRow("Watchlist"),
  };
}

function emptyIpDevice(country: string): KycIpDeviceData {
  return {
    clearanceStatus: "Unavailable",
    ipAddress: "—",
    ipAddressNote: "No device session on this customer yet.",
    location: "—",
    countryLabel: `Country: ${country}`,
    vpnDetection: { label: "VPN Detection", statusLabel: "No Match", detected: false },
    proxyDetection: { label: "Proxy Detection", statusLabel: "No Match", detected: false },
    device: { label: "Device", version: "—", status: "pass" },
    usageStats: { count: "—", deviceType: "—", status: "pass" },
  };
}

function emptyLiveness(): KycLivenessData {
  return {
    overallStatusLabel: "Unavailable",
    livenessStatus: "Unavailable",
    livenessStatusNote: "No liveness check on this customer yet.",
    confidenceScore: "—",
    confidenceNote: "",
    completionTime: "—",
    attemptsLabel: "—",
    checks: [],
  };
}

function emptyComplianceChecks(): KybComplianceChecksData {
  return {
    clearanceStatus: "Unavailable",
    registryChecks: [],
    sanctionsLists: [],
    pepCheck: { id: "pep", label: "PEP Check", description: "No screening payload yet.", status: "no-match" },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "No screening payload yet.",
      status: "no-match",
    },
  };
}

export function mapKycRecord(
  customer: ApiKycCustomer,
  documents: ApiComplianceDocument[] = [],
): KycRecord {
  const status = mapLifecycleStatus(customer.status);
  const riskScore = clampRiskScore(customer.riskScore ?? 0);
  return {
    id: customer.id,
    kycId: shortCustomerRef("KYC", customer.id),
    customerName: [customer.firstName, customer.lastName].filter(Boolean).join(" "),
    documentType: kycDocumentTypeLabel(documents),
    country: countryNameFromCode(customer.countryCode),
    status,
    priority: priorityFromRisk(customer.riskScore),
    riskScore,
    timeInQueue: formatTimeInQueue(customer.statusChangedAt ?? customer.createdAt),
    submittedAt: customer.createdAt,
  };
}

export function mapKycListData(
  customers: ApiKycCustomer[],
  documentsByCustomerId: Record<string, ApiComplianceDocument[]> = {},
): KycListData {
  const records = customers.map((customer) => mapKycRecord(customer, documentsByCustomerId[customer.id] ?? []));
  return {
    records,
    metrics: records.length === 0 ? emptyMetrics() : metricsFromStatuses(records),
  };
}

function extractedFieldsFromCustomer(customer: ApiKycCustomer): KycExtractedField[] {
  const address = formatAddress(customer.address);
  return [
    { id: "firstName", label: "First name", value: customer.firstName || "—", confidence: 100 },
    { id: "lastName", label: "Last name", value: customer.lastName || "—", confidence: 100 },
    { id: "dob", label: "Date of birth", value: customer.dob || "—", confidence: 100 },
    { id: "gender", label: "Gender", value: customer.gender || "—", confidence: 100 },
    { id: "email", label: "Email", value: customer.email || "—", confidence: 100 },
    { id: "phone", label: "Phone", value: customer.phone || "—", confidence: 100 },
    { id: "country", label: "Country", value: countryNameFromCode(customer.countryCode), confidence: 100 },
    { id: "address", label: "Address", value: address, confidence: 100 },
  ];
}

export function mapKycDetail(
  customer: ApiKycCustomer,
  documents: ApiComplianceDocument[],
): KycDetail {
  const record = mapKycRecord(customer, documents);
  return {
    id: customer.id,
    kycId: record.kycId,
    customerName: record.customerName,
    documentType: record.documentType,
    country: record.country,
    status: record.status,
    priority: record.priority,
    riskScore: record.riskScore,
    riskSummary: record.riskScore === 0 ? "Standard Score" : String(record.riskScore),
    matchScore: 0,
    livenessStatus: "Unavailable",
    extractionStatus: documents.length > 0 ? "Customer record" : "No documents",
    extractedFields: extractedFieldsFromCustomer(customer),
    timeline: (customer.lifecycle ?? []).map((event) => ({
      id: event.id,
      title: event.toStatus,
      timestamp: event.createdAt,
      status: "completed",
    })),
    riskAnalysis: buildRiskAnalysisData(clampRiskScore(record.riskScore)),
    amlScreening: emptyAmlScreening(record.riskScore),
    ipDevice: emptyIpDevice(record.country),
    liveness: emptyLiveness(),
  };
}

export function mapKybRecord(customer: ApiKybCustomer): KybRecord {
  const status = mapLifecycleStatus(customer.status);
  const riskScore = clampRiskScore(customer.riskScore ?? 0);
  return {
    id: customer.id,
    kybId: shortCustomerRef("KYB", customer.id),
    businessName: customer.businessName,
    businessType: customer.businessType ?? "—",
    country: countryNameFromCode(customer.countryCode),
    status,
    priority: priorityFromRisk(customer.riskScore),
    riskScore,
    timeInQueue: formatTimeInQueue(customer.statusChangedAt ?? customer.createdAt),
    submittedAt: customer.createdAt,
  };
}

export function mapKybListData(customers: ApiKybCustomer[]): KybListData {
  const records = customers.map(mapKybRecord);
  return {
    records,
    metrics: records.length === 0 ? emptyMetrics() : metricsFromStatuses(records),
  };
}

function mapShareholders(shareholders: ApiKybShareholder[]): KybShareCapitalData {
  return {
    sectionStatus: shareholders.length > 0 ? "Submitted" : "None on file",
    shareholders: shareholders.map((shareholder) => ({
      id: shareholder.id,
      name: [shareholder.firstName, shareholder.lastName].filter(Boolean).join(" "),
      type: shareholder.type === "corporate" ? "corporate" : "individual",
      shares: shareholder.shareCountTotal ?? 0,
      percentage: shareholder.sharePercentage ?? 0,
      shareClass: shareholder.role ?? "Ordinary",
    })),
  };
}

function mapDocuments(documents: ApiComplianceDocument[]): KybSubmittedDocumentsData {
  return {
    sectionStatus: documents.length > 0 ? "Submitted" : "None on file",
    documents: documents.map((document) => ({
      id: document.id,
      name: document.type,
      uploadedAt: document.createdAt,
      status:
        document.status === "verified"
          ? "verified"
          : document.status === "rejected"
            ? "rejected"
            : "pending",
    })),
  };
}

export function mapKybDetail(
  customer: ApiKybCustomer,
  documents: ApiComplianceDocument[],
  shareholders: ApiKybShareholder[],
): KybDetail {
  const record = mapKybRecord(customer);
  return {
    id: customer.id,
    kybId: record.kybId,
    businessName: customer.businessName,
    businessType: customer.businessType ?? "—",
    country: record.country,
    status: record.status,
    priority: record.priority,
    riskScore: record.riskScore,
    riskSummary: record.riskScore === 0 ? "Standard Score" : String(record.riskScore),
    registryStatus: customer.status ?? "pending",
    legalBusinessName: customer.businessName,
    registrationNumber: "—",
    dateRegistered: customer.registrationDate ?? "—",
    tin: "—",
    industry: customer.industry ?? "—",
    registeredAddress: formatAddress(customer.address),
    phoneNumber: customer.contactPhone ?? "—",
    email: customer.contactEmail ?? "—",
    website: customer.website ?? "—",
    businessActivities: [],
    submittedAt: customer.createdAt,
    lastUpdatedAt: customer.updatedAt,
    employeeCount: "—",
    annualRevenue: "—",
    businessPermit: "—",
    operatingCountries: record.country,
    riskFactors: [],
    riskAnalysis: buildRiskAnalysisData(clampRiskScore(record.riskScore), "business"),
    shareholders: mapShareholders(shareholders),
    documents: mapDocuments(documents),
    directors: null,
    complianceChecks: emptyComplianceChecks(),
  };
}
