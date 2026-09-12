import type {
  TmListMetric,
  TmTransactionDetail,
  TmTransactionRecord,
  TmTransactionsListData,
} from "@/types/transaction-monitoring";

const emptyMetrics: TmListMetric[] = [
  { id: "total", label: "Total Transaction", value: "0", tone: "neutral" },
  { id: "not-blocked", label: "Not Blocked", value: "0", tone: "success" },
  { id: "stop-payment", label: "Stop Payment", value: "0", tone: "warning" },
  { id: "cumulative", label: "Cumulative Frequency", value: "0", tone: "info" },
  { id: "blocked", label: "TM-Blocked", value: "0", tone: "error" },
];

const populatedMetrics: TmListMetric[] = [
  { id: "total", label: "Total Transaction", value: "10", tone: "neutral" },
  { id: "not-blocked", label: "Not Blocked", value: "6", tone: "success" },
  { id: "stop-payment", label: "Stop Payment", value: "1", tone: "warning" },
  { id: "cumulative", label: "Cumulative Frequency", value: "2", tone: "info" },
  { id: "blocked", label: "TM-Blocked", value: "1", tone: "error" },
];

/** Populated explorer rows — Figma `TM Category-7`. */
export const tmTransactionRecordsMock: TmTransactionRecord[] = [
  {
    id: "txn-3066",
    transactionId: "#3066",
    relativeTime: "8 minutes ago",
    absoluteTime: "08:11:15",
    customerName: "Sophie Williams",
    amountLabel: "€446,377",
    category: "stop-payment",
    riskScore: 60,
    rulesTriggered: 1,
    status: "pending",
    entityType: "individual",
    severityLabel: "Medium",
  },
  {
    id: "txn-3065",
    transactionId: "#3065",
    relativeTime: "8 minutes ago",
    absoluteTime: "08:11:15",
    customerName: "Daniel Kim",
    amountLabel: "$21,677",
    category: "tm-not-blocked",
    riskScore: 0,
    rulesTriggered: 0,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-3064",
    transactionId: "#3064",
    relativeTime: "8 minutes ago",
    absoluteTime: "08:11:15",
    customerName: "Nexus Corporation",
    amountLabel: "$21,677",
    category: "cumulative-frequency",
    riskScore: 0,
    rulesTriggered: 0,
    status: "in-review",
    entityType: "organization",
    severityLabel: "Low",
  },
  {
    id: "txn-3063",
    transactionId: "#3063",
    relativeTime: "8 minutes ago",
    absoluteTime: "08:11:15",
    customerName: "Sophie Williams",
    amountLabel: "€446,377",
    category: "tm-blocked",
    riskScore: 0,
    rulesTriggered: 0,
    status: "blocked",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-3062",
    transactionId: "#3062",
    relativeTime: "1 minute ago",
    absoluteTime: "08:11:15",
    customerName: "Sophie Williams",
    amountLabel: "₦446,377",
    category: "cumulative-frequency",
    riskScore: 60,
    rulesTriggered: 2,
    status: "pending",
    entityType: "individual",
    severityLabel: "Medium",
  },
  {
    id: "txn-3061",
    transactionId: "#3061",
    relativeTime: "12 minutes ago",
    absoluteTime: "08:07:02",
    customerName: "James Okonkwo",
    amountLabel: "$1,200.00",
    category: "tm-not-blocked",
    riskScore: 0,
    rulesTriggered: 0,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-3060",
    transactionId: "#3060",
    relativeTime: "18 minutes ago",
    absoluteTime: "08:01:44",
    customerName: "Anna Schmidt",
    amountLabel: "€5,600.00",
    category: "tm-not-blocked",
    riskScore: 0,
    rulesTriggered: 0,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-3059",
    transactionId: "#3059",
    relativeTime: "25 minutes ago",
    absoluteTime: "07:54:11",
    customerName: "Maria Lopez",
    amountLabel: "€780.50",
    category: "tm-not-blocked",
    riskScore: 0,
    rulesTriggered: 0,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-3058",
    transactionId: "#3058",
    relativeTime: "31 minutes ago",
    absoluteTime: "07:48:09",
    customerName: "Ibrahim Hassan",
    amountLabel: "$3,100.00",
    category: "tm-not-blocked",
    riskScore: 12,
    rulesTriggered: 0,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-3057",
    transactionId: "#3057",
    relativeTime: "40 minutes ago",
    absoluteTime: "07:39:22",
    customerName: "Emily Carter",
    amountLabel: "₦850,000",
    category: "tm-not-blocked",
    riskScore: 0,
    rulesTriggered: 0,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Low",
  },
  {
    id: "txn-sp-01",
    transactionId: "#3070",
    relativeTime: "3 minutes ago",
    absoluteTime: "08:14:02",
    customerName: "Sophie Williams",
    amountLabel: "€446,377",
    category: "stop-payment",
    riskScore: 90,
    rulesTriggered: 2,
    status: "pending",
    entityType: "individual",
    severityLabel: "High",
  },
  {
    id: "txn-sp-02",
    transactionId: "#3069",
    relativeTime: "5 minutes ago",
    absoluteTime: "08:12:40",
    customerName: "Daniel Kim",
    amountLabel: "$21,677",
    category: "stop-payment",
    riskScore: 60,
    rulesTriggered: 1,
    status: "pending",
    entityType: "individual",
    severityLabel: "Medium",
  },
  {
    id: "txn-sp-03",
    transactionId: "#3068",
    relativeTime: "9 minutes ago",
    absoluteTime: "08:08:11",
    customerName: "Nexus Corporation",
    amountLabel: "₦446,377",
    category: "stop-payment",
    riskScore: 80,
    rulesTriggered: 3,
    status: "blocked",
    entityType: "organization",
    severityLabel: "High",
  },
  {
    id: "txn-sp-04",
    transactionId: "#3067",
    relativeTime: "15 minutes ago",
    absoluteTime: "08:02:55",
    customerName: "Anna Schmidt",
    amountLabel: "$48,200",
    category: "stop-payment",
    riskScore: 45,
    rulesTriggered: 1,
    status: "cleared",
    entityType: "individual",
    severityLabel: "Medium",
  },
];

/** Empty explorer — Figma `TM Category-2`. */
export const tmTransactionsListEmpty: TmTransactionsListData = {
  metrics: emptyMetrics,
  records: [],
};

/** Populated explorer — Figma `TM Category-7`. */
export const tmTransactionsListPopulated: TmTransactionsListData = {
  metrics: populatedMetrics,
  records: tmTransactionRecordsMock,
};

export const tmTransactionsListData = tmTransactionsListPopulated;

const baseDetail: Omit<
  TmTransactionDetail,
  | "id"
  | "category"
  | "categoryLabel"
  | "riskScore"
  | "riskHeadline"
  | "riskFindings"
  | "rules"
  | "severityLabel"
> = {
  transactionId: "TXN-2026-175260",
  direction: "incoming",
  amountLabel: "USD 2,000.00",
  typeLabel: "Incoming Payment",
  analystStatus: "-",
  dateTime: "2026-03-07 | 15:16:49",
  customerName: "Anna Schmidt",
  paymentPurpose: "-",
  sourceCountry: "GB",
  counterparty: {
    name: "Sophie Williams",
    maskedId: "****9643",
    country: "GB",
    bank: "GB Bank",
    bic: "BICXX",
    sourceCountry: "GB",
    destinationCountry: "US",
    recipient: "Anna Schmidt",
  },
  customer: {
    name: "Anna Schmidt",
    maskedId: "****9643",
    country: "US",
    categoryLabel: "Individual",
    riskLabel: "LOW",
    dateOfBirth: "-",
    nationalCode: "-",
  },
  relatedTransactions: [
    {
      id: "rel-1",
      transactionId: "TXN-2024-175219",
      amountLabel: "€160,163",
      relativeTime: "2h ago",
    },
    {
      id: "rel-2",
      transactionId: "TXN-2024-175220",
      amountLabel: "€160,163",
      relativeTime: "2h ago",
    },
    {
      id: "rel-3",
      transactionId: "TXN-2024-175221",
      amountLabel: "€160,163",
      relativeTime: "2h ago",
    },
  ],
  relatedTotalCount: 12,
  timeline: [
    {
      id: "initiated",
      label: "Transaction initiated",
      timestamp: "2026-03-07 | 15:16:49",
      tone: "success",
    },
    {
      id: "analysis",
      label: "System Analysis Complete",
      timestamp: "2026-03-07 | 15:16:51",
      tone: "warning",
    },
    {
      id: "flagged",
      label: "Flagged for Review",
      detail: "Rules triggered",
      tone: "error",
    },
    {
      id: "awaiting",
      label: "Awaiting Review",
      detail: "Analyst decision",
      tone: "info",
    },
  ],
  quickStats: [
    { label: "Customer ID", value: "IND-2026-1024" },
    { label: "Email", value: "Anna@gmail.com" },
    { label: "Device", value: "Desktop" },
    { label: "Payment Method", value: "ACH" },
  ],
  metadata: [
    { label: "Merchant", value: "Sophie Williams" },
    { label: "Payment Method", value: "ACH" },
    { label: "Device", value: "Desktop" },
    { label: "IP Address", value: "192.168.1.24" },
    { label: "Detection", value: "Cleared" },
    { label: "New Device", value: "No" },
  ],
};

const detailByListId: Record<string, TmTransactionDetail> = {
  "txn-3066": {
    ...baseDetail,
    id: "txn-3066",
    category: "stop-payment",
    categoryLabel: "Stop Payment",
    severityLabel: "Medium",
    riskScore: 80,
    riskHeadline: "80% Alert triggered (Stop Payment)",
    riskFindings: [
      "Similar amount patterns: €150k-€170k range (potential structuring)",
      "Suspicious Geo-Location: 7 different recipients in cross-border transactions",
    ],
    rules: [
      { id: "r1", label: "Sanctions screening", outcome: "cleared" },
      { id: "r2", label: "Watchlist check", outcome: "cleared" },
      { id: "r3", label: "Suspicious(High Risk) Geo-Location", outcome: "flagged" },
      { id: "r4", label: "Pattern analysis", outcome: "flagged" },
      { id: "r5", label: "Velocity Spike Detection", outcome: "cleared" },
      { id: "r6", label: "New Device High Amount", outcome: "cleared" },
    ],
  },
  "txn-3062": {
    ...baseDetail,
    id: "txn-3062",
    category: "cumulative-frequency",
    categoryLabel: "Cumulative Frequency",
    severityLabel: "Medium",
    riskScore: 60,
    riskHeadline: "60% Alert triggered (Cumulative Frequency)",
    riskFindings: [
      "Unusual transaction velocity: 12 transactions in 24h (avg: 2-3 per week).",
      "Similar amount patterns: €150k-€170k range (potential structuring).",
      "Multiple counterparties: 7 different recipients in cross-border transactions.",
    ],
    rules: [
      { id: "r1", label: "Sanctions screening", outcome: "cleared" },
      { id: "r2", label: "Watchlist check", outcome: "cleared" },
      { id: "r3", label: "Risk threshold", outcome: "cleared" },
      { id: "r4", label: "New Device High Amount", outcome: "cleared" },
      { id: "r5", label: "Pattern analysis", outcome: "flagged" },
      { id: "r6", label: "Velocity Spike Detection", outcome: "flagged" },
    ],
  },
  "txn-3063": {
    ...baseDetail,
    id: "txn-3063",
    category: "tm-blocked",
    categoryLabel: "TM Blocked",
    severityLabel: "High",
    riskScore: 100,
    riskHeadline: "100% Alert triggered (Stop Payment)",
    riskFindings: [
      "Complex layering pattern identified - Multiple transactions designed to obscure fund origin",
      "Potential structuring activity detected - Amount designed to evade regulatory reporting",
    ],
    rules: [
      { id: "r1", label: "Sanctions screening", outcome: "flagged" },
      { id: "r2", label: "Watchlist check", outcome: "cleared" },
      { id: "r3", label: "Suspicious(High Risk) Geo-Location", outcome: "flagged" },
      { id: "r4", label: "Pattern analysis", outcome: "flagged" },
      { id: "r5", label: "Velocity Spike Detection", outcome: "cleared" },
      { id: "r6", label: "New Device High Amount", outcome: "cleared" },
    ],
  },
  "txn-3065": {
    ...baseDetail,
    id: "txn-3065",
    category: "tm-not-blocked",
    categoryLabel: "TM Not-Blocked",
    severityLabel: "Low",
    riskScore: 0,
    riskHeadline: "0% Risk Score (TM Not-Blocked)",
    riskFindings: ["No elevated risk signals detected for this transaction."],
    rules: [
      { id: "r1", label: "Sanctions screening", outcome: "cleared" },
      { id: "r2", label: "Watchlist check", outcome: "cleared" },
      { id: "r3", label: "Risk threshold", outcome: "cleared" },
      { id: "r4", label: "Pattern analysis", outcome: "cleared" },
      { id: "r5", label: "Velocity Spike Detection", outcome: "cleared" },
      { id: "r6", label: "New Device High Amount", outcome: "cleared" },
    ],
  },
};

export function getTmTransactionDetail(id: string): TmTransactionDetail | null {
  const listRecord = tmTransactionRecordsMock.find((record) => record.id === id);
  const withListCustomer = (detail: TmTransactionDetail): TmTransactionDetail => {
    if (!listRecord) return detail;
    return {
      ...detail,
      customerName: listRecord.customerName,
      customer: {
        ...detail.customer,
        name: listRecord.customerName,
      },
    };
  };

  if (detailByListId[id]) {
    return withListCustomer(detailByListId[id]);
  }

  if (!listRecord) {
    return null;
  }

  const categoryLabels = {
    "tm-not-blocked": "TM Not-Blocked",
    "stop-payment": "Stop Payment",
    "cumulative-frequency": "Cumulative Frequency",
    "tm-blocked": "TM Blocked",
  } as const;

  return {
    ...baseDetail,
    id: listRecord.id,
    transactionId: `TXN-2026-${listRecord.transactionId.replace("#", "")}`,
    customerName: listRecord.customerName,
    amountLabel: listRecord.amountLabel,
    customer: {
      ...baseDetail.customer,
      name: listRecord.customerName,
    },
    category: listRecord.category,
    categoryLabel: categoryLabels[listRecord.category],
    severityLabel:
      listRecord.riskScore >= 80 ? "High" : listRecord.riskScore >= 40 ? "Medium" : "Low",
    riskScore: listRecord.riskScore,
    riskHeadline: `${listRecord.riskScore}% Risk Score (${categoryLabels[listRecord.category]})`,
    riskFindings:
      listRecord.riskScore === 0
        ? ["No elevated risk signals detected for this transaction."]
        : [
            "Unusual transaction velocity detected against customer baseline.",
            "Pattern analysis flagged similar amount structures.",
          ],
    rules: [
      { id: "r1", label: "Sanctions screening", outcome: "cleared" },
      { id: "r2", label: "Watchlist check", outcome: "cleared" },
      {
        id: "r3",
        label: "Pattern analysis",
        outcome: listRecord.riskScore >= 60 ? "flagged" : "cleared",
      },
      {
        id: "r4",
        label: "Velocity Spike Detection",
        outcome: listRecord.rulesTriggered > 0 ? "flagged" : "cleared",
      },
    ],
  };
}
