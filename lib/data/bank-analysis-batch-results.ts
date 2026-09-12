import type {
  BankAnalysisBatchEntity,
  BankAnalysisBatchResult,
  BankAnalysisMetric,
} from "@/types/bank-analysis";

const batchMetrics: BankAnalysisMetric[] = [
  { id: "total-screening", label: "Total screening", value: 20, tone: "info" },
  { id: "total-alerts", label: "Total Alerts Generated", value: 8, tone: "warning" },
  { id: "completed", label: "Completed", value: 12, tone: "success" },
  {
    id: "high-risk",
    label: "high risk Entity",
    value: 3,
    tone: "error",
  },
];

/** Frame 18 — Bank Analysis / Batch Lookup / techventures */
const techventuresRecords: BankAnalysisBatchEntity[] = [
  {
    id: "ba-batch-1",
    runId: "#30666",
    fullName: "Peter Kelvin",
    date: "19/01/2026",
    entityType: "individual",
    accounts: 4,
    assignedTo: null,
    alerts: 5,
    riskScore: 2,
    status: "flagged",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-batch-2",
    runId: "#30665",
    fullName: "Mary Peter",
    date: "20/01/2026",
    entityType: "organization",
    accounts: 5,
    assignedTo: "Alimi Ayomikun",
    alerts: 0,
    riskScore: 3,
    status: "clear",
    submittedAt: "2026-01-20",
  },
  {
    id: "ba-batch-3",
    runId: "#30664",
    fullName: "Corporate User.csv",
    date: "21/01/2026",
    entityType: "individual",
    accounts: 6,
    assignedTo: "Alimi Ayomikun",
    alerts: 2,
    riskScore: 2,
    status: "in-review",
    submittedAt: "2026-01-21",
  },
  {
    id: "ba-batch-4",
    runId: "#30663",
    fullName: "Customer_List.csv",
    date: "25/01/2026",
    entityType: "individual",
    accounts: 2,
    assignedTo: null,
    alerts: 2,
    riskScore: 1,
    status: "flagged",
    submittedAt: "2026-01-25",
  },
  {
    id: "ba-batch-5",
    runId: "#30662",
    fullName: "Kate Morrison",
    date: "19/01/2026",
    entityType: "individual",
    accounts: 10,
    assignedTo: "Alimi Ayomikun",
    alerts: 2,
    riskScore: 0,
    status: "flagged",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-batch-6",
    runId: "#30661",
    fullName: "Drew Cano",
    date: "19/01/2026",
    entityType: "individual",
    accounts: 4,
    assignedTo: "Tejumade Olomola",
    alerts: 0,
    riskScore: 3,
    status: "clear",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-batch-7",
    runId: "#30660",
    fullName: "Andi Lane",
    date: "29/01/2026",
    entityType: "organization",
    accounts: 3,
    assignedTo: "Favour Soma",
    alerts: 0,
    riskScore: 2,
    status: "blocked",
    submittedAt: "2026-01-29",
  },
  {
    id: "ba-batch-8",
    runId: "#30659",
    fullName: "Peter Sam",
    date: "19/01/2026",
    entityType: "organization",
    accounts: 2,
    assignedTo: null,
    alerts: 2,
    riskScore: 4,
    status: "clear",
    submittedAt: "2026-01-19",
  },
  {
    id: "ba-batch-9",
    runId: "#30658",
    fullName: "Tejumade Olomola",
    date: "24/01/2026",
    entityType: "organization",
    accounts: 5,
    assignedTo: null,
    alerts: 0,
    riskScore: 2,
    status: "clear",
    submittedAt: "2026-01-24",
  },
  {
    id: "ba-batch-10",
    runId: "#30657",
    fullName: "Favour Chris",
    date: "29/01/2026",
    entityType: "individual",
    accounts: 6,
    assignedTo: "Favour Soma",
    alerts: 0,
    riskScore: 4,
    status: "in-review",
    submittedAt: "2026-01-29",
  },
];

export function getBankAnalysisBatchLookupSlug(fileName: string) {
  const slug = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return slug || "techventures";
}

export function getBankAnalysisBatchResult(id: string): BankAnalysisBatchResult {
  return {
    id,
    lookupSlug: id,
    metrics: batchMetrics,
    records: techventuresRecords,
  };
}