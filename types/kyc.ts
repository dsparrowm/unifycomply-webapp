export type KycMetricTone = "success" | "info" | "warning" | "error";

export type KycMetric = {
  id: string;
  label: string;
  value: number;
  tone: KycMetricTone;
};

export type KycVerificationStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "in-review"
  | "escalated";

export type KycPriority = "low" | "medium" | "high" | "critical";

export type KycDateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last-7-days"
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "last-6-months"
  | "specific-range";

export type KycStatusFilter =
  | "all"
  | "success"
  | "pending"
  | "in-review"
  | "failed"
  | "error";

export type KycPriorityFilter = "all" | "urgent" | "high" | "medium" | "standard";

export type KycSearchModeFilter = "single-entity-search" | "bulk-search";

export type KycMoreFilter = "all" | "high-risk";

export type KycListFilters = {
  date: KycDateFilter;
  status: KycStatusFilter;
  priority: KycPriorityFilter;
  searchMode: KycSearchModeFilter;
  more: KycMoreFilter;
};

export type KycFilterOption<T extends string = string> = {
  value: T;
  label: string;
};

export type KycRecord = {
  id: string;
  kycId: string;
  customerName: string;
  documentType: string;
  country: string;
  status: KycVerificationStatus;
  priority: KycPriority;
  riskScore: number;
  timeInQueue: string;
  submittedAt: string;
};

export type KycListData = {
  metrics: KycMetric[];
  records: KycRecord[];
};

export type KycDetailTab =
  | "document"
  | "risk-analysis"
  | "aml-screening"
  | "ip-device"
  | "liveness";

export type KycExtractedField = {
  id: string;
  label: string;
  value: string;
  confidence: number;
};

export type KycTimelineEventStatus = "completed" | "in-progress";

export type KycTimelineEvent = {
  id: string;
  title: string;
  timestamp: string;
  status: KycTimelineEventStatus;
};

export type KycRiskAnalysisItemStatus = "pass" | "fail";

export type KycRiskAnalysisItem = {
  id: string;
  label: string;
  status: KycRiskAnalysisItemStatus;
};

export type KycRiskAnalysisData = {
  clearanceStatus: string;
  scoreLevel: string;
  analysisItems: KycRiskAnalysisItem[];
  recommendation: string;
};

export type KycAmlResultStatus = "match" | "no-match";

export type KycDocumentIssueTone = "warning" | "error";

export type KycDocumentIssueId =
  | "blurred"
  | "poor-lighting"
  | "incomplete"
  | "wrong-document-type"
  | "expired"
  | "selfie-quality"
  | "text-not-readable";

export type KycDocumentIssue = {
  id: KycDocumentIssueId;
  title: string;
  description: string;
  tone: KycDocumentIssueTone;
};

export type KycAmlScreeningRow = {
  label: string;
  description?: string;
  status: KycAmlResultStatus;
  statusLabel: string;
};

export type KycAmlSanctionsEntry = {
  id: string;
  label: string;
  status: KycAmlResultStatus;
};

export type KycPepBioMatch = {
  id: string;
  label: string;
  value?: string;
  secondaryValue?: string;
  matchPercent: number;
};

export type KycPepSource = {
  id: string;
  label: string;
  status: "passed" | "failed";
};

export type KycPepFamilyMember = {
  id: string;
  relationship: string;
  name: string;
  pepMatch?: boolean;
};

export type KycPepAssociatedEntity = {
  id: string;
  name: string;
  period: string;
};

export type KycPepMatchDetail = {
  summary: string;
  screeningDate: string;
  matchType: string;
  riskLevel: string;
  subject: {
    name: string;
    title: string;
    pepPosition: string;
    jurisdiction: string;
    relationship: string;
    matchPercent: number;
  };
  bioMatches: KycPepBioMatch[];
  sources: KycPepSource[];
  timeline: {
    commenced: string;
    ended: string;
  };
  familyMembers: KycPepFamilyMember[];
  associatedEntities: KycPepAssociatedEntity[];
  riskFactors: string[];
  recommendation: string;
};

export type KycAmlScreeningData = {
  clearanceStatus: string;
  screeningStatus: string;
  screeningStatusNote: string;
  riskLevel: number;
  riskScore: number;
  riskScoreMax: number;
  pepCheck: KycAmlScreeningRow;
  pepMatchDetail?: KycPepMatchDetail;
  sanctionsLists: KycAmlSanctionsEntry[];
  warningEnforcement: KycAmlScreeningRow;
  watchlist: KycAmlScreeningRow;
};

export type KycIpDeviceCheckStatus = "pass" | "fail";

export type KycIpDeviceSecurityCheck = {
  label: string;
  statusLabel: string;
  detected: boolean;
};

export type KycIpDeviceData = {
  clearanceStatus: string;
  ipAddress: string;
  ipAddressNote: string;
  location: string;
  countryLabel: string;
  vpnDetection: KycIpDeviceSecurityCheck;
  proxyDetection: KycIpDeviceSecurityCheck;
  device: {
    label: string;
    version: string;
    status: KycIpDeviceCheckStatus;
  };
  usageStats: {
    count: string;
    deviceType: string;
    status: KycIpDeviceCheckStatus;
  };
};

export type KycLivenessCheckStatus = "passed" | "failed" | "review";

export type KycLivenessCheckItem = {
  id: string;
  label: string;
  status: KycLivenessCheckStatus;
};

export type KycLivenessData = {
  overallStatusLabel: string;
  livenessStatus: string;
  livenessStatusNote: string;
  confidenceScore: string;
  confidenceNote: string;
  completionTime: string;
  attemptsLabel: string;
  checks: KycLivenessCheckItem[];
};

export type KycDetail = {
  id: string;
  kycId: string;
  customerName: string;
  documentType: string;
  country: string;
  status: KycVerificationStatus;
  priority: KycPriority;
  riskScore: number;
  riskLevel: string;
  riskSummary: string;
  matchScore: number;
  livenessStatus: string;
  extractionStatus: string;
  extractedFields: KycExtractedField[];
  timeline: KycTimelineEvent[];
  riskAnalysis: KycRiskAnalysisData;
  amlScreening: KycAmlScreeningData;
  ipDevice: KycIpDeviceData;
  liveness: KycLivenessData;
};

export type KycLookupType =
  | "bvn-basic"
  | "nin-basic"
  | "drivers-license-basic"
  | "voters-card-basic"
  | "passport-basic";

export type KycLookupEnvironment = "sandbox" | "production";

export type KycLookupVerificationMode = "single" | "bulk";

export type KycLookupTab =
  | "bvn"
  | "risk-analysis"
  | "validation"
  | "aml-screening"
  | "address"
  | "ip-device";

export type KycBvnLookupResult = {
  lookupType: KycLookupType;
  country: string;
  countryCode: string;
  countryFlag: string;
  identifier: string;
  bvn: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  phoneNumber: string;
  dateOfBirth: string;
  riskScore: number;
  priority: string;
  initializedAt: string;
  updatedAt: string;
  address: {
    residentialAddress: string;
    city: string;
    state: string;
    lga: string;
  };
  notes: string;
  status: "successful" | "failed";
};
