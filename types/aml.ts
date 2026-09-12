export type AmlMetric = {
  id: string;
  label: string;
  value: number;
};

export type AmlScreeningType = "batch" | "automatic" | "manual";

export type AmlScreeningStatus = "clear" | "flagged" | "in-review" | "blocked";

export type AmlDateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last-7-days"
  | "this-month"
  | "last-month"
  | "last-3-months"
  | "last-6-months"
  | "specific-range";

export type AmlStatusFilter = "all" | "clear" | "flagged" | "in-review" | "blocked";

export type AmlMonitoringFilter = "all" | "yes" | "no";

export type AmlAssigneeFilter = "all" | "Alimi Ayomikun" | "Tejumade Olomola" | "Favour Soma";

export type AmlMoreFilter = "all" | "high-risk";

export type AmlListFilters = {
  date: AmlDateFilter;
  status: AmlStatusFilter;
  monitoring: AmlMonitoringFilter;
  assignee: AmlAssigneeFilter;
  more: AmlMoreFilter;
};

export type AmlFilterOption<T extends string = string> = {
  value: T;
  label: string;
};

export type AmlRecord = {
  id: string;
  amlId: string;
  customerName: string;
  /** Batch file rows show entity count under the name. */
  customerSubtitle: string | null;
  date: string;
  type: AmlScreeningType;
  initiatedBy: string;
  riskScore: number;
  assignedTo: string | null;
  status: AmlScreeningStatus;
  monitoringActive: boolean;
  submittedAt: string;
};

export type AmlListData = {
  metrics: AmlMetric[];
  records: AmlRecord[];
};

export type AmlLookupMode = "single" | "batch";

export type AmlCaseEntityType = "all" | "person" | "organization" | "aircraft" | "vessel";

export type AmlMatchMode = "score" | "exact";

export type AmlRelevanceKey = "dob" | "alias" | "name" | "rca";

export type AmlSearchEntityType = "aircraft" | "organization" | "person" | "vessel";

export type AmlDatabaseKey =
  | "adverse-media"
  | "business"
  | "businessperson"
  | "fitness-probity"
  | "insolvency"
  | "pep-1"
  | "pep-2"
  | "pep-3"
  | "pep-4";

export type AmlMatchStatus =
  | "no-match"
  | "potential-match"
  | "match"
  | "false-positive"
  | "true-positive";

export type AmlMatchRelevance = AmlRelevanceKey | "country";

export type AmlSearchMatch = {
  id: string;
  name: string;
  matchScore: number;
  riskScore: number;
  relevance: AmlMatchRelevance;
  matchStatus: AmlMatchStatus;
  dateOfBirth: string;
  databases: string[];
  photoSrc: string | null;
};

export type AmlSearchInformation = {
  searchItem: string;
  entityType: string;
  scoreLabel: "Fuzzy Score" | "Match Score";
  score: number;
  databases: string[];
  country: string;
  riskEngine: string;
  photoSrc: string | null;
  matchSuccessful: boolean;
};

export type AmlSearchResultData = {
  caseName: string;
  matches: AmlSearchMatch[];
  searchInformation: AmlSearchInformation;
};

export type AmlBatchEntityType = "corporate" | "individual";

export type AmlBatchCountryCode = "NG" | "GH";

export type AmlBatchEntity = {
  id: string;
  amlId: string;
  customerName: string;
  entityType: AmlBatchEntityType;
  country: AmlBatchCountryCode;
  matches: number;
  riskScore: number;
  assignedTo: string | null;
  status: AmlScreeningStatus;
  monitoringActive: boolean;
};

export type AmlBatchResult = {
  id: string;
  lookupSlug: string;
  metrics: AmlMetric[];
  records: AmlBatchEntity[];
};

export type AmlCaseKind = "person" | "corporate";

export type AmlCaseDetailTab =
  | "data-summary"
  | "verifications"
  | "sources"
  | "warning"
  | "risk-analysis"
  | "decision-history";

export type AmlCaseSummaryTab = "key-summary" | "linked-entities" | "additional-information";

export type AmlCaseField = {
  label: string;
  value: string;
  values?: string[];
  tone?: "warning";
};

export type AmlCaseLinkedRow = {
  label: string;
  value: string;
  detail?: string;
};

export type AmlCaseCorporateLink = {
  description: string;
  entityName: string;
  details: string;
};

export type AmlCaseSource = {
  title: string;
  listedOn?: string;
  description?: string;
  href: string;
};

export type AmlCaseVerificationItem = {
  title: string;
  description: string;
};

export type AmlCaseVerificationGroup = {
  title: string;
  items: AmlCaseVerificationItem[];
};

export type AmlCaseRiskDetail = {
  label: string;
  value: string;
  tone: "warning" | "success";
};

export type AmlEscalateSummary = {
  riskScore: number;
  sanction: boolean;
  warningEnforcement: boolean;
};

export type AmlCaseDetail = {
  id: string;
  caseName: string;
  kind: AmlCaseKind;
  riskScore: number;
  activeMonitoring: boolean;
  sourceBanner: AmlCaseSource;
  keyFields: AmlCaseField[];
  linkedEntities: AmlCaseLinkedRow[];
  corporateLinks: AmlCaseCorporateLink[];
  additionalLinks: { label: string; value: string; href: string }[];
  sources: AmlCaseSource[];
  verifications: AmlCaseVerificationGroup[];
  warningItems: AmlCaseVerificationItem[];
  riskScoreValue: number;
  overallAnalysis: string;
  radar: { label: string; value: number }[];
  riskDetails: AmlCaseRiskDetail[];
  escalateSummary: AmlEscalateSummary;
  searchInformation: AmlSearchInformation;
};
