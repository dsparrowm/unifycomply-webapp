import type { ApiComplianceDocument } from "@/lib/api/types";

const IDENTITY_LABELS: Record<string, string> = {
  "bank-verification": "BVN",
  "national-identity": "National ID",
  passport: "Passport",
  "driver-license": "Driver's License",
};

const IDENTITY_TYPES = new Set(Object.keys(IDENTITY_LABELS));

function newest(documents: ApiComplianceDocument[]) {
  return [...documents].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))[0];
}

/** Figma list labels: BVN, National ID + Selfie, Passport, Driver's License. */
export function kycDocumentTypeLabel(documents: ApiComplianceDocument[] | undefined): string {
  if (!documents?.length) {
    return "—";
  }

  const identity = newest(documents.filter((document) => IDENTITY_TYPES.has(document.type)));
  const hasSelfie = documents.some((document) => document.type === "selfie-photo");

  if (identity) {
    const label = IDENTITY_LABELS[identity.type];
    return hasSelfie ? `${label} + Selfie` : label;
  }

  if (hasSelfie) {
    return "Selfie";
  }

  return newest(documents)?.type.replace(/-/g, " ") ?? "—";
}

export function newestIdentityDocument(documents?: ApiComplianceDocument[]) {
  if (!documents?.length) return undefined;
  return newest(documents.filter((document) => IDENTITY_TYPES.has(document.type)));
}

const CHECK_BY_DOCUMENT: Record<string, string> = {
  "bank-verification": "bank-account",
  "national-identity": "national-id",
  passport: "passport",
  "driver-license": "driver-license",
};

export function verificationTypeForDocument(documentType: string): string {
  return CHECK_BY_DOCUMENT[documentType] ?? documentType;
}
