import { tmTransactionRecordsMock } from "@/lib/data/transactions";
import type {
  TmListMetric,
  TmQueueId,
  TmQueueListData,
  TmTransactionRecord,
  TmTxCategory,
} from "@/types/transaction-monitoring";

const opsEmptyMetrics: TmListMetric[] = [
  { id: "total", label: "Total Transaction", value: "0", tone: "neutral" },
  { id: "amount", label: "Total Amount", value: "0", tone: "neutral" },
  { id: "pending", label: "Pending Review", value: "0", tone: "warning" },
  { id: "resolved", label: "Resolved", value: "0", tone: "success" },
];

function byCategory(category: TmTxCategory): TmTransactionRecord[] {
  return tmTransactionRecordsMock.filter((record) => record.category === category);
}

/** Figma `TM Category-13` populated / `TM Category-12` empty. */
export const tmNotBlockedQueuePopulated: TmQueueListData = {
  queueId: "tm-not-blocked",
  title: "TM Not-Blocked",
  subtitle: "Transactions cleared for processing",
  metrics: [
    { id: "total", label: "Total Transaction", value: "24", tone: "neutral" },
    { id: "amount", label: "Total Amount", value: "$200k", tone: "neutral" },
    { id: "pending", label: "Pending Review", value: "0", tone: "warning" },
    { id: "resolved", label: "Resolved", value: "0", tone: "success" },
  ],
  records: byCategory("tm-not-blocked"),
  columns: ["timestamp", "customer", "amount", "entity"],
  showStatusFilter: false,
};

export const tmNotBlockedQueueEmpty: TmQueueListData = {
  ...tmNotBlockedQueuePopulated,
  metrics: opsEmptyMetrics,
  records: [],
};

/**
 * Stop Payment — Figma `design/figma/webapp/tm/stop-payment/list-populated.png`
 * (export `TM Category-2` from Unifycomply (2).zip).
 */
export const tmStopPaymentQueuePopulated: TmQueueListData = {
  queueId: "stop-payment",
  title: "Stop Payment",
  subtitle: "Payments halted for review",
  metrics: [
    { id: "total", label: "Total Transaction", value: "12", tone: "neutral" },
    { id: "amount", label: "Total Amount", value: "$800k", tone: "neutral" },
    { id: "pending", label: "Pending Review", value: "7", tone: "warning" },
    { id: "resolved", label: "Resolved", value: "2", tone: "success" },
  ],
  records: byCategory("stop-payment"),
  columns: ["timestamp", "customer", "amount", "riskScore", "severity", "rules", "status"],
  showStatusFilter: true,
};

export const tmStopPaymentQueueEmpty: TmQueueListData = {
  ...tmStopPaymentQueuePopulated,
  metrics: opsEmptyMetrics,
  records: [],
};

/** Figma `TM Category-6` empty default. */
export const tmCumulativeFrequencyQueueEmpty: TmQueueListData = {
  queueId: "cumulative-frequency",
  title: "Cumulative Frequency",
  subtitle: "High-frequency transaction monitoring",
  metrics: opsEmptyMetrics,
  records: [],
  columns: ["timestamp", "entity", "amount", "riskScore", "status", "rules", "severity"],
  showStatusFilter: true,
};

export const tmCumulativeFrequencyQueuePopulated: TmQueueListData = {
  ...tmCumulativeFrequencyQueueEmpty,
  metrics: [
    { id: "total", label: "Total Transaction", value: "2", tone: "neutral" },
    { id: "amount", label: "Total Amount", value: "₦446k", tone: "neutral" },
    { id: "pending", label: "Pending Review", value: "1", tone: "warning" },
    { id: "resolved", label: "Resolved", value: "0", tone: "success" },
  ],
  records: byCategory("cumulative-frequency"),
};

/** Figma `TM Category-5` populated. */
export const tmBlockedQueuePopulated: TmQueueListData = {
  queueId: "tm-blocked",
  title: "TM Blocked",
  subtitle: "Transactions halted",
  metrics: [
    { id: "total", label: "Total Transaction", value: "10", tone: "neutral" },
    { id: "amount", label: "Total Amount", value: "$2.3M", tone: "neutral" },
  ],
  records: byCategory("tm-blocked").map((record) => ({
    ...record,
    riskScore: record.riskScore === 0 ? 90 : record.riskScore,
    rulesTriggered: Math.max(record.rulesTriggered, 2),
    severityLabel: "High",
  })),
  columns: ["timestamp", "customer", "amount", "riskScore", "rules"],
  showStatusFilter: false,
};

export const tmQueueDataById: Record<TmQueueId, TmQueueListData> = {
  "tm-not-blocked": tmNotBlockedQueuePopulated,
  "stop-payment": tmStopPaymentQueuePopulated,
  "cumulative-frequency": tmCumulativeFrequencyQueueEmpty,
  "tm-blocked": tmBlockedQueuePopulated,
};
