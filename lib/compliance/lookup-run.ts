import {
  createKycDocument,
  getKycCustomer,
  listKycDocuments,
  startKycVerification,
  updateKycDocument,
  workflowIdFromStart,
} from "@/lib/api/compliance";
import type { ApiComplianceDocument } from "@/lib/api/types";
import { mapCheckToKycLookupType } from "@/lib/compliance/lookup-checks";
import { fileToDataUri } from "@/lib/compliance/format";
import type { KycLookupType } from "@/types/kyc";

const IDENTITY_CHECKS = ["bank-account", "national-id", "passport", "driver-license"] as const;

export type IdentityCheckType = (typeof IDENTITY_CHECKS)[number];

const DOCUMENT_TYPE_BY_CHECK: Record<IdentityCheckType, string> = {
  "bank-account": "bank-verification",
  "national-id": "national-identity",
  passport: "passport",
  "driver-license": "driver-license",
};

const FILE_REQUIRED = new Set<IdentityCheckType>(["passport", "driver-license"]);
const LOOKUP_FILE_MAX_BYTES = 2 * 1024 * 1024;
const LOOKUP_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

export type LookupDocumentFields = {
  file: boolean;
  issueDate: boolean;
  expiryDate: boolean;
};

export function isIdentityCheck(type: string): type is IdentityCheckType {
  return IDENTITY_CHECKS.includes(type as IdentityCheckType);
}

export function verificationTypeForLookup(lookupType: string): IdentityCheckType {
  if (isIdentityCheck(lookupType)) return lookupType;
  if (lookupType.includes("passport")) return "passport";
  if (lookupType.includes("driver")) return "driver-license";
  if (lookupType.includes("bank") || lookupType === "bvn-basic") return "bank-account";
  return "national-id";
}

export function lookupRequiresFile(lookupType: string) {
  return FILE_REQUIRED.has(verificationTypeForLookup(lookupType));
}

export function lookupDocumentFields(lookupType: string): LookupDocumentFields {
  const type = verificationTypeForLookup(lookupType);
  return {
    file: lookupRequiresFile(lookupType),
    issueDate: type === "passport",
    expiryDate: type === "passport" || type === "driver-license",
  };
}

export function documentTypeForLookup(lookupType: string) {
  return DOCUMENT_TYPE_BY_CHECK[verificationTypeForLookup(lookupType)];
}

export function isLookupDocumentFile(file: File) {
  const name = file.name.toLowerCase();
  return LOOKUP_FILE_EXTENSIONS.some((extension) => name.endsWith(extension));
}

export function lookupDocumentFileError(file: File) {
  if (!isLookupDocumentFile(file)) {
    return "Upload a PDF, JPEG, or PNG of the identity document.";
  }
  if (file.size > LOOKUP_FILE_MAX_BYTES) {
    return "Document must be 2MB or smaller.";
  }
  return null;
}

function normalizeId(value?: string | null) {
  return (value ?? "").replace(/\s/g, "").toLowerCase();
}

function dateOnly(value?: string | null) {
  return value ? value.slice(0, 10) : undefined;
}

function documentHasFile(document?: ApiComplianceDocument | null) {
  return Boolean(document && (document.url || document.status === "validated"));
}

export function matchingLookupDocument(
  documents: ApiComplianceDocument[] | undefined,
  lookupType: string,
  identifier?: string,
) {
  const documentType = documentTypeForLookup(lookupType);
  const normalized = normalizeId(identifier);
  return (documents ?? []).find((document) => {
    if (document.type !== documentType) return false;
    if (!normalized) return Boolean(document.idNumber);
    return normalizeId(document.idNumber) === normalized;
  });
}

export async function startKycLookup(input: {
  customerId: string;
  lookupType: string;
  identifier: string;
  file?: File | null;
  issueDate?: string;
  expiryDate?: string;
}): Promise<{ workflowId: string; customerId: string; lookupType: KycLookupType }> {
  const verificationType = verificationTypeForLookup(input.lookupType);
  const fields = lookupDocumentFields(input.lookupType);
  const customer = await getKycCustomer(input.customerId);
  const identifier = input.identifier.trim();
  if (!identifier) {
    throw new Error(`Enter the identifier already on this customer, or attach it through the API first.`);
  }

  const documents = await listKycDocuments(customer.id).catch(() => []);
  const documentType = documentTypeForLookup(input.lookupType);
  const existing = matchingLookupDocument(documents, input.lookupType, identifier);
  const issueDate = dateOnly(input.issueDate) || dateOnly(existing?.issueDate);
  const expiryDate = dateOnly(input.expiryDate) || dateOnly(existing?.expiryDate);

  if (fields.issueDate && !issueDate) {
    throw new Error("Enter the issue date from the passport.");
  }
  if (fields.expiryDate && !expiryDate) {
    throw new Error("Enter the expiry date from the document.");
  }

  if (input.file) {
    const fileError = lookupDocumentFileError(input.file);
    if (fileError) throw new Error(fileError);
  }

  if (fields.file && !input.file && !documentHasFile(existing)) {
    throw new Error("Upload the identity document to continue.");
  }

  if (existing && (input.file || issueDate !== dateOnly(existing.issueDate) || expiryDate !== dateOnly(existing.expiryDate))) {
    await updateKycDocument(customer.id, existing.id, {
      type: documentType,
      idNumber: identifier,
      issueDate,
      expiryDate,
      file: input.file ? await fileToDataUri(input.file) : undefined,
    });
  } else if (!existing) {
    await createKycDocument(customer.id, {
      type: documentType,
      idNumber: identifier,
      issueDate,
      expiryDate,
      file: input.file ? await fileToDataUri(input.file) : undefined,
    });
  }

  const started = await startKycVerification({
    customerId: customer.id,
    verificationTypes: [verificationType],
  });
  const workflowId = workflowIdFromStart(started);
  if (!workflowId) {
    throw new Error("Verification started but no workflow id was returned.");
  }

  return {
    workflowId,
    customerId: customer.id,
    lookupType: mapCheckToKycLookupType(verificationType),
  };
}
