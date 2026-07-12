import type { KybListData, KybMetric, KybRecord } from "@/types/kyb";

const kybRecordsMock: KybRecord[] = [
  {
    id: "kyb-record-1",
    kybId: "KYB-2024-0081",
    businessName: "Bluewave Technologies Ltd",
    businessType: "Private Limited Company",
    country: "Nigeria",
    status: "approved",
    priority: "low",
    riskScore: 0,
    timeInQueue: "3h 20m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyb-record-2",
    kybId: "KYB-2024-0082",
    businessName: "Acme Holdings Nigeria",
    businessType: "Public Limited Company",
    country: "Nigeria",
    status: "in-review",
    priority: "medium",
    riskScore: 2,
    timeInQueue: "1d 4h",
    submittedAt: "2026-07-10",
  },
  {
    id: "kyb-record-3",
    kybId: "KYB-2024-0083",
    businessName: "Sunrise Agro Exports",
    businessType: "Partnership",
    country: "Ghana",
    status: "pending",
    priority: "medium",
    riskScore: 1,
    timeInQueue: "6h 12m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyb-record-4",
    kybId: "KYB-2024-0084",
    businessName: "Vertex Capital Partners",
    businessType: "Limited Liability Partnership",
    country: "Kenya",
    status: "escalated",
    priority: "critical",
    riskScore: 4,
    timeInQueue: "5d 9h",
    submittedAt: "2026-07-06",
  },
  {
    id: "kyb-record-5",
    kybId: "KYB-2024-0085",
    businessName: "TechVentures Nigeria Limited",
    businessType: "Private Limited Company",
    country: "Nigeria",
    status: "pending",
    priority: "high",
    riskScore: 3,
    timeInQueue: "2d 18h",
    submittedAt: "2026-07-08",
  },
  {
    id: "kyb-record-6",
    kybId: "KYB-2024-0086",
    businessName: "Greenfield Logistics",
    businessType: "Sole Proprietorship",
    country: "Nigeria",
    status: "approved",
    priority: "low",
    riskScore: 0,
    timeInQueue: "45m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyb-record-7",
    kybId: "KYB-2024-0087",
    businessName: "Cedar Properties Group",
    businessType: "Private Limited Company",
    country: "South Africa",
    status: "rejected",
    priority: "high",
    riskScore: 3,
    timeInQueue: "4d 2h",
    submittedAt: "2026-06-20",
  },
  {
    id: "kyb-record-8",
    kybId: "KYB-2024-0088",
    businessName: "Nova Energy Trading",
    businessType: "Public Limited Company",
    country: "Nigeria",
    status: "pending",
    priority: "low",
    riskScore: 1,
    timeInQueue: "9h 33m",
    submittedAt: "2026-07-10",
  },
  {
    id: "kyb-record-9",
    kybId: "KYB-2024-0089",
    businessName: "Harbor Marine Services",
    businessType: "Private Limited Company",
    country: "Nigeria",
    status: "escalated",
    priority: "critical",
    riskScore: 4,
    timeInQueue: "6d 1h",
    submittedAt: "2026-07-04",
  },
  {
    id: "kyb-record-10",
    kybId: "KYB-2024-0090",
    businessName: "Summit Retail Africa",
    businessType: "Private Limited Company",
    country: "Nigeria",
    status: "approved",
    priority: "low",
    riskScore: 0,
    timeInQueue: "2h 05m",
    submittedAt: "2026-07-11",
  },
];

const kybEmptyMetrics: KybMetric[] = [
  { id: "successful", label: "Successful verification", value: 0, tone: "success" },
  { id: "pending", label: "Pending Verification", value: 0, tone: "info" },
  { id: "high-risk", label: "High Risk Alert", value: 0, tone: "warning" },
  { id: "rejected", label: "Rejected verification", value: 0, tone: "error" },
];

/** Metrics per Figma frame 84 (`886:108206`) — populated list reference. */
const kybPopulatedMetrics: KybMetric[] = [
  { id: "successful", label: "Successful verification", value: 12, tone: "success" },
  { id: "pending", label: "Pending Verification", value: 4, tone: "info" },
  { id: "high-risk", label: "High Risk Alert", value: 4, tone: "warning" },
  { id: "rejected", label: "Rejected verification", value: 4, tone: "error" },
];

/** Default empty list — Figma frame 79 (`886:106307`). */
export const kybListDataEmpty: KybListData = {
  records: [],
  metrics: kybEmptyMetrics,
};

/** Populated list fixture — Figma frame 84 (`886:108206`). */
export const kybListDataPopulated: KybListData = {
  records: kybRecordsMock,
  metrics: kybPopulatedMetrics,
};

/** Default export — empty state per frame 79. */
export const kybListData = kybListDataEmpty;
