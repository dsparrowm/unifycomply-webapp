import type { KycListData, KycMetric, KycRecord } from "@/types/kyc";

const kycRecordsMock: KycRecord[] = [
  {
    id: "kyc-record-1",
    kycId: "KYC-2024-0154",
    customerName: "Ahmed Musa",
    documentType: "National ID + Selfie",
    country: "Nigeria",
    status: "approved",
    priority: "low",
    riskScore: 0,
    timeInQueue: "2h 14m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyc-record-2",
    kycId: "KYC-2024-0155",
    customerName: "Favour Peter Soma",
    documentType: "National ID + Selfie",
    country: "Nigeria",
    status: "in-review",
    priority: "medium",
    riskScore: 1,
    timeInQueue: "12m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyc-record-3",
    kycId: "KYC-2024-0156",
    customerName: "Chioma Nwosu",
    documentType: "Passport",
    country: "Nigeria",
    status: "in-review",
    priority: "high",
    riskScore: 3,
    timeInQueue: "3d 2h",
    submittedAt: "2026-07-08",
  },
  {
    id: "kyc-record-4",
    kycId: "KYC-2024-0157",
    customerName: "James Okafor",
    documentType: "Driver's License",
    country: "Nigeria",
    status: "escalated",
    priority: "critical",
    riskScore: 4,
    timeInQueue: "5d 11h",
    submittedAt: "2026-07-05",
  },
  {
    id: "kyc-record-5",
    kycId: "KYC-2024-0158",
    customerName: "Sarah Mensah",
    documentType: "National ID",
    country: "Ghana",
    status: "rejected",
    priority: "high",
    riskScore: 3,
    timeInQueue: "4d 8h",
    submittedAt: "2026-06-15",
  },
  {
    id: "kyc-record-6",
    kycId: "KYC-2024-0159",
    customerName: "Tejumade Olomola",
    documentType: "National ID + Selfie",
    country: "Nigeria",
    status: "approved",
    priority: "low",
    riskScore: 0,
    timeInQueue: "45m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyc-record-7",
    kycId: "KYC-2024-0160",
    customerName: "David Kimani",
    documentType: "Passport",
    country: "Kenya",
    status: "pending",
    priority: "medium",
    riskScore: 2,
    timeInQueue: "18h 32m",
    submittedAt: "2026-07-09",
  },
  {
    id: "kyc-record-8",
    kycId: "KYC-2024-0161",
    customerName: "Amina Hassan",
    documentType: "National ID",
    country: "Nigeria",
    status: "in-review",
    priority: "medium",
    riskScore: 2,
    timeInQueue: "2d 4h",
    submittedAt: "2026-07-07",
  },
  {
    id: "kyc-record-9",
    kycId: "KYC-2024-0162",
    customerName: "Michael Adeyemi",
    documentType: "National ID + Selfie",
    country: "Nigeria",
    status: "approved",
    priority: "low",
    riskScore: 0,
    timeInQueue: "1h 05m",
    submittedAt: "2026-07-11",
  },
  {
    id: "kyc-record-10",
    kycId: "KYC-2024-0163",
    customerName: "Grace Okonkwo",
    documentType: "Passport",
    country: "Nigeria",
    status: "pending",
    priority: "low",
    riskScore: 1,
    timeInQueue: "6h 48m",
    submittedAt: "2026-07-10",
  },
  {
    id: "kyc-record-11",
    kycId: "KYC-2024-0164",
    customerName: "Ibrahim Bello",
    documentType: "National ID",
    country: "Nigeria",
    status: "rejected",
    priority: "critical",
    riskScore: 4,
    timeInQueue: "7d 3h",
    submittedAt: "2026-05-20",
  },
  {
    id: "kyc-record-12",
    kycId: "KYC-2024-0165",
    customerName: "Linda Chukwu",
    documentType: "Driver's License",
    country: "Nigeria",
    status: "escalated",
    priority: "high",
    riskScore: 3,
    timeInQueue: "4d 19h",
    submittedAt: "2026-04-10",
  },
];

const kycEmptyMetrics: KycMetric[] = [
  { id: "successful", label: "Successful verification", value: 0, tone: "success" },
  { id: "pending", label: "Pending Verification", value: 0, tone: "info" },
  { id: "high-risk", label: "High Risk Alert", value: 0, tone: "warning" },
  { id: "rejected", label: "Rejected verification", value: 0, tone: "error" },
];

/** Metrics per Figma frame 86 (`886:73019`) — populated list reference. */
const kycPopulatedMetrics: KycMetric[] = [
  { id: "successful", label: "Successful verification", value: 12, tone: "success" },
  { id: "pending", label: "Pending Verification", value: 6, tone: "info" },
  { id: "high-risk", label: "High Risk Alert", value: 2, tone: "warning" },
  { id: "rejected", label: "Rejected verification", value: 1, tone: "error" },
];

/** Default empty list — Figma frame 79 (`886:70409`). */
export const kycListDataEmpty: KycListData = {
  records: [],
  metrics: kycEmptyMetrics,
};

/** Populated list fixture — Figma frame 86 (`886:73019`); use after Add Customer / lookup flows. */
export const kycListDataPopulated: KycListData = {
  records: kycRecordsMock,
  metrics: kycPopulatedMetrics,
};

/** Default export — empty state per frame 79. */
export const kycListData = kycListDataEmpty;

/** @deprecated Use kycListData.metrics */
export const kycMetrics = kycListData.metrics;

/** @deprecated Use kycListData.records */
export const kycRecords = kycListData.records;
