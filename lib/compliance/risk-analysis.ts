import { getRiskScoreLabel, type RiskScore } from "@/lib/kyc/risk-score";
import type { KycRiskAnalysisData } from "@/types/kyc";

export type RiskAnalysisSubject = "customer" | "business";

const subjectLabels: Record<RiskAnalysisSubject, { singular: string; possessive: string }> = {
  customer: { singular: "Customer", possessive: "customer" },
  business: { singular: "Business", possessive: "business" },
};

export function buildRiskAnalysisData(
  score: RiskScore,
  subject: RiskAnalysisSubject = "customer",
): KycRiskAnalysisData {
  const { singular, possessive } = subjectLabels[subject];
  const scoreLevel = getRiskScoreLabel(score);

  if (score === 0) {
    return {
      clearanceStatus: "Cleared",
      scoreLevel: "Standard Score",
      analysisItems: [
        { id: "risk-factor", label: "Risk Factor", status: "no-match", statusLabel: "No Match" },
        { id: "all-checks", label: "All Check Passed", status: "pass" },
      ],
      recommendation: `${singular} has passed most verification checks. You can proceed to approve this ${possessive} verification`,
    };
  }

  if (score === 1) {
    return {
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
  }

  if (score === 2) {
    return {
      clearanceStatus: "Cleared",
      scoreLevel: "Medium",
      analysisItems: [
        { id: "risk-factor", label: "Risk Factor", status: "pass" },
        { id: "pep-detection", label: "PEP Detection", status: "pass" },
        { id: "all-checks", label: "All Check Passed", status: "fail" },
      ],
      recommendationHeading: "APPROVAL NOT RECOMMENDED - LIKELY REJECT",
      recommendationTone: "reject",
      recommendation: `${singular} presents HIGH RISK with 3 contributing factors: possible PEP association, high-risk geographic location, and multiple failed verification attempts. The pattern of repeated attempts with different documents raises significant fraud concerns. Strong recommendation to reject unless exceptional circumstances can be verified.`,
      actions: [
        { id: "view-ofac", label: "View Full OFAC SDN", variant: "outline" },
        { id: "flag-investigation", label: "Flag for further Investigation", variant: "outline-danger" },
        { id: "clear-false-positive", label: "Clear as False Positive", variant: "primary" },
      ],
    };
  }

  if (score === 3) {
    return {
      clearanceStatus: "Review Required",
      scoreLevel,
      analysisItems: [
        { id: "risk-factor", label: "Risk Factor", status: "fail" },
        { id: "pep-detection", label: "PEP Detection", status: "fail" },
        { id: "all-checks", label: "All Check Passed", status: "fail" },
      ],
      recommendation:
        "PEP match and elevated risk factors detected. Senior compliance review and enhanced due diligence required before approval.",
    };
  }

  return {
    clearanceStatus: "Review Required",
    scoreLevel,
    analysisItems: [
      { id: "risk-factor", label: "Risk Factor", status: "fail" },
      { id: "pep-detection", label: "PEP Detection", status: "fail" },
      { id: "all-checks", label: "All Check Passed", status: "fail" },
    ],
    recommendation:
      "Critical risk factors detected across multiple checks. Escalate to senior compliance review. Approval is blocked at this risk level.",
  };
}
