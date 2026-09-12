import { kybBatchesMock } from "@/lib/data/kyb-batches";
import type { KybBatchRecord, KybBatchResult, KybRecord } from "@/types/kyb";

/** Frame 137 business rows. Risk 5 in Figma is stored as 4 (0–4 scale). */
const kybBatchResultRecords: KybRecord[] = [
  {
    id: "kyb-batch-biz-1",
    kybId: "#3066",
    businessName: "TechVentures LTD",
    businessType: "Private Limited Company",
    verificationType: "CAC",
    country: "Nigeria",
    status: "pending",
    priority: "critical",
    assignedTo: null,
    riskScore: 4,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-2",
    kybId: "#3065",
    businessName: "Lagos Import & Export",
    businessType: "Corporation",
    verificationType: "Memorandum",
    country: "Nigeria",
    status: "pending",
    priority: "high",
    assignedTo: "Alimi Ayomikun",
    riskScore: 3,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-3",
    kybId: "#3064",
    businessName: "Demi & Walkins International",
    businessType: "International",
    verificationType: "TIN",
    country: "Nigeria",
    status: "pending",
    priority: "medium",
    assignedTo: "Alimi Ayomikun",
    riskScore: 2,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-4",
    kybId: "#3063",
    businessName: "Xtech LTD",
    businessType: "Limited Company",
    verificationType: "CAC",
    country: "Ghana",
    status: "pending",
    priority: "low",
    assignedTo: null,
    riskScore: 1,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-5",
    kybId: "#3062",
    businessName: "DeltaTA Manufacturing",
    businessType: "Manufacturing",
    verificationType: "CAC",
    country: "Nigeria",
    status: "pending",
    priority: "low",
    assignedTo: "Alimi Ayomikun",
    riskScore: 0,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-6",
    kybId: "#3061",
    businessName: "Stack Limited Liability",
    businessType: "Limited Liability",
    verificationType: "TIN",
    country: "Nigeria",
    status: "pending",
    priority: "high",
    assignedTo: "Tejumade Olomola",
    riskScore: 3,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-7",
    kybId: "#3060",
    businessName: "TechVentures LTD",
    businessType: "Private Limited Company",
    verificationType: "CAC",
    country: "Nigeria",
    status: "rejected",
    priority: "medium",
    assignedTo: "Favour Soma",
    riskScore: 2,
    timeInQueue: "2hrs 2mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-8",
    kybId: "#3059",
    businessName: "Lagos Import & Export",
    businessType: "Corporation",
    verificationType: "Due Diligence",
    country: "Ghana",
    status: "pending",
    priority: "critical",
    assignedTo: null,
    riskScore: 4,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-9",
    kybId: "#3058",
    businessName: "Demi & Walkins International",
    businessType: "International",
    verificationType: "Memorandum",
    country: "Nigeria",
    status: "pending",
    priority: "medium",
    assignedTo: null,
    riskScore: 2,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
  {
    id: "kyb-batch-biz-10",
    kybId: "#3057",
    businessName: "DeltaTA Manufacturing",
    businessType: "Manufacturing",
    verificationType: "CAC",
    country: "Ghana",
    status: "pending",
    priority: "critical",
    assignedTo: "Favour Soma",
    riskScore: 4,
    timeInQueue: "30mins",
    submittedAt: "2025-02-12",
  },
];

export function getKybBatchLookupSlug(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\b(ltd|limited|llc)\b/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

export function getKybBatchResultRecords() {
  return kybBatchResultRecords;
}

const batchesById = new Map(kybBatchesMock.map((batch) => [batch.id, batch]));

export function getKybBatchById(id: string): KybBatchRecord | undefined {
  return batchesById.get(id);
}

export function getKybBatchResult(id: string): KybBatchResult | undefined {
  const batch = getKybBatchById(id);

  if (!batch) {
    return undefined;
  }

  return {
    batch,
    lookupSlug: getKybBatchLookupSlug(batch.fileName),
    records: kybBatchResultRecords,
  };
}
