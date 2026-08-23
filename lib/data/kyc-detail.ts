import { buildRiskAnalysisData } from "@/lib/compliance/risk-analysis";
import { kycListDataPopulated } from "@/lib/data/kyc";
import { getAmlRiskLevelLabel, getAmlScreeningStatusLabel, RISK_SCORE_MAX, type RiskScore } from "@/lib/kyc/risk-score";
import type {
  KycAmlScreeningData,
  KycDetail,
  KycExtractedField,
  KycIpDeviceData,
  KycLivenessData,
  KycPepMatchDetail,
  KycRecord,
  KycTimelineEvent,
} from "@/types/kyc";

const defaultExtractedFields: KycExtractedField[] = [
  {
    id: "full-name",
    label: "Full Name",
    value: "Customer Name",
    confidence: 93,
  },
  {
    id: "date-of-birth",
    label: "Date Of Birth",
    value: "14 March 1995",
    confidence: 92,
  },
  {
    id: "document-number",
    label: "Document Number",
    value: "12345678901",
    confidence: 91,
  },
  {
    id: "issued-date",
    label: "Issued Date",
    value: "12 January 2020",
    confidence: 90,
  },
  {
    id: "expiry-date",
    label: "Expiry Date",
    value: "12 January 2030",
    confidence: 90,
  },
  {
    id: "address",
    label: "Address",
    value: "12 Admiralty Way, Lekki Phase 1, Lagos",
    confidence: 90,
  },
];

const favourExtractedFields: KycExtractedField[] = [
  { ...defaultExtractedFields[0], value: "Favour Peter Soma" },
  ...defaultExtractedFields.slice(1),
];

const score2ExtractedFields: KycExtractedField[] = [
  { id: "full-name", label: "Full Name", value: "Favour Peter Soma", confidence: 90 },
  { id: "date-of-birth", label: "Date Of Birth", value: "14/02/2001", confidence: 90 },
  { id: "document-number", label: "Document Number", value: "2212A46789", confidence: 90 },
  { id: "issued-date", label: "Issued Date", value: "12/09/2020", confidence: 90 },
  { id: "expiry-date", label: "Expiry Date", value: "12/09/2020", confidence: 90 },
  { id: "address", label: "Address", value: "12 Victoria Island, Lagos", confidence: 90 },
];

const score2Timeline: KycTimelineEvent[] = [
  { id: "tl-1", title: "Document Uploaded", timestamp: "2 hours ago", status: "completed" },
  { id: "tl-2", title: "OCR processing completed", timestamp: "2 hours ago", status: "completed" },
  { id: "tl-3", title: "Biometric check completed", timestamp: "2 hours ago", status: "completed" },
  { id: "tl-4", title: "Manual review started", timestamp: "12 mins ago", status: "in-progress" },
];

const score2DocumentRiskTier = {
  tierLabel: "TIER 3",
  title: "PEP (Politically Exposed Person)",
  description:
    "This person holds or has recently held a prominent public position in a domestic political office. Enhanced due diligence is required.",
  detail: "Lagos State House of Assembly Member (2023-Present)",
  recommendation: "APPROVE - Enhanced DD + Periodic Monitoring",
};

const score2DocumentAlert = {
  title: "Multiple Failed Verification Attempts",
  description:
    "Customer has attempted verification 3 times in the past 7 days with different documents. Previous attempts were rejected due to poor document quality and selfie mismatch.",
};

const defaultTimeline: KycTimelineEvent[] = [
  { id: "tl-1", title: "Document Uploaded", timestamp: "2 hours ago", status: "completed" },
  { id: "tl-2", title: "OCR processing completed", timestamp: "2 hours ago", status: "completed" },
  { id: "tl-3", title: "Biometric check completed", timestamp: "2 hours ago", status: "completed" },
];

const pepMatchDetail: KycPepMatchDetail = {
  summary: "1 director(s) matched against Politically Exposed Persons database",
  screeningDate: "10/1/2026 | 10:30AM",
  matchType: "Partial Name (83% similarity)",
  riskLevel: "High Risk",
  subject: {
    name: "Adebayo Ibrahim Musa",
    title: "Director",
    pepPosition: "Former Minister of Commerce",
    jurisdiction: "Federal Government of Nigeria",
    relationship: "Same Person",
    matchPercent: 83,
  },
  bioMatches: [
    { id: "full-name", label: "Full name", value: "Adebayo Ibrahim Musa", matchPercent: 100 },
    { id: "dob", label: "DOB", value: "1965-08-12", matchPercent: 100 },
    { id: "nationality", label: "Nationality", value: "Nigerian", matchPercent: 100 },
    {
      id: "address",
      label: "Previous Addr",
      value: "Lagos Nigeria",
      secondaryValue: "New Addr: Abuja, Nigeria",
      matchPercent: 70,
    },
  ],
  sources: [
    { id: "world-bank", label: "World Bank Politically Exposed Persons Database", status: "passed" },
    { id: "nigeria-gov", label: "Nigerian Federal Government Official Records", status: "passed" },
    { id: "dow-jones", label: "Dow Jones Watchlist", status: "passed" },
  ],
  timeline: {
    commenced: "May 1, 2015",
    ended: "May 1, 2018",
  },
  familyMembers: [
    { id: "spouse", relationship: "Spouse", name: "Adebayo Fatima" },
    { id: "father", relationship: "Father", name: "Adebayo Bello Galedima", pepMatch: true },
  ],
  associatedEntities: [
    { id: "commerce", name: "Ministry of Commerce and Industry", period: "2015 - 2019" },
    { id: "nnpc", name: "Nigerian National Petroleum Board", period: "2016 - 2018" },
  ],
  riskFactors: [
    "Served in high-level government position",
    "Access to public funds and procurement decisions",
    "Family connection to other PEPs",
    "Currently operating in business with government contracts",
  ],
  recommendation:
    "Enhanced Due Diligence (EDD) must be performed. Source of wealth verification, ongoing transaction monitoring, and senior management approval required for account opening.",
};

const clearedIpDevice: KycIpDeviceData = {
  clearanceStatus: "Cleared",
  ipAddress: "102.89.42.18",
  ipAddressNote: "No matches found",
  location: "Lagos",
  countryLabel: "Country: Nigeria",
  vpnDetection: { label: "VPN Detection", statusLabel: "Match", detected: false },
  proxyDetection: { label: "Proxy Detection", statusLabel: "Match", detected: false },
  device: { label: "Mobile", version: "Android 14", status: "pass" },
  usageStats: { count: "8 times", deviceType: "Mobile", status: "pass" },
};

const flaggedIpDevice: KycIpDeviceData = {
  clearanceStatus: "Review Required",
  ipAddress: "185.220.101.42",
  ipAddressNote: "VPN provider detected",
  location: "Unknown",
  countryLabel: "Country: Nigeria",
  vpnDetection: { label: "VPN Detection", statusLabel: "Match", detected: true },
  proxyDetection: { label: "Proxy Detection", statusLabel: "Match", detected: true },
  device: { label: "Mobile", version: "Android 14", status: "fail" },
  usageStats: { count: "3 times", deviceType: "Mobile", status: "fail" },
};

const passedLiveness: KycLivenessData = {
  overallStatusLabel: "Passed",
  livenessStatus: "Passed",
  livenessStatusNote: "Real person detected",
  confidenceScore: "98.2%",
  confidenceNote: "High Confidence",
  completionTime: "8 Seconds",
  attemptsLabel: "1 attempts",
  checks: [
    { id: "face", label: "Face Detection", status: "passed" },
    { id: "real-person", label: "Real Person (Live Person Verified)", status: "passed" },
    { id: "mask", label: "No Mask Detected", status: "passed" },
    { id: "eyes", label: "Eyes Open", status: "passed" },
    { id: "facing", label: "Facing Camera", status: "passed" },
  ],
};

const reviewLiveness: KycLivenessData = {
  overallStatusLabel: "Review",
  livenessStatus: "Review",
  livenessStatusNote: "Manual review required",
  confidenceScore: "62.0%",
  confidenceNote: "Low Confidence",
  completionTime: "14 Seconds",
  attemptsLabel: "2 attempts",
  checks: [
    { id: "face", label: "Face Detection", status: "passed" },
    { id: "real-person", label: "Real Person (Live Person Verified)", status: "review" },
    { id: "mask", label: "No Mask Detected", status: "passed" },
    { id: "eyes", label: "Eyes Open", status: "review" },
    { id: "facing", label: "Facing Camera", status: "passed" },
  ],
};

function buildAmlScreening(score: RiskScore, options?: { pepMatch?: boolean }): KycAmlScreeningData {
  if (score === 0) {
    return {
      clearanceStatus: "Cleared",
      screeningStatus: "Clear",
      screeningStatusNote: "No matches found",
      riskLevelLabel: getAmlRiskLevelLabel(score),
      riskLevel: score,
      riskScore: score,
      riskScoreMax: RISK_SCORE_MAX,
      pepCheck: {
        label: "PEP Match",
        description: "Political Exposed Person (Not Exposed)",
        status: "no-match",
        statusLabel: "No Match",
      },
      sanctionsLists: [
        { id: "ofac", label: "OFAC", status: "no-match" },
        { id: "un", label: "UN", status: "no-match" },
        { id: "eu", label: "EU", status: "no-match" },
        { id: "uk-hmt", label: "UK HMT", status: "no-match" },
      ],
      warningEnforcement: {
        label: "Warning Matches",
        description:
          "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
        status: "no-match",
        statusLabel: "No Match",
      },
      watchlist: {
        label: "Watchlist Matches",
        description: "Individual not found on any monitored watchlists",
        status: "no-match",
        statusLabel: "No Match",
      },
    };
  }

  if (score === 1) {
    return {
      clearanceStatus: "Cleared",
      screeningStatus: "Low",
      screeningStatusNote: "PEP Detected",
      riskLevelLabel: getAmlRiskLevelLabel(score),
      riskLevel: score,
      riskScore: score,
      riskScoreMax: RISK_SCORE_MAX,
      pepCheck: {
        label: "PEP Match",
        description: "Political Exposed Person",
        status: "match",
        statusLabel: "Match",
      },
      sanctionsLists: [
        { id: "ofac", label: "OFAC", status: "no-match" },
        { id: "un", label: "UN", status: "no-match" },
        { id: "eu", label: "EU", status: "no-match" },
        { id: "uk-hmt", label: "UK HMT", status: "no-match" },
      ],
      warningEnforcement: {
        label: "Warning Matches",
        description:
          "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
        status: "no-match",
        statusLabel: "No Match",
      },
      watchlist: {
        label: "Watchlist Matches",
        description: "Individual not found on any monitored watchlists",
        status: "no-match",
        statusLabel: "No Match",
      },
    };
  }

  if (score === 2) {
    return {
      clearanceStatus: "Cleared",
      screeningStatus: "Medium",
      screeningStatusNote: "PEP Detected",
      riskLevelLabel: getAmlRiskLevelLabel(score),
      riskLevel: score,
      riskScore: score,
      riskScoreMax: RISK_SCORE_MAX,
      pepCheck: {
        label: "PEP Screening",
        description: "Politically exposed person",
        status: "flagged",
        statusLabel: "Flagged",
      },
      pepMatchDetail: {
        ...pepMatchDetail,
        riskLevel: "Medium Risk",
      },
      sanctionsLists: [
        { id: "ofac", label: "OFAC", status: "no-match" },
        { id: "un", label: "UN", status: "no-match" },
        { id: "eu", label: "EU", status: "no-match" },
        { id: "uk-hmt", label: "UK HMT", status: "no-match" },
      ],
      warningEnforcement: {
        label: "Warning Matches",
        description:
          "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
        status: "no-match",
        statusLabel: "No Match",
      },
      watchlist: {
        label: "Watchlist Matches",
        description: "Individual not found on any monitored watchlists",
        status: "no-match",
        statusLabel: "No Match",
      },
    };
  }

  const hasPepMatch = options?.pepMatch ?? score >= 3;

  return {
    clearanceStatus: "Flagged",
    screeningStatus: getAmlScreeningStatusLabel(score),
    screeningStatusNote: hasPepMatch ? "PEP Detected" : "Elevated risk signals",
    riskLevelLabel: getAmlRiskLevelLabel(score),
    riskLevel: score,
    riskScore: score,
    riskScoreMax: RISK_SCORE_MAX,
    pepCheck: {
      label: "PEP Match",
      description: "Political Exposed Person",
      status: hasPepMatch ? "match" : "no-match",
      statusLabel: hasPepMatch ? "Match" : "No Match",
    },
    pepMatchDetail: hasPepMatch ? pepMatchDetail : undefined,
    sanctionsLists: [
      { id: "ofac", label: "OFAC", status: score >= 4 ? "match" : "no-match" },
      { id: "un", label: "UN", status: "no-match" },
      { id: "eu", label: "EU", status: "no-match" },
      { id: "uk-hmt", label: "UK HMT", status: "no-match" },
    ],
    warningEnforcement: {
      label: "Warning Matches",
      description:
        score >= 4
          ? "Negative news mentions detected in monitored sources"
          : "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
      status: score >= 4 ? "match" : "no-match",
      statusLabel: score >= 4 ? "Match" : "No Match",
    },
    watchlist: {
      label: "Watchlist Matches",
      description:
        score >= 4
          ? "Individual found on monitored watchlists"
          : "Individual not found on any monitored watchlists",
      status: score >= 4 ? "match" : "no-match",
      statusLabel: score >= 4 ? "Match" : "No Match",
    },
  };
}

type KycDetailTemplate = Omit<
  KycDetail,
  "id" | "kycId" | "customerName" | "documentType" | "country" | "status" | "priority"
>;

function buildDetailTemplate(score: RiskScore): KycDetailTemplate {
  const riskSummaryByScore: Record<RiskScore, string> = {
    0: "Customer has passed most verification checks. You can proceed to approve this user verification",
    1: "Business has passed most verification checks, but a possible PEP connection was detected. This adds +1 to the risk score.",
    2: "Customer presents elevated risk with multiple contributing factors. Manual review and enhanced due diligence are required before approval.",
    3: "High risk factors detected including PEP match. Senior compliance review required before approval.",
    4: "Critical risk factors detected across multiple checks. Escalate immediately. Approval is blocked.",
  };

  const matchScoreByScore: Record<RiskScore, number> = {
    0: 98,
    1: 94,
    2: 94,
    3: 74,
    4: 61,
  };

  const livenessStatusByScore: Record<RiskScore, string> = {
    0: "Passed",
    1: "Passed",
    2: "Passed",
    3: "Passed",
    4: "Review",
  };

  return {
    riskScore: score,
    riskSummary: riskSummaryByScore[score],
    matchScore: matchScoreByScore[score],
    livenessStatus: livenessStatusByScore[score],
    extractionStatus: "88% Overall",
    extractedFields:
      score === 2 ? score2ExtractedFields : score === 1 ? favourExtractedFields : defaultExtractedFields,
    timeline:
      score === 2
        ? score2Timeline
        : score === 1
          ? [
              ...defaultTimeline,
              {
                id: "tl-4",
                title: "Manual review started",
                timestamp: "12 mins ago",
                status: "in-progress",
              },
            ]
          : defaultTimeline,
    riskAnalysis: buildRiskAnalysisData(score, "customer"),
    amlScreening: buildAmlScreening(score, { pepMatch: score >= 3 }),
    ipDevice: score >= 4 ? flaggedIpDevice : clearedIpDevice,
    liveness: score >= 4 ? reviewLiveness : passedLiveness,
    documentRiskTier: score === 2 ? score2DocumentRiskTier : undefined,
    documentAlert: score === 2 ? score2DocumentAlert : undefined,
  };
}

const kycDetailByScore: Record<RiskScore, KycDetailTemplate> = {
  0: buildDetailTemplate(0),
  1: buildDetailTemplate(1),
  2: buildDetailTemplate(2),
  3: buildDetailTemplate(3),
  4: buildDetailTemplate(4),
};

function buildExtractedFields(record: KycRecord, templateFields: KycExtractedField[]): KycExtractedField[] {
  return templateFields.map((field) =>
    field.id === "full-name" ? { ...field, value: record.customerName } : field,
  );
}

function buildTimeline(record: KycRecord, templateTimeline: KycTimelineEvent[]): KycTimelineEvent[] {
  if (templateTimeline.length > 3) {
    return templateTimeline;
  }

  return templateTimeline.map((event) => ({
    ...event,
    timestamp: record.timeInQueue,
  }));
}

function buildDetailFromRecord(record: KycRecord): KycDetail {
  const score = Math.min(RISK_SCORE_MAX, Math.max(0, record.riskScore)) as RiskScore;
  const template = kycDetailByScore[score];

  return {
    id: record.id,
    kycId: record.kycId,
    customerName: record.customerName,
    documentType: record.documentType,
    country: record.country,
    status: record.status,
    priority: record.priority,
    riskScore: score,
    riskSummary: template.riskSummary,
    matchScore: template.matchScore,
    livenessStatus: template.livenessStatus,
    extractionStatus: record.status === "rejected" ? "Failed" : template.extractionStatus,
    extractedFields: buildExtractedFields(record, template.extractedFields),
    timeline: buildTimeline(record, template.timeline),
    riskAnalysis: template.riskAnalysis,
    amlScreening: {
      ...template.amlScreening,
      riskLevel: score,
      riskScore: score,
      riskLevelLabel: getAmlRiskLevelLabel(score),
    },
    ipDevice: {
      ...template.ipDevice,
      countryLabel: `Country: ${record.country}`,
    },
    liveness: template.liveness,
    documentRiskTier: template.documentRiskTier,
    documentAlert: template.documentAlert,
  };
}

const detailById = new Map<string, KycDetail>(
  kycListDataPopulated.records.map((record) => [record.id, buildDetailFromRecord(record)]),
);

export function getKycDetailById(id: string): KycDetail | undefined {
  return detailById.get(id);
}

export function getAllKycDetailIds(): string[] {
  return Array.from(detailById.keys());
}
