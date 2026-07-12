import { kycListDataPopulated } from "@/lib/data/kyc";
import type {
  KycAmlScreeningData,
  KycDetail,
  KycExtractedField,
  KycIpDeviceData,
  KycLivenessData,
  KycRecord,
  KycRiskAnalysisData,
} from "@/types/kyc";

const favourExtractedFields: KycExtractedField[] = [
  {
    id: "full-name",
    label: "Full Name",
    value: "Favour Peter Soma",
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

const favourPepMatchDetail = {
  summary: "1 director(s) matched against Politically Exposed Persons database",
  screeningDate: "10/1/2026 | 10:30AM",
  matchType: "Partial Name (83% similarity)",
  riskLevel: "Medium",
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
    { id: "world-bank", label: "World Bank Politically Exposed Persons Database", status: "passed" as const },
    {
      id: "nigeria-gov",
      label: "Nigerian Federal Government Official Records",
      status: "passed" as const,
    },
    { id: "dow-jones", label: "Dow Jones Watchlist", status: "passed" as const },
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
    {
      id: "commerce",
      name: "Ministry of Commerce and Industry",
      period: "2015 - 2019",
    },
    {
      id: "nnpc",
      name: "Nigerian National Petroleum Board",
      period: "2016 - 2018",
    },
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

const favourAmlScreening: KycAmlScreeningData = {
  clearanceStatus: "Flagged",
  screeningStatus: "Medium",
  screeningStatusNote: "PEP Detected",
  riskLevel: 2,
  riskScore: 3,
  riskScoreMax: 4,
  pepCheck: {
    label: "PEP Match",
    description: "Political Exposed Person",
    status: "match",
    statusLabel: "Match",
  },
  pepMatchDetail: favourPepMatchDetail,
  sanctionsLists: [
    { id: "ofac", label: "OFAC", status: "no-match" },
    { id: "un", label: "UN", status: "no-match" },
    { id: "eu", label: "EU", status: "no-match" },
    { id: "uk-hmt", label: "UK HMT", status: "no-match" },
  ],
  warningEnforcement: {
    label: "Adverse Media",
    description: "No negative news or adverse media mentions detected",
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

const clearAmlScreening: KycAmlScreeningData = {
  clearanceStatus: "Cleared",
  screeningStatus: "Low",
  screeningStatusNote: "No PEP Detected",
  riskLevel: 0,
  riskScore: 0,
  riskScoreMax: 4,
  pepCheck: {
    label: "PEP Match",
    description: "Political Exposed Person",
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
    label: "Adverse Media",
    description: "No negative news or adverse media mentions detected",
    status: "no-match",
    statusLabel: "No Match",
  },
  watchlist: {
    label: "Watchlist Matches",
    description: "Individual not found on any monitored watchlists.",
    status: "no-match",
    statusLabel: "No Match",
  },
};

const favourLiveness: KycLivenessData = {
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

const clearLiveness: KycLivenessData = {
  overallStatusLabel: "Passed",
  livenessStatus: "Passed",
  livenessStatusNote: "Real person detected",
  confidenceScore: "94.0%",
  confidenceNote: "High Confidence",
  completionTime: "10 Seconds",
  attemptsLabel: "1 attempts",
  checks: [
    { id: "face", label: "Face Detection", status: "passed" },
    { id: "real-person", label: "Real Person (Live Person Verified)", status: "passed" },
    { id: "mask", label: "No Mask Detected", status: "passed" },
    { id: "eyes", label: "Eyes Open", status: "passed" },
    { id: "facing", label: "Facing Camera", status: "passed" },
  ],
};

const favourIpDevice: KycIpDeviceData = {
  clearanceStatus: "Cleared",
  ipAddress: "197.210.76.45",
  ipAddressNote: "No matches found",
  location: "Lagos",
  countryLabel: "Country: Nigeria",
  vpnDetection: {
    label: "VPN Detection",
    statusLabel: "Match",
    detected: false,
  },
  proxyDetection: {
    label: "Proxy Detection",
    statusLabel: "Match",
    detected: false,
  },
  device: {
    label: "Mobile",
    version: "ios 17.2",
    status: "pass",
  },
  usageStats: {
    count: "12 times",
    deviceType: "Mobile",
    status: "pass",
  },
};

const standardIpDevice: KycIpDeviceData = {
  clearanceStatus: "Cleared",
  ipAddress: "102.89.42.18",
  ipAddressNote: "No matches found",
  location: "Lagos",
  countryLabel: "Country: Nigeria",
  vpnDetection: {
    label: "VPN Detection",
    statusLabel: "Match",
    detected: false,
  },
  proxyDetection: {
    label: "Proxy Detection",
    statusLabel: "Match",
    detected: false,
  },
  device: {
    label: "Mobile",
    version: "Android 14",
    status: "pass",
  },
  usageStats: {
    count: "8 times",
    deviceType: "Mobile",
    status: "pass",
  },
};

const favourRiskAnalysis: KycRiskAnalysisData = {
  clearanceStatus: "Cleared",
  scoreLevel: "Low",
  analysisItems: [
    { id: "risk-factor", label: "Risk Factor", status: "pass" },
    { id: "pep-detection", label: "PEP Detection", status: "pass" },
    { id: "all-checks", label: "All Check Passed", status: "fail" },
  ],
  recommendation:
    "Business has passed most verification checks, but a possible PEP connection was detected. This adds +1 to the risk score. While not a critical issue, it requires enhanced due diligence and ongoing monitoring to ensure compliance with AML regulations.",
};

const standardRiskAnalysis: KycRiskAnalysisData = {
  clearanceStatus: "Cleared",
  scoreLevel: "Low",
  analysisItems: [
    { id: "risk-factor", label: "Risk Factor", status: "pass" },
    { id: "pep-detection", label: "PEP Detection", status: "pass" },
    { id: "all-checks", label: "All Check Passed", status: "pass" },
  ],
  recommendation:
    "No risk factors. All checks passed. You can proceed to approve this user verification.",
};

const favourDetail: KycDetail = {
  id: "kyc-record-2",
  kycId: "KYC-2024-0155",
  customerName: "Favour Peter Soma",
  documentType: "National ID + Selfie",
  country: "Nigeria",
  status: "in-review",
  priority: "medium",
  riskScore: 1,
  riskLevel: "Low",
  riskSummary:
    "Business has passed most verification checks, but a possible PEP connection was detected. This adds +1 to the risk score.",
  matchScore: 94,
  livenessStatus: "Passed",
  extractionStatus: "88% Overall",
  extractedFields: favourExtractedFields,
  timeline: [
    { id: "tl-1", title: "Document Uploaded", timestamp: "2 hours ago", status: "completed" },
    { id: "tl-2", title: "OCR processing completed", timestamp: "2 hours ago", status: "completed" },
    { id: "tl-3", title: "Biometric check completed", timestamp: "2 hours ago", status: "completed" },
    { id: "tl-4", title: "Manual review started", timestamp: "12 mins ago", status: "in-progress" },
  ],
  riskAnalysis: favourRiskAnalysis,
  amlScreening: favourAmlScreening,
  ipDevice: favourIpDevice,
  liveness: favourLiveness,
};

function buildRiskAnalysis(record: KycRecord): KycRiskAnalysisData {
  if (record.riskScore >= 70) {
    return {
      clearanceStatus: "Review Required",
      scoreLevel: "High",
      analysisItems: [
        { id: "risk-factor", label: "Risk Factor", status: "fail" },
        { id: "pep-detection", label: "PEP Detection", status: "fail" },
        { id: "all-checks", label: "All Check Passed", status: "fail" },
      ],
      recommendation:
        "Elevated risk factors detected. Escalate to senior compliance review before approving this verification.",
    };
  }

  if (record.riskScore >= 40) {
    return {
      clearanceStatus: "Review Required",
      scoreLevel: "Medium",
      analysisItems: [
        { id: "risk-factor", label: "Risk Factor", status: "pass" },
        { id: "pep-detection", label: "PEP Detection", status: "fail" },
        { id: "all-checks", label: "All Check Passed", status: "fail" },
      ],
      recommendation:
        "Some verification checks require manual review. Complete enhanced due diligence before approval.",
    };
  }

  if (record.riskScore > 0) {
    return favourRiskAnalysis;
  }

  return standardRiskAnalysis;
}

function buildAmlScreening(record: KycRecord): KycAmlScreeningData {
  if (record.riskScore >= 70) {
    return {
      ...favourAmlScreening,
      clearanceStatus: "Flagged",
      screeningStatus: "High",
      riskLevel: record.riskScore,
    };
  }

  if (record.riskScore > 0) {
    return {
      ...favourAmlScreening,
      riskLevel: record.riskScore,
    };
  }

  return clearAmlScreening;
}

function buildIpDevice(record: KycRecord): KycIpDeviceData {
  if (record.riskScore >= 70) {
    return {
      clearanceStatus: "Review Required",
      ipAddress: "185.220.101.42",
      ipAddressNote: "VPN provider detected",
      location: "Unknown",
      countryLabel: `Country: ${record.country}`,
      vpnDetection: {
        label: "VPN Detection",
        statusLabel: "Match",
        detected: true,
      },
      proxyDetection: {
        label: "Proxy Detection",
        statusLabel: "Match",
        detected: true,
      },
      device: {
        label: "Mobile",
        version: "Android 14",
        status: "fail",
      },
      usageStats: {
        count: "3 times",
        deviceType: "Mobile",
        status: "fail",
      },
    };
  }

  return standardIpDevice;
}

function buildLiveness(record: KycRecord): KycLivenessData {
  if (record.riskScore >= 70) {
    return {
      overallStatusLabel: "Review",
      livenessStatus: "Review",
      livenessStatusNote: "Manual review required",
      confidenceScore: `${Math.max(60, 100 - record.riskScore)}.0%`,
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
  }

  return {
    ...clearLiveness,
    confidenceScore: `${Math.max(60, 100 - record.riskScore)}.0%`,
  };
}

function buildGenericDetail(record: KycRecord): KycDetail {
  const riskLevel =
    record.riskScore >= 70 ? "High Risk" : record.riskScore >= 40 ? "Medium Risk" : "Standard";

  return {
    id: record.id,
    kycId: record.kycId,
    customerName: record.customerName,
    documentType: record.documentType,
    country: record.country,
    status: record.status,
    priority: record.priority,
    riskScore: record.riskScore,
    riskLevel,
    riskSummary:
      record.riskScore >= 70
        ? "Elevated risk factors detected. Review required before approval."
        : "No risk factors. All checks passed. You can proceed to approve this user verification.",
    matchScore: Math.max(60, 100 - record.riskScore),
    livenessStatus: record.riskScore >= 70 ? "Review" : "Passed",
    extractionStatus: record.status === "rejected" ? "Failed" : "88% Overall",
    extractedFields: [
      {
        id: "full-name",
        label: "Full Name",
        value: record.customerName,
        confidence: 90,
      },
      {
        id: "document-type",
        label: "Document Type",
        value: record.documentType,
        confidence: 90,
      },
      {
        id: "country",
        label: "Country",
        value: record.country,
        confidence: 90,
      },
    ],
    timeline: [
      { id: "tl-1", title: "Document Uploaded", timestamp: record.timeInQueue, status: "completed" },
      {
        id: "tl-2",
        title: "OCR processing completed",
        timestamp: record.timeInQueue,
        status: "completed",
      },
      {
        id: "tl-3",
        title: "Biometric check completed",
        timestamp: record.timeInQueue,
        status: "completed",
      },
    ],
    riskAnalysis: buildRiskAnalysis(record),
    amlScreening: buildAmlScreening(record),
    ipDevice: buildIpDevice(record),
    liveness: buildLiveness(record),
  };
}

const detailById = new Map<string, KycDetail>(
  kycListDataPopulated.records.map((record) => [
    record.id,
    record.id === favourDetail.id ? favourDetail : buildGenericDetail(record),
  ]),
);

export function getKycDetailById(id: string): KycDetail | undefined {
  return detailById.get(id);
}

export function getAllKycDetailIds(): string[] {
  return Array.from(detailById.keys());
}
