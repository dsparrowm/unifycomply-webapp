import type { ApiCustomerFlag, ApiCustomerFlagStatus, ApiDocumentRequirement } from "@/lib/api/types";
import type { CustomerFlag, DocumentRequirementItem } from "@/types/customer-compliance";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function unwrapCollection(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data;
  }
  if (!isRecord(data)) {
    return [];
  }
  for (const key of ["items", "records", "results", "rows", "data", "requirements", "flags"]) {
    if (Array.isArray(data[key])) {
      return data[key] as unknown[];
    }
  }
  return [];
}

function humanizeCategory(value: string): string {
  const labels: Record<string, string> = {
    "id-document": "Identity document",
    "liveness-check": "Liveness check",
    "proof-of-address": "Proof of address",
    "certificate-of-incorporation": "Certificate of incorporation",
    "directors-id": "Directors ID",
    "proof-of-business-address": "Proof of business address",
    "tax-identity": "Tax identity",
    memart: "Memorandum & Articles",
    tin: "TIN",
  };
  if (labels[value]) {
    return labels[value];
  }
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapDocumentRequirements(data: unknown): DocumentRequirementItem[] {
  const rows = unwrapCollection(data);
  return rows.flatMap((row, index) => {
    const record = (isRecord(row) ? row : {}) as ApiDocumentRequirement & Record<string, unknown>;
    const category = asString(record.category) ?? `requirement-${index}`;
    const accepted = Array.isArray(record.acceptedTypes)
      ? record.acceptedTypes.filter((item): item is string => typeof item === "string")
      : [];
    return [
      {
        id: category,
        category,
        label: humanizeCategory(category),
        satisfied: Boolean(record.satisfied),
        acceptedTypes: accepted.map(humanizeCategory),
        documentCount: Array.isArray(record.documentIds) ? record.documentIds.length : 0,
      },
    ];
  });
}

function mapFlagStatus(value: unknown): ApiCustomerFlagStatus {
  const status = asString(value)?.toLowerCase();
  if (status === "investigating" || status === "revised" || status === "warning") {
    return status;
  }
  return "warning";
}

export function mapCustomerFlags(data: unknown): CustomerFlag[] {
  const rows = unwrapCollection(data);
  return rows.flatMap((row, index) => {
    const record = (isRecord(row) ? row : {}) as ApiCustomerFlag;
    const id = asString(record.id);
    if (!id) {
      return [];
    }
    const title =
      asString(record.title) ??
      asString(record.type) ??
      asString(record.reason) ??
      `Alert ${index + 1}`;
    const description =
      asString(record.description) ??
      asString(record.note) ??
      "Review this alert and update its investigation status.";
    return [
      {
        id,
        status: mapFlagStatus(record.status),
        title: humanizeCategory(title),
        description,
      },
    ];
  });
}
