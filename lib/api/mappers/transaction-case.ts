import type {
  TmCaseManagement,
  TmCasePndCard,
  TmCaseRationaleCard,
  TmCaseTone,
} from "@/types/transaction-monitoring";

const EMPTY = "—";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  "under-review": "Under Review",
  submitted: "Submitted",
  active: "Active",
  resolved: "Resolved",
};

export function mapTransactionCase(
  raw: Record<string, unknown> | null | undefined,
  options?: { accountNumber?: string },
): TmCaseManagement {
  const rationaleFiling = latestRecord(raw?.sarFilings);
  const pndListing = latestRecord(raw?.pndListings);
  const fallbackAccount = display(options?.accountNumber);

  return {
    assignedTo: asString(raw?.assignedTo) ?? null,
    assignedToId: asString(raw?.assignedToId) ?? null,
    rationale: mapRationale(rationaleFiling),
    pnd: mapPnd(pndListing, fallbackAccount),
  };
}

function mapRationale(filing: Record<string, unknown> | null): TmCaseRationaleCard {
  const filedAt = asString(filing?.filedDate) ?? asString(filing?.createdAt);
  const categories = stringList(filing?.suspiciousActivityCategories);
  const parties = [asString(filing?.subjectFullName)].filter((name): name is string => Boolean(name));

  return {
    byline: byline(asString(filing?.filedBy), filedAt),
    statusLabel: statusLabel(asString(filing?.status)),
    statusTone: statusTone(asString(filing?.status)),
    sarNumber: EMPTY,
    filingDate: formatCaseDate(filedAt),
    priority: EMPTY,
    priorityTone: "muted",
    category: categories.length > 0 ? categories.join(", ") : EMPTY,
    narrative: narrativeText(filing?.narrative),
    parties,
    documents: documentsFrom(filing?.evidenceReference),
  };
}

function mapPnd(
  listing: Record<string, unknown> | null,
  fallbackAccount: string,
): TmCasePndCard {
  const filedAt = asString(listing?.createdAt);
  const riskLevel = asString(listing?.riskLevel);
  const amount = formatAmount(listing?.amount);

  return {
    byline: byline(asString(listing?.filedBy), filedAt),
    statusLabel: statusLabel(asString(listing?.status)),
    statusTone: statusTone(asString(listing?.status)),
    pndNumber: EMPTY,
    filingDate: formatCaseDate(filedAt),
    riskLevel: riskLevel ? riskLevel.toUpperCase() : EMPTY,
    riskTone: riskTone(riskLevel),
    accountNumber: asString(listing?.accountNumber) ?? (fallbackAccount === EMPTY ? EMPTY : fallbackAccount),
    reason: asString(listing?.reasonForListing) ?? EMPTY,
    freezeAmount: amount,
    legalBasis: asString(listing?.legalBasis) ?? EMPTY,
    reviewDate: formatCaseDate(asString(listing?.resolvedDate) ?? asString(listing?.reviewDate)),
    documents: documentsFrom(listing?.evidenceReference),
  };
}

function latestRecord(value: unknown): Record<string, unknown> | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const records = value.filter(isRecord);
  if (records.length === 0) {
    return null;
  }
  return [...records].sort((left, right) => stamp(right) - stamp(left))[0] ?? null;
}

function stamp(record: Record<string, unknown>): number {
  const iso = asString(record.createdAt) ?? asString(record.filedDate) ?? "";
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function narrativeText(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (!isRecord(value)) {
    return EMPTY;
  }
  const parts = [
    value.openingStatement,
    value.whyItsSuspicious,
    value.activityDescription,
    value.investigationStepsTaken,
    value.summaryAndRecommendation,
  ]
    .map(asString)
    .filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(" ") : EMPTY;
}

function documentsFrom(value: unknown): string[] {
  const reference = asString(value);
  return reference ? [reference] : [];
}

function byline(actor: string | undefined, iso: string | undefined): string | null {
  const when = formatCaseStamp(iso);
  if (actor && when !== EMPTY) {
    return `By ${actor} · ${when}`;
  }
  if (actor) {
    return `By ${actor}`;
  }
  if (when !== EMPTY) {
    return when;
  }
  return null;
}

function statusLabel(status: string | undefined): string | null {
  if (!status) {
    return null;
  }
  return STATUS_LABELS[status] ?? status.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusTone(status: string | undefined): TmCaseTone {
  if (status === "submitted" || status === "active" || status === "resolved") {
    return "success";
  }
  if (status === "pending" || status === "under-review") {
    return "warning";
  }
  return "muted";
}

function riskTone(level: string | undefined): TmCaseTone {
  const normalized = level?.toLowerCase();
  if (normalized === "high" || normalized === "critical") {
    return "danger";
  }
  if (normalized === "medium") {
    return "warning";
  }
  if (normalized === "low") {
    return "success";
  }
  return "muted";
}

function formatAmount(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-US");
  }
  return asString(value) ?? EMPTY;
}

function formatCaseDate(iso: string | undefined): string {
  const date = parseDate(iso);
  if (!date) {
    return EMPTY;
  }
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatCaseStamp(iso: string | undefined): string {
  const date = parseDate(iso);
  if (!date) {
    return EMPTY;
  }
  const time = [date.getHours(), date.getMinutes()]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
  return `${formatCaseDate(iso)} ${time}`;
}

function parseDate(iso: string | undefined): Date | null {
  if (!iso) {
    return null;
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

function display(value: string | undefined): string {
  return value && value.trim() && value.trim() !== EMPTY ? value.trim() : EMPTY;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(asString).filter((item): item is string => Boolean(item));
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
