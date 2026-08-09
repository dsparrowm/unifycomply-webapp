import type {
  KycFilterOption,
  KycListFilters,
  KycMetric,
  KycPriority,
  KycRiskAnalysisData,
  KycVerificationStatus,
} from "@/types/kyc";

export type KybMetric = KycMetric;

export type KybVerificationStatus = KycVerificationStatus;

export type KybPriority = KycPriority;

export type KybListFilters = KycListFilters;

export type KybFilterOption<T extends string = string> = KycFilterOption<T>;

/** Registry / diligence check shown in the KYB list Verification Type column. */
export type KybVerificationType = "CAC" | "Memart" | "TIN" | "Due Diligence" | "RC";

export type KybRecord = {
  id: string;
  /** Display id in the list, e.g. `#3066`. */
  kybId: string;
  businessName: string;
  businessType: string;
  verificationType: KybVerificationType;
  /** ISO country code shown in the list, e.g. `NG`. */
  countryCode: string;
  country: string;
  status: KybVerificationStatus;
  priority: KybPriority;
  /** Composite risk score on the 0–4 scale (Settings → Approvals). */
  riskScore: number;
  /** Assignee display name, or `null` for Unassigned. */
  assignedTo: string | null;
  timeInQueue: string;
  submittedAt: string;
};

export type KybListData = {
  metrics: KybMetric[];
  records: KybRecord[];
};

export type KybLookupType = "cac-basic" | "tin-basic" | "rc-basic";

export type KybLookupVerificationMode = "single" | "bulk";

export type KybLookupTab =
  | "registry"
  | "risk-analysis"
  | "validation"
  | "aml-screening"
  | "directors";

export type KybDetailTab =
  | "business-overview"
  | "risk-analysis"
  | "directors"
  | "shareholders"
  | "document"
  | "compliance-checks";

export type KybRiskFactorTone = "critical" | "high" | "medium" | "low";

export type KybRiskFactor = {
  id: string;
  /** Tier / severity label shown above the title, e.g. `TIER 1`, `SANCTIONED`. */
  category: string;
  title: string;
  description: string;
  /** Optional detail line under the body (e.g. PEP office / role). */
  metadata?: string;
  /** Action callout strip at the bottom of the card (frame 95). */
  action?: string;
  /** Sidebar card tone — frame 95 tier styling. */
  tone?: KybRiskFactorTone;
};

export type KybDirectorAmlCheckStatus = "no-match" | "match" | "flagged";

export type KybDirectorAmlCheck = {
  id: string;
  label: string;
  status: KybDirectorAmlCheckStatus;
  /** Match severity — sanctions/watchlist critical matches use error styling. */
  matchSeverity?: "warning" | "critical";
};

export type KybDirector = {
  id: string;
  fullName: string;
  role: string;
  verificationStatus: "verified" | "pending" | "failed";
  pepStatus: "non-pep" | "pep" | "possible-pep";
  shareholdingPercent: number;
  nationality: string;
  dateAppointed: string;
  idType: string;
  idNumber: string;
  phone: string;
  email: string;
  address: string;
  amlClearanceStatus: "clear" | "review" | "flagged";
  amlRiskLevel: string;
  amlChecks: KybDirectorAmlCheck[];
};

export type KybDirectorsData = {
  sectionStatus: string;
  directors: KybDirector[];
};

export type KybShareholderType = "individual" | "corporate";

export type KybShareholder = {
  id: string;
  name: string;
  type: KybShareholderType;
  shares: number;
  percentage: number;
  shareClass: string;
};

export type KybShareCapitalData = {
  sectionStatus: string;
  shareholders: KybShareholder[];
};

export type KybSubmittedDocumentStatus = "verified" | "pending" | "rejected";

export type KybSubmittedDocument = {
  id: string;
  name: string;
  uploadedAt: string;
  status: KybSubmittedDocumentStatus;
};

export type KybSubmittedDocumentsData = {
  sectionStatus: string;
  documents: KybSubmittedDocument[];
};

export type KybComplianceRegistryStatus = "passed" | "failed" | "review";

export type KybComplianceRegistryCheck = {
  id: string;
  title: string;
  description: string;
  status: KybComplianceRegistryStatus;
};

export type KybComplianceScreeningStatus = "no-match" | "match" | "flagged";

export type KybSanctionsMatchCriterionResult = "yes" | "no" | "percent";

export type KybSanctionsMatchCriterion = {
  id: string;
  label: string;
  value: string;
  result: KybSanctionsMatchCriterionResult;
  percent?: number;
};

/** Expandable OFAC (and similar) sanctions hit — Figma frame 112. */
export type KybSanctionsMatchDetail = {
  summaryTitle: string;
  summary: string;
  screeningDate: string;
  matchType: string;
  riskLevel: string;
  entity: {
    name: string;
    country: string;
    reason: string;
  };
  listSource: {
    name: string;
    dateListed: string;
    program: string;
  };
  matchAnalysis: KybSanctionsMatchCriterion[];
  analysisNotes: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  defaultExpanded?: boolean;
};

export type KybComplianceSanctionsCheck = {
  id: string;
  label: string;
  status: KybComplianceScreeningStatus;
  matchDetail?: KybSanctionsMatchDetail;
};

export type KybComplianceScreeningCheck = {
  id: string;
  label: string;
  description: string;
  status: KybComplianceScreeningStatus;
  /** When set, row shows a View Details accordion (frame 112 PEP / Warning). */
  detailSummary?: string;
  defaultExpanded?: boolean;
};

export type KybComplianceChecksData = {
  clearanceStatus: string;
  registryChecks: KybComplianceRegistryCheck[];
  sanctionsLists: KybComplianceSanctionsCheck[];
  pepCheck: KybComplianceScreeningCheck;
  adverseMediaCheck: KybComplianceScreeningCheck;
  /** Section heading override — e.g. Warning and Regulatory Enforcement when flagged. */
  adverseMediaSectionTitle?: string;
};

export type KybDetail = {
  id: string;
  kybId: string;
  businessName: string;
  businessType: string;
  verificationType: KybVerificationType;
  country: string;
  status: KybVerificationStatus;
  priority: KybPriority;
  riskScore: number;
  riskSummary: string;
  registryStatus: string;
  legalBusinessName: string;
  registrationNumber: string;
  dateRegistered: string;
  tin: string;
  industry: string;
  registeredAddress: string;
  phoneNumber: string;
  email: string;
  website: string;
  businessActivities: string[];
  submittedAt: string;
  lastUpdatedAt: string;
  employeeCount: string;
  annualRevenue: string;
  businessPermit: string;
  operatingCountries: string;
  riskFactors: KybRiskFactor[];
  riskAnalysis: KycRiskAnalysisData;
  directors: KybDirectorsData | null;
  shareholders: KybShareCapitalData;
  documents: KybSubmittedDocumentsData;
  complianceChecks: KybComplianceChecksData;
};

export type KybRegistryLookupResult = {
  lookupType: KybLookupType;
  country: string;
  countryCode: string;
  countryFlag: string;
  identifier: string;
  legalBusinessName: string;
  registrationNumber: string;
  dateRegistered: string;
  tin: string;
  businessType: string;
  industry: string;
  status: string;
  phoneNumber: string;
  email: string;
  registeredAddress: string;
  riskScore: number;
  priority: string;
  initializedAt: string;
  updatedAt: string;
  notes: string;
  verificationStatus: "successful" | "failed";
};
