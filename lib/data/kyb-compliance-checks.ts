import type { RiskScore } from "@/lib/kyc/risk-score";
import type { KybComplianceChecksData } from "@/types/kyb";

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
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "No negative news or adverse media mentions detected",
      status: "no-match",
    },
  },
  2: {
    clearanceStatus: "Review Required",
    registryChecks: registryChecksBaseline,
    sanctionsLists: sanctionsListsBaseline.map((entry) =>
      entry.id === "ofac" ? { ...entry, status: "flagged" } : entry,
    ),
    pepCheck: {
      id: "pep",
      label: "PEP Screening",
      description: "Politically exposed person",
      status: "flagged",
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "Minor adverse media references detected",
      status: "flagged",
    },
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
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "Adverse media references require review",
      status: "match",
    },
  },
  4: {
    clearanceStatus: "Flagged",
    registryChecks: registryChecksBaseline.map((entry) =>
      entry.id === "directors"
        ? { ...entry, description: "2 directors screened — elevated risk", status: "failed" }
        : entry,
    ),
    sanctionsLists: sanctionsListsBaseline.map((entry) =>
      entry.id === "ofac" || entry.id === "un"
        ? { ...entry, status: "match" }
        : entry.id === "uk-hmt"
          ? { ...entry, status: "flagged" }
          : entry,
    ),
    pepCheck: {
      id: "pep",
      label: "PEP Screening",
      description: "Politically exposed person",
      status: "match",
    },
    adverseMediaCheck: {
      id: "adverse-media",
      label: "Adverse Media",
      description: "Significant adverse media findings detected",
      status: "match",
    },
  },
};

export function buildKybComplianceChecksData(score: RiskScore): KybComplianceChecksData {
  return complianceChecksByScore[score];
}
