export type TmQuickActionId =
  | "tm-not-blocked"
  | "cumulative-frequency"
  | "stop-payment"
  | "tm-blocked";

export type TmQuickAction = {
  id: TmQuickActionId;
  title: string;
  description: string;
  href: string;
};

export type TmMetric = {
  id: string;
  label: string;
  value: string;
};

export type TmCategoryItem = {
  id: TmQuickActionId;
  label: string;
  count: number;
  /** 0–100 share of category max for the progress bar */
  progress: number;
};

export type TmActivityPoint = {
  hour: string;
  count: number;
};

export type TmVolumePoint = {
  label: string;
  volume: number;
};

export type TmRiskDistribution = {
  low: number;
  medium: number;
  high: number;
};

export type TmVolumeRange = "7d" | "30d" | "90d";

export type TmOverviewData = {
  metrics: TmMetric[];
  quickActions: TmQuickAction[];
  categories: TmCategoryItem[];
  activity24h: TmActivityPoint[];
  volumeSeries: TmVolumePoint[];
  volumeRange: TmVolumeRange;
  riskDistribution: TmRiskDistribution;
};

/** List / detail — Real-time Monitoring explorer (TM Category-7 + Real-time frames). */

export type TmTxCategory =
  | "tm-not-blocked"
  | "stop-payment"
  | "cumulative-frequency"
  | "tm-blocked";

export type TmTxStatus = "pending" | "cleared" | "in-review" | "blocked";

export type TmTxDirection = "incoming" | "outgoing";

export type TmEntityType = "individual" | "organization";

export type TmMetricTone = "neutral" | "success" | "warning" | "info" | "error";

export type TmListMetric = {
  id: string;
  label: string;
  value: string;
  tone: TmMetricTone;
};

export type TmTransactionRecord = {
  id: string;
  transactionId: string;
  relativeTime: string;
  absoluteTime: string;
  customerName: string;
  amountLabel: string;
  category: TmTxCategory;
  riskScore: number;
  rulesTriggered: number;
  status: TmTxStatus;
  entityType: TmEntityType;
  severityLabel: string;
};

export type TmDateFilter =
  | "all"
  | "today"
  | "yesterday"
  | "last-7-days"
  | "this-month"
  | "last-month";

export type TmStatusFilter = "all" | TmTxStatus;

export type TmCategoryFilter = "all" | TmTxCategory;

export type TmEntityFilter = "all" | TmEntityType;

export type TmMoreFilter = "all" | "high-risk" | "rules-triggered";

export type TmListFilters = {
  date: TmDateFilter;
  status: TmStatusFilter;
  category: TmCategoryFilter;
  more: TmMoreFilter;
};

export type TmQueueFilters = {
  date: TmDateFilter;
  status: TmStatusFilter;
  entity: TmEntityFilter;
  more: TmMoreFilter;
};

export type TmQueueId =
  | "tm-not-blocked"
  | "stop-payment"
  | "cumulative-frequency"
  | "tm-blocked";

export type TmQueueColumn =
  | "timestamp"
  | "customer"
  | "entity"
  | "amount"
  | "riskScore"
  | "rules"
  | "status"
  | "severity";

export type TmQueueListData = {
  queueId: TmQueueId;
  title: string;
  subtitle: string;
  metrics: TmListMetric[];
  records: TmTransactionRecord[];
  columns: TmQueueColumn[];
  showStatusFilter: boolean;
};

export type TmFilterOption<T extends string = string> = {
  value: T;
  label: string;
};

export type TmTransactionsListData = {
  metrics: TmListMetric[];
  records: TmTransactionRecord[];
};

export type TmRuleResult = {
  id: string;
  label: string;
  outcome: "cleared" | "flagged";
};

export type TmTimelineStep = {
  id: string;
  label: string;
  detail?: string;
  timestamp?: string;
  tone: "success" | "warning" | "error" | "info" | "pending";
};

export type TmRelatedTransaction = {
  id: string;
  transactionId: string;
  amountLabel: string;
  relativeTime: string;
};

export type TmPartyDetails = {
  name: string;
  maskedId: string;
  country: string;
  bank?: string;
  bic?: string;
  sourceCountry?: string;
  destinationCountry?: string;
  recipient?: string;
  categoryLabel?: string;
  riskLabel?: string;
  dateOfBirth?: string;
  nationalCode?: string;
  activities?: string;
  activityDescription?: string;
  registrationDate?: string;
};

export type TmTransactionDetail = {
  id: string;
  customerId?: string;
  transactionId: string;
  direction: TmTxDirection;
  category: TmTxCategory;
  categoryLabel: string;
  severityLabel: string;
  riskScore: number;
  riskHeadline: string;
  riskFindings: string[];
  amountLabel: string;
  typeLabel: string;
  analystStatus: string;
  dateTime: string;
  customerName: string;
  paymentPurpose: string;
  sourceCountry: string;
  counterparty: TmPartyDetails;
  customer: TmPartyDetails;
  rules: TmRuleResult[];
  relatedTransactions: TmRelatedTransaction[];
  relatedTotalCount: number;
  timeline: TmTimelineStep[];
  quickStats: { label: string; value: string }[];
  metadata: { label: string; value: string }[];
};
