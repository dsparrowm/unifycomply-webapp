export type KycMetric = {
  id: string;
  label: string;
  value: number;
  tone: "success" | "info" | "warning" | "error";
};

export type KycRecord = {
  id: string;
  customerName: string;
  documentType: string;
  country: string;
  status: string;
  priority: string;
  riskScore: string;
  timeInQueue: string;
};

export const kycMetrics: KycMetric[] = [
  { id: "successful", label: "Successful Verification", value: 0, tone: "success" },
  { id: "pending", label: "Pending Verification", value: 0, tone: "info" },
  { id: "high-risk", label: "High Risk Alert", value: 0, tone: "warning" },
  { id: "rejected", label: "Rejected Verification", value: 0, tone: "error" },
];

export const kycRecords: KycRecord[] = [];
