import { settingsApprovalsData } from "@/lib/data/settings";
import type { SettingsApprovalThresholds } from "@/types/settings";

export const RISK_SCORE_MAX = 4;

export type RiskScore = 0 | 1 | 2 | 3 | 4;

const RISK_SCORE_LABELS: Record<RiskScore, string> = {
  0: "No Risk",
  1: "Low Risk",
  2: "Moderate Risk",
  3: "High Risk",
  4: "Very High",
};

export function clampRiskScore(score: number): RiskScore {
  if (score <= 0) {
    return 0;
  }

  if (score >= 4) {
    return 4;
  }

  return score as RiskScore;
}

export function getRiskScoreLabel(score: number): string {
  return RISK_SCORE_LABELS[clampRiskScore(score)];
}

export function getRiskScoreShortLabel(score: number): string {
  const label = getRiskScoreLabel(score);

  if (score === 0 || score === 1) {
    return "Standard";
  }

  return label;
}

/** Label for the AML Risk Level summary card. */
export function getAmlRiskLevelLabel(score: number): string {
  const labels: Record<RiskScore, string> = {
    0: "No Risk",
    1: "Low",
    2: "Moderate",
    3: "High",
    4: "Very High",
  };

  return labels[clampRiskScore(score)];
}

/** Label for the AML Screening Status summary card. */
export function getAmlScreeningStatusLabel(score: number): string {
  const scoreValue = clampRiskScore(score);

  if (scoreValue === 0) {
    return "Clear";
  }

  if (scoreValue === 1) {
    return "Low";
  }

  if (scoreValue === 2) {
    return "Medium";
  }

  return "Flagged";
}

/** Subtitle shown under the large score in the Risk Score Analysis tab. */
export function getRiskAnalysisScoreLabel(score: number): string {
  const labels: Record<RiskScore, string> = {
    0: "Standard Score",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High",
  };

  return labels[clampRiskScore(score)];
}

export function isApprovalBlocked(
  score: number,
  thresholds: SettingsApprovalThresholds = settingsApprovalsData.thresholds,
): boolean {
  return clampRiskScore(score) >= thresholds.approvalBlockThreshold;
}

export function isWarningScore(
  score: number,
  thresholds: SettingsApprovalThresholds = settingsApprovalsData.thresholds,
): boolean {
  return clampRiskScore(score) >= thresholds.warningThreshold;
}

export const defaultApprovalThresholds = settingsApprovalsData.thresholds;
