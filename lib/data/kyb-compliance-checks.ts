import type { RiskScore } from "@/lib/kyc/risk-score";
import type {
  KybComplianceChecksData,
  KybSanctionsMatchDetail,
} from "@/types/kyb";

const registryChecksBaseline: KybComplianceChecksData["registryChecks"] = [
  {
    id: "cac",
    title: "CAC Registration Verification",
    description: "Registration confirmed with Corporate Affairs Commission",
    status: "passed",
  },
  {
    id: "tin",
    title: "Tax identification number",
    description: "TIN verified with Federal Inland Revenue Service",
    status: "passed",
  },
  {
    id: "directors",
    title: "Directors Identity Screening",
    description: "2 directors verified",
    status: "passed",
  },
];

const sanctionsListsBaseline: KybComplianceChecksData["sanctionsLists"] = [
  { id: "ofac", label: "OFAC", status: "no-match" },
  { id: "un", label: "UN", status: "no-match" },
  { id: "eu", label: "EU", status: "no-match" },
  { id: "uk-hmt", label: "UK HMT", status: "no-match" },
];

/** Frame 112 — OFAC partial name match expand content. */
export const techVenturesOfacMatchDetail: KybSanctionsMatchDetail = {
  summaryTitle: "Partial Name Match Found",
  summary: "1 potential match requires manual review. Flagged.",
  screeningDate: "10/1/2026",
  matchType: "73% similarity",
  riskLevel: "Medium",
  entity: {
    name: "TechVentures Limited",
    country: "United Kingdom",
    reason: "Listed in connection with cyber-enabled activities.",
  },
  listSource: {
    name: "OFAC - Specially Designated Nationals (SDN)",
    dateListed: "12/01/2025",
    program: "CYBER 2",
  },
  matchAnalysis: [
    {
      id: "name",
      label: "Business name similarity",
      value: "73%",
      result: "percent",
      percent: 73,
    },
    {
      id: "country",
      label: "Country Match",
      value: "Nigeria - United Kingdom",
      result: "no",
    },
    {
      id: "registration",
      label: "Registration Date Match",
      value: "2018 - 2012",
      result: "no",
    },
    {
      id: "industry",
      label: "Industry Match",
      value: "Yes",
      result: "yes",
    },
  ],
  analysisNotes:
    "Partial name match identified. Different registration countries and dates reduce confidence; manual review is recommended before approval.",
  primaryActionLabel: "View Full OFAC SDN",
  secondaryActionLabel: "Flag for further investigation",
  defaultExpanded: true,
};

const score0ComplianceChecks: KybComplianceChecksData = {
  clearanceStatus: "Cleared",
  registryChecks: registryChecksBaseline,
  sanctionsLists: sanctionsListsBaseline,
  pepCheck: {
    id: "pep",
    label: "PEP Screening",
    description: "Politically exposed person",
    status: "no-match",
  },
  adverseMediaCheck: {
    id: "adverse-media",
    label: "Adverse Media",
    description: "No negative news or adverse media mentions detected",
    status: "no-match",
  },
  adverseMediaSectionTitle: "Adverse Media Screening",
};

/** Frame 112 high-risk Compliance Checks — AML registry cleared, sanctions/PEP/warning flagged. */
const score4ComplianceChecks: KybComplianceChecksData = {
  clearanceStatus: "Cleared",
  registryChecks: registryChecksBaseline,
  sanctionsLists: [
    {
      id: "ofac",
      label: "OFAC",
      status: "flagged",
      matchDetail: techVenturesOfacMatchDetail,
    },
    { id: "un", label: "UN", status: "flagged" },
    { id: "eu", label: "EU", status: "flagged" },
    { id: "uk-hmt", label: "UK HMT", status: "flagged" },
  ],
  pepCheck: {
    id: "pep",
    label: "PEP Screening",
    description: "Politically exposed person",
    status: "flagged",
    detailSummary:
      "Potential PEP association identified for a director or beneficial owner. Expand for screening context and escalate if confirmation is required.",
    defaultExpanded: false,
  },
  adverseMediaCheck: {
    id: "warning",
    label: "Warning Matches",
    description:
      "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
    status: "flagged",
    detailSummary:
      "Regulatory or enforcement signals require analyst review before this business can be approved.",
    defaultExpanded: false,
  },
  adverseMediaSectionTitle: "Warning and Regulatory Enforcement",
};

const complianceChecksByScore: Record<RiskScore, KybComplianceChecksData> = {
  0: score0ComplianceChecks,
  1: {
    clearanceStatus: "Review Required",
    registryChecks: registryChecksBaseline,
    sanctionsLists: sanctionsListsBaseline,
    pepCheck: {
      id: "pep",
      label: "PEP Screening",
      description: "Politically exposed person",
      status: "match",
      detailSummary: "PEP screening returned a possible match requiring analyst confirmation.",
      defaultExpanded: false,
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "No negative news or adverse media mentions detected",
      status: "no-match",
    },
    adverseMediaSectionTitle: "Adverse Media Screening",
  },
  2: {
    clearanceStatus: "Review Required",
    registryChecks: registryChecksBaseline,
    sanctionsLists: [
      {
        id: "ofac",
        label: "OFAC",
        status: "flagged",
        matchDetail: { ...techVenturesOfacMatchDetail, defaultExpanded: false },
      },
      { id: "un", label: "UN", status: "no-match" },
      { id: "eu", label: "EU", status: "no-match" },
      { id: "uk-hmt", label: "UK HMT", status: "no-match" },
    ],
    pepCheck: {
      id: "pep",
      label: "PEP Screening",
      description: "Politically exposed person",
      status: "flagged",
      detailSummary: "PEP screening flagged for manual review.",
      defaultExpanded: false,
    },
    adverseMediaCheck: {
      id: "warning",
      label: "Warning Matches",
      description:
        "Checks for adverse media, regulatory actions, or enforcement proceedings against the individual.",
      status: "flagged",
      detailSummary: "Minor warning signals detected. Document findings before approval.",
      defaultExpanded: false,
    },
    adverseMediaSectionTitle: "Warning and Regulatory Enforcement",
  },
  3: {
    clearanceStatus: "Review Required",
    registryChecks: registryChecksBaseline.map((entry) =>
      entry.id === "directors"
        ? { ...entry, description: "2 directors screened — 1 PEP match", status: "review" }
        : entry,
    ),
    sanctionsLists: sanctionsListsBaseline.map((entry) =>
      entry.id === "eu" ? { ...entry, status: "flagged" } : entry,
    ),
    pepCheck: {
      id: "pep",
      label: "PEP Screening",
      description: "Politically exposed person",
      status: "match",
      detailSummary: "PEP match requires enhanced due diligence.",
      defaultExpanded: false,
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "Adverse media references require review",
      status: "match",
      detailSummary: "Adverse media findings require compliance review.",
      defaultExpanded: false,
    },
    adverseMediaSectionTitle: "Adverse Media Screening",
  },
  4: score4ComplianceChecks,
};

export function buildKybComplianceChecksData(score: RiskScore): KybComplianceChecksData {
  return complianceChecksByScore[score];
}
