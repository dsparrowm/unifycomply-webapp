import type { ApiVerificationDetail } from "@/lib/api/types";
import { mapLifecycleStatus } from "@/lib/compliance/format";
import { getRiskAnalysisScoreLabel } from "@/lib/kyc/risk-score";
import type { KycDetail, KycDetailAvailability } from "@/types/kyc";
import {
  mapAmlFromVerification,
  mapRiskFromVerification,
  unwrapTasks,
} from "@/lib/api/mappers/verification";
import { clampRiskScore } from "@/lib/kyc/risk-score";

const defaultAvailability = (): KycDetailAvailability => ({
  documentPreview: false,
  ocr: false,
  biometric: false,
  ipDevice: false,
  liveness: false,
  amlScreening: false,
  riskAnalysis: false,
});

export function kycDetailAvailability(overrides?: Partial<KycDetailAvailability>): KycDetailAvailability {
  return { ...defaultAvailability(), ...overrides };
}

export function mergeKycDetailWithVerification(
  detail: KycDetail,
  verification: ApiVerificationDetail,
): KycDetail {
  const tasks = unwrapTasks(verification);
  const riskScore = clampRiskScore(
    verification.risk?.score ?? verification.workflow.riskScore ?? detail.riskScore,
  );

  return {
    ...detail,
    riskScore,
    riskSummary: getRiskAnalysisScoreLabel(riskScore),
    riskAnalysis: mapRiskFromVerification(verification.risk),
    amlScreening: mapAmlFromVerification(tasks, verification.risk),
    canApprove: verification.risk?.canApprove,
    requiresEscalation: verification.risk?.requiresEscalation,
    availability: kycDetailAvailability({
      riskAnalysis: true,
      amlScreening: true,
    }),
  };
}

export function lifecycleStatusLabel(status: string): string {
  return mapLifecycleStatus(status as Parameters<typeof mapLifecycleStatus>[0]);
}
