import type { AmlBatchEntity, AmlBatchResult, AmlMetric } from "@/types/aml";

const batchMetrics: AmlMetric[] = [
  { id: "total", label: "Total Screened", value: 14 },
  { id: "matches", label: "Matches Found", value: 8 },
  { id: "none", label: "No Matches", value: 3 },
  { id: "errors", label: "Errors", value: 3 },
];

/** Frame 24 — AML Screening / Batch Lookup / techventures */
const techventuresRecords: AmlBatchEntity[] = [
  {
    id: "aml-batch-1",
    amlId: "#3066",
    customerName: "Cephas Trust",
    entityType: "corporate",
    country: "NG",
    matches: 3,
    riskScore: 2,
    assignedTo: null,
    status: "flagged",
    monitoringActive: true,
  },
  {
    id: "aml-batch-2",
    amlId: "#3065",
    customerName: "Mary Peter",
    entityType: "individual",
    country: "NG",
    matches: 3,
    riskScore: 3,
    assignedTo: "Alimi Ayomikun",
    status: "clear",
    monitoringActive: false,
  },
  {
    id: "aml-batch-3",
    amlId: "#3064",
    customerName: "Chris Sam",
    entityType: "corporate",
    country: "NG",
    matches: 3,
    riskScore: 2,
    assignedTo: "Alimi Ayomikun",
    status: "flagged",
    monitoringActive: true,
  },
  {
    id: "aml-batch-4",
    amlId: "#3063",
    customerName: "Mikun Peter",
    entityType: "corporate",
    country: "GH",
    matches: 0,
    riskScore: 1,
    assignedTo: null,
    status: "flagged",
    monitoringActive: true,
  },
  {
    id: "aml-batch-5",
    amlId: "#3062",
    customerName: "Kate Morrison",
    entityType: "individual",
    country: "NG",
    matches: 0,
    riskScore: 0,
    assignedTo: "Alimi Ayomikun",
    status: "flagged",
    monitoringActive: true,
  },
  {
    id: "aml-batch-6",
    amlId: "#3061",
    customerName: "Drew Cano",
    entityType: "individual",
    country: "NG",
    matches: 3,
    riskScore: 3,
    assignedTo: "Tejumade Olomola",
    status: "clear",
    monitoringActive: false,
  },
  {
    id: "aml-batch-7",
    amlId: "#3060",
    customerName: "Andi Lane",
    entityType: "individual",
    country: "NG",
    matches: 3,
    riskScore: 2,
    assignedTo: "Favour Soma",
    status: "blocked",
    monitoringActive: false,
  },
  {
    id: "aml-batch-8",
    amlId: "#3059",
    customerName: "Peter Sam",
    entityType: "individual",
    country: "GH",
    matches: 3,
    riskScore: 4,
    assignedTo: null,
    status: "clear",
    monitoringActive: false,
  },
  {
    id: "aml-batch-9",
    amlId: "#3058",
    customerName: "Tejumade Olomola",
    entityType: "individual",
    country: "NG",
    matches: 3,
    riskScore: 2,
    assignedTo: null,
    status: "clear",
    monitoringActive: false,
  },
  {
    id: "aml-batch-10",
    amlId: "#3057",
    customerName: "Favour Chris",
    entityType: "corporate",
    country: "GH",
    matches: 3,
    riskScore: 4,
    assignedTo: "Favour Soma",
    status: "flagged",
    monitoringActive: true,
  },
];

export const amlBatchCountryLabels: Record<AmlBatchEntity["country"], string> = {
  NG: "Nigeria",
  GH: "Ghana",
};

export const amlBatchCountryFlags: Record<AmlBatchEntity["country"], string> = {
  NG: "🇳🇬",
  GH: "🇬🇭",
};

export function getAmlBatchLookupSlug(fileName: string) {
  const slug = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  return slug || "techventures";
}

export function getAmlBatchResult(id: string): AmlBatchResult {
  return {
    id,
    lookupSlug: id,
    metrics: batchMetrics,
    records: techventuresRecords,
  };
}
