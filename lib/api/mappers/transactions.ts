import type {
  ApiTransaction,
  ApiTransactionDetail,
  ApiTransactionRisk,
} from "@/lib/api/types";
import type {
  TmListMetric,
  TmPartyDetails,
  TmRuleResult,
  TmTimelineStep,
  TmTransactionDetail,
  TmTransactionRecord,
  TmTransactionsListData,
  TmTxCategory,
  TmTxDirection,
  TmTxStatus,
  TmEntityType,
} from "@/types/transaction-monitoring";

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return undefined;
}

function metaOf(tx: ApiTransaction): Record<string, unknown> {
  return asRecord(tx.metadata) ?? {};
}

function counterpartyLabel(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  const record = asRecord(value);
  if (!record) {
    return "—";
  }
  return (
    asString(record.name) ??
    asString(record.legalName) ??
    asString(record.displayName) ??
    "—"
  );
}

function formatAmountLabel(amount: number | undefined, currency: string | undefined): string {
  if (amount === undefined) {
    return "—";
  }
  const code = (currency ?? "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString("en-US")}`;
  }
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
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatAbsoluteTime(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDateTime(iso: string | undefined): string {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const day = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const time = formatAbsoluteTime(iso);
  return `${day} | ${time}`;
}

function humanize(raw: string | undefined): string {
  if (!raw) {
    return "—";
  }
  if (raw === raw.toUpperCase()) {
    return raw;
  }
  return raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function maskAccount(raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }
  if (raw.includes("*")) {
    return raw;
  }
  return `****${raw.slice(-4)}`;
}

function mapDirection(raw: string | undefined): TmTxDirection {
  const value = (raw ?? "").toLowerCase();
  if (value === "outbound" || value === "outgoing" || value === "debit") {
    return "outgoing";
  }
  return "incoming";
}

function mapEntityType(raw: string | undefined): TmEntityType {
  const value = (raw ?? "").toLowerCase();
  if (value === "business" || value === "organization" || value === "company") {
    return "organization";
  }
  return "individual";
}

function mapCategory(tx: ApiTransaction, risk?: ApiTransactionRisk | null): TmTxCategory {
  const meta = metaOf(tx);
  const raw =
    asString(risk?.category) ??
    asString(tx.category) ??
    asString(meta.category) ??
    asString(meta.tmCategory) ??
    asString(meta.queue);
  const value = (raw ?? "").toLowerCase().replace(/_/g, "-");
  if (value.includes("stop")) return "stop-payment";
  if (value.includes("cumul") || value.includes("frequency")) return "cumulative-frequency";
  if (value.includes("not-block") || value.includes("cleared")) return "tm-not-blocked";
  if (value.includes("block")) return "tm-blocked";
  return "tm-not-blocked";
}

function mapStatus(tx: ApiTransaction, risk?: ApiTransactionRisk | null): TmTxStatus {
  const meta = metaOf(tx);
  const raw =
    asString(risk?.status) ??
    asString(tx.status) ??
    asString(meta.status) ??
    asString(meta.analystStatus);
  const value = (raw ?? "").toLowerCase().replace(/_/g, "-");
  if (value.includes("block")) return "blocked";
  if (value.includes("review")) return "in-review";
  if (value.includes("pending")) return "pending";
  if (value.includes("clear") || value.includes("approved") || value.includes("pass")) return "cleared";
  const category = mapCategory(tx, risk);
  if (category === "tm-blocked") return "blocked";
  if (category === "stop-payment" || category === "cumulative-frequency") {
    return "pending";
  }
  return "cleared";
}

function severityFromScore(score: number): string {
  if (score >= 80) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function severityOf(score: number, risk?: ApiTransactionRisk | null): string {
  const level = asString(risk?.riskLevel);
  return level ? humanize(level.toLowerCase()) : severityFromScore(score);
}

function categoryLabel(category: TmTxCategory): string {
  const labels: Record<TmTxCategory, string> = {
    "tm-not-blocked": "TM Not-Blocked",
    "stop-payment": "Stop Payment",
    "cumulative-frequency": "Cumulative Frequency",
    "tm-blocked": "TM Blocked",
  };
  return labels[category];
}

function statusLabel(status: TmTxStatus): string {
  const labels: Record<TmTxStatus, string> = {
    pending: "Pending",
    cleared: "Cleared",
    "in-review": "In Review",
    blocked: "Blocked",
  };
  return labels[status];
}

function displayTransactionId(tx: ApiTransaction): string {
  const id = asString(tx.id) ?? asString(tx.reference) ?? "unknown";
  if (id.startsWith("#") || id.toUpperCase().startsWith("TXN")) {
    return id;
  }
  const short = id.length > 8 ? id.slice(-6).toUpperCase() : id.toUpperCase();
  return `#${short}`;
}

function riskScoreOf(tx: ApiTransaction, risk?: ApiTransactionRisk | null): number {
  const meta = metaOf(tx);
  return (
    asNumber(risk?.riskScore) ??
    asNumber(tx.riskScore) ??
    asNumber(meta.riskScore) ??
    asNumber(meta.score) ??
    0
  );
}

function rulesTriggeredOf(tx: ApiTransaction, risk?: ApiTransactionRisk | null): number {
  const fromRisk = asNumber(risk?.rulesTriggerCount);
  if (fromRisk !== undefined) {
    return fromRisk;
  }
  const meta = metaOf(tx);
  const rules = meta.rules ?? meta.rulesTriggered ?? tx.rulesTriggered;
  if (Array.isArray(rules)) {
    return rules.length;
  }
  return asNumber(rules) ?? asNumber(meta.rulesCount) ?? 0;
}

/** customerId → display name, resolved from `GET /transactions/{id}/detail`. */
export type TmCustomerNameMap = Record<string, string>;

function customerNameOf(tx: ApiTransaction, names?: TmCustomerNameMap): string {
  const meta = metaOf(tx);
  return (
    asString(tx.customerName) ??
    (tx.customerId ? names?.[tx.customerId] : undefined) ??
    asString(meta.customerName) ??
    asString(meta.customerDisplayName) ??
    "Customer account"
  );
}

export function mapApiTransactionToRecord(
  tx: ApiTransaction,
  names?: TmCustomerNameMap,
): TmTransactionRecord | null {
  const id = asString(tx.id);
  if (!id) {
    return null;
  }
  const occurredAt = asString(tx.occurredAt) ?? asString(tx.createdAt);
  const score = riskScoreOf(tx);
  return {
    id,
    transactionId: displayTransactionId(tx),
    relativeTime: formatRelativeTime(occurredAt),
    absoluteTime: formatAbsoluteTime(occurredAt),
    customerName: customerNameOf(tx, names),
    amountLabel: formatAmountLabel(asNumber(tx.amount), asString(tx.currency)),
    category: mapCategory(tx),
    riskScore: score,
    rulesTriggered: rulesTriggeredOf(tx),
    status: mapStatus(tx),
    entityType: mapEntityType(asString(tx.profileType)),
    severityLabel: severityFromScore(score),
  };
}

function buildListMetrics(records: TmTransactionRecord[]): TmListMetric[] {
  const total = records.length;
  const notBlocked = records.filter((r) => r.category === "tm-not-blocked").length;
  const stopPayment = records.filter((r) => r.category === "stop-payment").length;
  const cumulative = records.filter((r) => r.category === "cumulative-frequency").length;
  const blocked = records.filter((r) => r.category === "tm-blocked").length;

  return [
    { id: "total", label: "Total Transaction", value: String(total), tone: "neutral" },
    { id: "not-blocked", label: "Not Blocked", value: String(notBlocked), tone: "success" },
    { id: "stop-payment", label: "Stop Payment", value: String(stopPayment), tone: "warning" },
    { id: "cumulative", label: "Cumulative Frequency", value: String(cumulative), tone: "info" },
    { id: "blocked", label: "TM-Blocked", value: String(blocked), tone: "error" },
  ];
}

export function mapApiTransactionsToListData(
  items: ApiTransaction[],
  names?: TmCustomerNameMap,
): TmTransactionsListData {
  const records = items
    .map((tx) => mapApiTransactionToRecord(tx, names))
    .filter((record): record is TmTransactionRecord => record !== null);

  return {
    metrics: buildListMetrics(records),
    records,
  };
}

type TmDetailContext = {
  customerName?: string | null;
  customerMaskedAccount?: string | null;
  risk?: ApiTransactionRisk | null;
  analystStatus?: string | null;
  riskNarrative?: string | null;
};

function mapRules(tx: ApiTransaction, risk?: ApiTransactionRisk | null): TmRuleResult[] {
  if (risk && Array.isArray(risk.matchedRules)) {
    return risk.matchedRules.map((rule, index) => ({
      id: asString(rule.ruleId) ?? `r${index + 1}`,
      label: asString(rule.ruleName) ?? `Rule ${index + 1}`,
      outcome: "flagged",
    }));
  }

  const meta = metaOf(tx);
  const raw = meta.rules ?? meta.ruleResults;
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.map((entry, index) => {
    const record = asRecord(entry);
    const label =
      asString(record?.label) ??
      asString(record?.name) ??
      asString(record?.rule) ??
      `Rule ${index + 1}`;
    const outcomeRaw = (asString(record?.outcome) ?? asString(record?.status) ?? "cleared").toLowerCase();
    const outcome: TmRuleResult["outcome"] =
      outcomeRaw.includes("flag") || outcomeRaw.includes("fail") || outcomeRaw.includes("hit")
        ? "flagged"
        : "cleared";
    return { id: asString(record?.id) ?? `r${index + 1}`, label, outcome };
  });
}

function mapTimeline(
  occurredAt: string | undefined,
  risk: ApiTransactionRisk | null | undefined,
  status: TmTxStatus,
  rulesCount: number,
): TmTimelineStep[] {
  const flagged = rulesCount > 0 || status === "blocked" || status === "pending";
  return [
    {
      id: "initiated",
      label: "Transaction initiated",
      timestamp: formatDateTime(occurredAt),
      tone: "success",
    },
    risk
      ? {
          id: "analysis",
          label: "System Analysis Complete",
          timestamp: formatDateTime(asString(risk.decidedAt)),
          tone: flagged ? "warning" : "success",
        }
      : {
          id: "analysis",
          label: "System Analysis Pending",
          detail: "Awaiting risk assessment",
          tone: "pending",
        },
    {
      id: "flagged",
      label: "Flagged for Review",
      detail: `TM ${statusLabel(status)} (${rulesCount} rule${rulesCount === 1 ? "" : "s"} triggered)`,
      tone: flagged ? "error" : "pending",
    },
    {
      id: "awaiting",
      label: "Awaiting Review",
      detail: "Analyst decision",
      tone: "info",
    },
  ];
}

function partyFromCounterparty(
  tx: ApiTransaction,
  direction: TmTxDirection,
  customerName: string,
): TmPartyDetails {
  const cp = asRecord(tx.counterparty);
  const name = counterpartyLabel(tx.counterparty);
  return {
    name,
    maskedId:
      maskAccount(asString(cp?.accountNumber)) ??
      asString(cp?.maskedId) ??
      asString(cp?.accountMask) ??
      "—",
    country: asString(cp?.countryCode) ?? asString(cp?.country) ?? "—",
    bank: asString(cp?.bank) ?? asString(cp?.bankName),
    bic: asString(cp?.bic) ?? asString(cp?.swift),
    sourceCountry: asString(tx.sourceCountryCode) ?? asString(cp?.sourceCountry),
    destinationCountry: asString(tx.destinationCountryCode) ?? asString(cp?.destinationCountry),
    recipient: direction === "incoming" ? customerName : name,
  };
}

function partyFromCustomer(
  tx: ApiTransaction,
  direction: TmTxDirection,
  customerName: string,
  maskedAccount: string | undefined,
  severity: string,
): TmPartyDetails {
  const meta = metaOf(tx);
  const customerSideCountry =
    direction === "incoming"
      ? asString(tx.destinationCountryCode)
      : asString(tx.sourceCountryCode);
  return {
    name: customerName,
    maskedId: maskedAccount ?? asString(meta.customerMaskedId) ?? "—",
    country: asString(meta.customerCountry) ?? customerSideCountry ?? "—",
    categoryLabel: mapEntityType(asString(tx.profileType)) === "organization" ? "Organization" : "Individual",
    riskLabel: severity.toUpperCase(),
    dateOfBirth: asString(meta.dateOfBirth) ?? "-",
    nationalCode: asString(meta.nationalCode) ?? "-",
    activities: asString(meta.activities) ?? "-",
    activityDescription: asString(meta.activityDescription) ?? "-",
    registrationDate: asString(meta.registrationDate) ?? "-",
  };
}

function riskFindingsOf(score: number, rules: TmRuleResult[], narrative?: string): string[] {
  if (narrative) {
    return [narrative];
  }
  const flagged = rules.filter((rule) => rule.outcome === "flagged");
  if (flagged.length > 0) {
    return flagged.map((rule) => `${rule.label} rule matched`);
  }
  return score > 0
    ? ["Risk score contributed by risk-score rules; no detection rule matched."]
    : ["No elevated risk signals returned for this transaction."];
}

export function mapApiTransactionToDetail(
  tx: ApiTransaction,
  context: TmDetailContext = {},
): TmTransactionDetail | null {
  const id = asString(tx.id);
  if (!id) {
    return null;
  }

  const { risk } = context;
  const occurredAt = asString(tx.occurredAt) ?? asString(tx.createdAt);
  const category = mapCategory(tx, risk);
  const status = mapStatus(tx, risk);
  const score = riskScoreOf(tx, risk);
  const rulesCount = rulesTriggeredOf(tx, risk);
  const severity = severityOf(score, risk);
  const direction = mapDirection(asString(tx.direction));
  const meta = metaOf(tx);
  const device = asRecord(tx.deviceInfo);
  const amountLabel = formatAmountLabel(asNumber(tx.amount), asString(tx.currency));
  const paymentMethod = humanize(asString(tx.channel));
  const customerName = asString(context.customerName) ?? customerNameOf(tx);
  const rules = mapRules(tx, risk);
  const isNewDevice = device?.isNewDevice;

  return {
    id,
    customerId: asString(tx.customerId),
    transactionId: asString(tx.reference)
      ? `TXN-${asString(tx.reference)}`
      : `TXN-${displayTransactionId(tx).replace("#", "")}`,
    direction,
    category,
    categoryLabel: categoryLabel(category),
    severityLabel: severity,
    riskScore: score,
    riskHeadline:
      score > 0
        ? `${score}% Alert triggered (${categoryLabel(category)})`
        : `0% Risk Score (${categoryLabel(category)})`,
    riskFindings: riskFindingsOf(score, rules, asString(context.riskNarrative)),
    amountLabel,
    typeLabel: direction === "incoming" ? "Incoming Payment" : "Outgoing Payment",
    analystStatus: asString(context.analystStatus) ?? asString(meta.analystStatus) ?? "-",
    dateTime: formatDateTime(occurredAt),
    customerName,
    paymentPurpose:
      asString(tx.paymentPurpose) ?? asString(meta.paymentPurpose) ?? asString(meta.purpose) ?? "-",
    sourceCountry:
      asString(tx.sourceCountryCode) ?? asString(tx.corridorCountryCode) ?? asString(meta.sourceCountry) ?? "-",
    counterparty: partyFromCounterparty(tx, direction, customerName),
    customer: partyFromCustomer(
      tx,
      direction,
      customerName,
      asString(context.customerMaskedAccount),
      severity,
    ),
    rules,
    relatedTransactions: [],
    relatedTotalCount: 0,
    timeline: mapTimeline(occurredAt, risk, status, rulesCount),
    quickStats: [
      { label: "Customer ID", value: asString(tx.customerId) ?? "—" },
      { label: "Email", value: asString(meta.email) ?? asString(meta.customerEmail) ?? "-" },
      { label: "Device", value: asString(device?.device) ?? "-" },
      { label: "Payment Method", value: paymentMethod },
    ],
    metadata: [
      { label: "Merchant", value: asString(tx.merchant) ?? "-" },
      { label: "Payment Method", value: paymentMethod },
      { label: "Device", value: asString(device?.device) ?? "-" },
      { label: "IP Address", value: asString(device?.ipAddress) ?? "-" },
      { label: "Detection", value: risk ? statusLabel(status) : "Pending" },
      {
        label: "New Device",
        value: typeof isNewDevice === "boolean" ? (isNewDevice ? "YES" : "NO") : "-",
      },
    ],
  };
}

export function mapApiTransactionDetailPayload(
  payload: ApiTransactionDetail,
): TmTransactionDetail | null {
  return mapApiTransactionToDetail(payload.transaction, {
    customerName: payload.customer?.name,
    customerMaskedAccount: payload.customer?.maskedAccount,
    risk: payload.risk,
    analystStatus: payload.analystStatus,
    riskNarrative: payload.riskNarrative,
  });
}
