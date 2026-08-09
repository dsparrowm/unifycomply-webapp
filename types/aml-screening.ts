import type { KycFilterOption, KycMetric, KycPriority } from "@/types/kyc";

export type AmlMetric = KycMetric;
export type AmlPriority = KycPriority;
export type AmlEntityType = "individual" | "business";
export type AmlScreeningType = "batch" | "automatic" | "manual";

/** List/detail status vocabulary aligned to Figma AML Screening frames. */
export type AmlScreeningStatus =
  | "flagged"
  | "clear"
  | "in-review"
  | "blocked"
  | "escalated"
  | "case-created";

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

export type AmlStatusFilter =
  | "all"
  | "flagged"
  | "clear"
  | "in-review"
  | "blocked"
  | "escalated"
  | "case-created";

export type AmlMonitoringFilter = "all" | "yes" | "no";
export type AmlAssigneeFilter = "all" | "unassigned" | "assigned";
export type AmlMoreFilter = "all" | "high-risk" | "batch-only" | "manual-only";

export type AmlListFilters = {
  date: AmlDateFilter;
  status: AmlStatusFilter;
  monitoring: AmlMonitoringFilter;
  assignee: AmlAssigneeFilter;
  more: AmlMoreFilter;
};

export type AmlFilterOption<T extends string = string> = KycFilterOption<T>;

export type AmlScreeningRecord = {
  id: string;
  /** Display AML ID e.g. #3066 */
  amlId: string;
  screeningId: string;
  entityName: string;
  entityType: AmlEntityType;
  country: string;
  dateTime: string;
  screeningType: AmlScreeningType;
  initiatedBy: string;
  assignedTo: string | null;
  status: AmlScreeningStatus;
  activeMonitoring: boolean;
  matches: number;
  riskScore: number;
  priority: AmlPriority;
  submittedAt: string;
};

export type AmlScreeningListData = {
  metrics: AmlMetric[];
  records: AmlScreeningRecord[];
};

export type AmlLookupMode = "single" | "batch";
export type AmlBatchRecordStatus = "successful" | "review" | "high-risk";

export type AmlBatchRecord = {
  id: string;
  screeningId: string;
  entityName: string;
  entityType: AmlEntityType;
  country: string;
  status: AmlBatchRecordStatus;
  matches: number;
  riskScore: number;
};

export type AmlBatchResult = {
  id: string;
  batchName: string;
  fileName: string;
  submittedAt: string;
  totalRecords: number;
  successful: number;
  review: number;
  highRisk: number;
  records: AmlBatchRecord[];
};

export type AmlMatchCategory = "sanctions" | "pep" | "adverse-media" | "watchlist";
export type AmlMatchStrength = "exact" | "strong" | "possible";

export type AmlMatch = {
  id: string;
  category: AmlMatchCategory;
  source: string;
  matchedName: string;
  strength: AmlMatchStrength;
  score: number;
  description: string;
};

export type AmlMatchingConfiguration = {
  minimumMatchScore: number;
  fuzzyMatching: boolean;
  requireDateOfBirth: boolean;
  sources: AmlMatchCategory[];
};

export type AmlDecisionType =
  | "screened"
  | "configuration-updated"
  | "cleared"
  | "escalated"
  | "case-created";

export type AmlDecisionHistoryEntry = {
  id: string;
  type: AmlDecisionType;
  title: string;
  description: string;
  actor: string;
  timestamp: string;
};

export type AmlCreateCaseInput = {
  title: string;
  priority: "medium" | "high" | "critical";
  assignee: string;
  notes: string;
};

export type AmlDetailTab =
  | "data-summary"
  | "verifications"
  | "sources"
  | "warning-regulatory"
  | "risk-analysis"
  | "decision-history";

export type AmlSummaryTab = "key-summary" | "linked-entities" | "additional-information";

export type AmlKeySummaryField = {
  id: string;
  label: string;
  value: string;
  /** Optional pill shown beside the value (e.g. PEP). */
  badge?: string;
};

/** Linked Entities tab rows — Figma Data Summary / Linked Entities. */
export type AmlLinkedEntity = {
  id: string;
  relationship: string;
  name: string;
};

/** Additional Information tab rows — Figma Data Summary / Additional information. */
export type AmlAdditionalInfoLink = {
  id: string;
  source: string;
  label: string;
  href: string;
};

export type AmlVerificationRow = {
  id: string;
  label: string;
  description: string;
  outcome: "match" | "no-match";
};

export type AmlVerificationSection = {
  id: string;
  title: string;
  subtitle?: string;
  rows: AmlVerificationRow[];
};

export type AmlSearchInformation = {
  searchItem: string;
  entityTypeLabel: string;
  matchScore: number;
  matchSuccessful: boolean;
  databases: string[];
  country: string;
  riskEngine: string;
  /** Optional initials when no photo asset is available. */
  avatarInitials: string;
};

/** Create-case Search Results — Figma frame after Search CTA. */
export type AmlSearchMatchStatus =
  | "potential-match"
  | "true-match"
  | "false-positive"
  | "no-match";

export type AmlSearchResultRecord = {
  id: string;
  name: string;
  matchScorePercent: number;
  riskScore: number;
  matchStatus: AmlSearchMatchStatus;
  database: string;
  relevance: string;
  dateOfBirth: string;
  avatarInitials: string;
  detailId: string;
};

export type AmlSearchResultsDatabase = {
  id: string;
  label: string;
  /** Red indicator when this source contributed to a hit (Figma PEP dot). */
  flagged?: boolean;
};

export type AmlSearchResultsInformation = {
  searchItem: string;
  entityTypeLabel: string;
  matchScorePercent: number;
  matchSuccessful: boolean;
  databases: AmlSearchResultsDatabase[];
  country: string;
  riskEngine: string;
  avatarInitials: string;
};

export type AmlSearchResultsData = {
  queryName: string;
  recordCount: number;
  totalPages: number;
  records: AmlSearchResultRecord[];
  information: AmlSearchResultsInformation;
};

export type AmlScreeningDetail = AmlScreeningRecord & {
  dateOfBirth?: string;
  reference: string;
  aliases: string[];
  matchSummary: string;
  matchesDetail: AmlMatch[];
  matchingConfiguration: AmlMatchingConfiguration;
  decisionHistory: AmlDecisionHistoryEntry[];
  keySummary: AmlKeySummaryField[];
  linkedEntities: AmlLinkedEntity[];
  additionalInformation: AmlAdditionalInfoLink[];
  verificationSections: AmlVerificationSection[];
  searchInformation: AmlSearchInformation;
};
