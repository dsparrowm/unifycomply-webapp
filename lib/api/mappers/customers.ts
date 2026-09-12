import { countryLabelFromCode } from "@/lib/api/mappers/onboarding";
import { KYB_DOCUMENT_PREVIEW_SRC } from "@/lib/data/kyb-documents";
import { buildKybDetailFromRecord } from "@/lib/data/kyb-detail";
import { buildKycDetailFromRecord } from "@/lib/data/kyc-detail";
import { clampRiskScore } from "@/lib/kyc/risk-score";
import type { KycDetail, KycExtractedField, KycListData, KycMetric, KycPriority, KycRecord, KycVerificationStatus } from "@/types/kyc";
import type {
  KybDetail,
  KybListData,
  KybRecord,
  KybShareCapitalData,
  KybShareholder,
  KybSubmittedDocument,
  KybSubmittedDocumentsData,
  KybVerificationType,
} from "@/types/kyb";

const KYC_DOCUMENT_LABELS: Record<string, string> = {
  "national-identity": "National ID",
  passport: "Passport",
  "driver-license": "Driver's License",
  "bank-verification": "Bank Verification",
  "utility-bill": "Utility Bill",
  "bank-statement": "Bank Statement",
  "selfie-photo": "Selfie",
};

const KYB_DOCUMENT_LABELS: Record<string, string> = {
  "certificate-of-incorporation": "Certificate of Incorporation",
  tin: "TIN",
  "proof-of-business-address": "Proof of Business Address",
  memart: "Memorandum & Articles of Association",
};

const KYB_VERIFICATION_FROM_DOC: Record<string, KybVerificationType> = {
  "certificate-of-incorporation": "CAC",
  tin: "TIN",
  memart: "Memorandum",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function unwrapCollection(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (!isRecord(data)) {
    return [];
  }

  for (const key of ["items", "records", "customers", "results", "rows", "documents", "shareholders", "data"]) {
    const nested = data[key];
    if (Array.isArray(nested)) {
      return nested;
    }
  }

  return [];
}

function unwrapRecord(data: unknown): Record<string, unknown> | null {
  if (!isRecord(data)) {
    return null;
  }
  if (isRecord(data.customer)) {
    return data.customer;
  }
  return data;
}

function customerIdFrom(record: Record<string, unknown>): string | null {
  return asString(record.id) ?? asString(record.customerId) ?? null;
}

function mapCustomerStatus(value: unknown): KycVerificationStatus {
  const status = asString(value)?.toLowerCase();
  if (status === "onboarded" || status === "approved" || status === "verified") {
    return "approved";
  }
  if (status === "review" || status === "in-review" || status === "in_review") {
    return "in-review";
  }
  if (status === "blocked" || status === "rejected" || status === "failed" || status === "offboarded") {
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

function mapPriorityFromScore(score: number): KycPriority {
  if (score >= 4) {
    return "critical";
  }
  if (score >= 3) {
    return "high";
  }
  if (score >= 2) {
    return "medium";
  }
  return "low";
}

function mapRiskScore(record: Record<string, unknown>): number {
  const raw = asNumber(record.riskScore) ?? asNumber(record.riskLevel);
  if (raw !== undefined) {
    return clampRiskScore(raw);
  }

  const flags = unwrapCollection(record.flags);
  if (flags.length >= 2) {
    return 3;
  }
  if (flags.length === 1) {
    return 2;
  }
  return 0;
}

function mapAssignedTo(record: Record<string, unknown>): string | null {
  const direct = asString(record.assignedTo) ?? asString(record.assignee);
  if (direct) {
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

function formatTimeInQueue(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) {
    return "—";
  }

  const minutes = Math.max(0, Math.floor((Date.now() - then.getTime()) / 60000));
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

function formatDisplayDate(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatShortDate(value: string | undefined): string {
  if (!value) {
    return "—";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

function mapCountry(record: Record<string, unknown>): string {
  const address = isRecord(record.address) ? record.address : null;
  const addressCountry = address ? asString(address.country) : undefined;
  if (addressCountry && addressCountry.length > 2) {
    return addressCountry;
  }

  const label = asString(record.country);
  if (label && label.length > 2) {
    return label;
  }

  const code =
    asString(record.countryCode) ??
    (address ? asString(address.countryCode) : undefined) ??
    (addressCountry && addressCountry.length === 2 ? addressCountry : undefined) ??
    label;
  return code ? countryLabelFromCode(code) : "—";
}

function documentTypeOf(item: unknown): string | undefined {
  if (!isRecord(item)) {
    return undefined;
  }
  return asString(item.type) ?? asString(item.documentType);
}

const KYC_DOCUMENT_TYPE_ORDER = [
  "national-identity",
  "passport",
  "driver-license",
  "selfie-photo",
] as const;

function mapKycDocumentType(documents: unknown[]): string {
  const types = documents
    .map((item) => documentTypeOf(item))
    .filter((type): type is string => Boolean(type));
  const unique = [...new Set(types)];
  unique.sort((left, right) => {
    const leftIndex = KYC_DOCUMENT_TYPE_ORDER.indexOf(left as (typeof KYC_DOCUMENT_TYPE_ORDER)[number]);
    const rightIndex = KYC_DOCUMENT_TYPE_ORDER.indexOf(right as (typeof KYC_DOCUMENT_TYPE_ORDER)[number]);
    return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex);
  });

  const preferred = unique.filter((type) =>
    (KYC_DOCUMENT_TYPE_ORDER as readonly string[]).includes(type),
  );
  const labels = (preferred.length > 0 ? preferred : unique).map(
    (type) => KYC_DOCUMENT_LABELS[type] ?? type,
  );
  return labels.length > 0 ? labels.join(" + ") : "—";
}

function mapKybVerificationType(documents: unknown[]): KybVerificationType {
  for (const item of documents) {
    const type = documentTypeOf(item);
    if (type && KYB_VERIFICATION_FROM_DOC[type]) {
      return KYB_VERIFICATION_FROM_DOC[type];
    }
  }
  return "CAC";
}

function displayCode(prefix: string, id: string, explicit?: string): string {
  if (explicit) {
    return explicit;
  }
  const compact = id.replace(/-/g, "").slice(-6).toUpperCase();
  return `${prefix}-${compact}`;
}

function humanizeLabel(value: string): string {
  if (!value.includes("-") && !value.includes("_")) {
    return value;
  }
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatAddress(value: unknown): string | undefined {
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
  const parts = [
    asString(value.houseNo),
    asString(value.street),
    asString(value.city),
    asString(value.state),
    asString(value.country),
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : undefined;
}

function assigneeName(record: Record<string, unknown>): string | null {
  const assigned = mapAssignedTo(record);
  return assigned && assigned.toLowerCase() !== "unassigned" ? assigned : null;
}

export function mapApiKycToRecord(item: unknown): KycRecord | null {
  const record = unwrapRecord(item);
  if (!record) {
    return null;
  }
  const id = customerIdFrom(record);
  if (!id) {
    return null;
  }

  const documents = unwrapCollection(record.documents);
  const firstName = asString(record.firstName) ?? "";
  const lastName = asString(record.lastName) ?? "";
  const customerName = [firstName, lastName].filter(Boolean).join(" ").trim() || asString(record.email) || "Customer";
  const riskScore = mapRiskScore(record);

  return {
    id,
    kycId: displayCode("KYC", id, asString(record.kycId) ?? asString(record.reference)),
    customerName,
    documentType: mapKycDocumentType(documents),
    country: mapCountry(record),
    status: mapCustomerStatus(record.status),
    priority: mapPriorityFromScore(riskScore),
    riskScore,
    assignedTo: assigneeName(record),
    timeInQueue: formatTimeInQueue(asString(record.createdAt) ?? asString(record.updatedAt)),
    submittedAt: formatSubmittedAt(asString(record.createdAt) ?? asString(record.updatedAt)),
  };
}

export function mapApiKybToRecord(item: unknown): KybRecord | null {
  const record = unwrapRecord(item);
  if (!record) {
    return null;
  }
  const id = customerIdFrom(record);
  if (!id) {
    return null;
  }

  const documents = unwrapCollection(record.documents);
  const riskScore = mapRiskScore(record);
  const industry = asString(record.industry);

  return {
    id,
    kybId: displayCode("KYB", id, asString(record.kybId) ?? asString(record.reference)),
    businessName: asString(record.businessName) ?? "Business",
    businessType: industry ? humanizeLabel(industry) : "Business",
    verificationType: mapKybVerificationType(documents),
    country: mapCountry(record),
    status: mapCustomerStatus(record.status),
    priority: mapPriorityFromScore(riskScore),
    assignedTo: assigneeName(record),
    riskScore,
    timeInQueue: formatTimeInQueue(asString(record.createdAt) ?? asString(record.updatedAt)),
    submittedAt: formatSubmittedAt(asString(record.createdAt) ?? asString(record.updatedAt) ?? asString(record.registrationDate)),
  };
}

function buildListMetrics(records: Array<{ status: KycVerificationStatus; riskScore: number }>): KycMetric[] {
  return [
    {
      id: "successful",
      label: "Successful verification",
      value: records.filter((record) => record.status === "approved").length,
      tone: "success",
    },
    {
      id: "pending",
      label: "Pending Verification",
      value: records.filter((record) => record.status === "pending" || record.status === "in-review").length,
      tone: "info",
    },
    {
      id: "high-risk",
      label: "High Risk Alert",
      value: records.filter((record) => record.riskScore >= 3).length,
      tone: "warning",
    },
    {
      id: "rejected",
      label: "Rejected verification",
      value: records.filter((record) => record.status === "rejected").length,
      tone: "error",
    },
  ];
}

export function mapApiKycList(data: unknown): KycListData {
  const records = unwrapCollection(data)
    .map(mapApiKycToRecord)
    .filter((record): record is KycRecord => record !== null);

  return {
    records,
    metrics: buildListMetrics(records),
  };
}

export function mapApiKybList(data: unknown, batches: KybListData["batches"]): KybListData {
  const records = unwrapCollection(data)
    .map(mapApiKybToRecord)
    .filter((record): record is KybRecord => record !== null);

  return {
    records,
    batches,
    metrics: buildListMetrics(records),
  };
}

function overlayExtractedFields(
  fields: KycExtractedField[],
  customer: Record<string, unknown>,
  documents: unknown[],
): KycExtractedField[] {
  const firstDoc =
    documents.find((item): item is Record<string, unknown> => {
      if (!isRecord(item)) {
        return false;
      }
      const type = documentTypeOf(item);
      return type === "passport" || type === "national-identity" || type === "driver-license";
    }) ?? documents.find(isRecord);
  const replacements: Record<string, string | undefined> = {
    "full-name":
      [asString(customer.firstName), asString(customer.lastName)].filter(Boolean).join(" ").trim() ||
      asString(customer.email),
    "date-of-birth": formatDisplayDate(asString(customer.dob)),
    "document-number": firstDoc ? asString(firstDoc.idNumber) : undefined,
    "issued-date": firstDoc ? formatDisplayDate(asString(firstDoc.issueDate)) : undefined,
    "expiry-date": firstDoc ? formatDisplayDate(asString(firstDoc.expiryDate)) : undefined,
    address: formatAddress(customer.address),
  };

  return fields.map((field) => {
    const next = replacements[field.id];
    return next ? { ...field, value: next } : field;
  });
}

function mapKybDocuments(documents: unknown[]): KybSubmittedDocumentsData {
  const mapped: KybSubmittedDocument[] = documents.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }
    const type = documentTypeOf(item);
    const id = asString(item.id) ?? `doc-${index}`;
    return [
      {
        id,
        name: type ? (KYB_DOCUMENT_LABELS[type] ?? type) : "Document",
        uploadedAt: formatShortDate(asString(item.createdAt) ?? asString(item.updatedAt)),
        status: "pending",
        previewSrc: asString(item.file) ?? KYB_DOCUMENT_PREVIEW_SRC,
      },
    ];
  });

  return {
    sectionStatus: mapped.length > 0 ? "Active" : "Pending",
    documents: mapped,
  };
}

function mapKybShareholders(items: unknown[]): KybShareCapitalData {
  const shareholders: KybShareholder[] = items.flatMap((item, index) => {
    if (!isRecord(item)) {
      return [];
    }
    const name =
      [asString(item.firstName), asString(item.lastName)].filter(Boolean).join(" ").trim() ||
      asString(item.name) ||
      "Shareholder";
    const type = asString(item.type) === "corporate" ? "corporate" : "individual";
    return [
      {
        id: asString(item.id) ?? `shareholder-${index}`,
        name,
        type,
        shares: asNumber(item.shareCountTotal) ?? 0,
        percentage: asNumber(item.sharePercentage) ?? 0,
        shareClass: "Ordinary",
      },
    ];
  });

  return {
    sectionStatus: shareholders.length > 0 ? "Active" : "Pending",
    shareholders,
  };
}

export function mapApiKycToDetail(
  customerData: unknown,
  documentsData: unknown,
): KycDetail | null {
  const customer = unwrapRecord(customerData);
  if (!customer) {
    return null;
  }
  const record = mapApiKycToRecord({ ...customer, documents: unwrapCollection(documentsData) });
  if (!record) {
    return null;
  }

  const detail = buildKycDetailFromRecord(record);
  return {
    ...detail,
    extractedFields: overlayExtractedFields(detail.extractedFields, customer, unwrapCollection(documentsData)),
  };
}

export function mapApiKybToDetail(
  customerData: unknown,
  documentsData: unknown,
  shareholdersData: unknown,
): KybDetail | null {
  const customer = unwrapRecord(customerData);
  if (!customer) {
    return null;
  }

  const documents = unwrapCollection(documentsData);
  const record = mapApiKybToRecord({ ...customer, documents });
  if (!record) {
    return null;
  }

  const detail = buildKybDetailFromRecord(record);
  const address = formatAddress(customer.address);
  const email = asString(customer.contactEmail) ?? asString(customer.email);
  const phone = asString(customer.contactPhone) ?? asString(customer.phone);
  const website = asString(customer.website);
  const industry = asString(customer.industry);
  const registrationNumber = asString(customer.registrationNumber);
  const tin = asString(customer.tin);
  const dateRegistered = asString(customer.registrationDate);

  return {
    ...detail,
    legalBusinessName: record.businessName,
    email: email ?? "—",
    phoneNumber: phone ?? "—",
    website: website ?? "—",
    industry: industry ? humanizeLabel(industry) : record.businessType,
    registeredAddress: address ?? "—",
    registrationNumber: registrationNumber ?? "—",
    tin: tin ?? "—",
    dateRegistered: dateRegistered ? formatSubmittedAt(dateRegistered) : record.submittedAt,
    employeeCount: asString(customer.employeeCount) ?? "—",
    annualRevenue: asString(customer.annualRevenue) ?? "—",
    businessPermit: asString(customer.businessPermit) ?? "—",
    operatingCountries: record.country === "—" ? "—" : record.country,
    businessActivities: industry ? [humanizeLabel(industry)] : [],
    documents: documents.length > 0 ? mapKybDocuments(documents) : { sectionStatus: "Pending", documents: [] },
    shareholders: mapKybShareholders(unwrapCollection(shareholdersData)),
  };
}
