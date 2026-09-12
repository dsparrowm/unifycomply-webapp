import type { BankAnalysisRunStatus } from "@/types/bank-analysis";
import { BankAnalysisBatchStatusBadge } from "@/components/bank-analysis/BankAnalysisBatchBadges";

type BankAnalysisStatusBadgeProps = {
  status: BankAnalysisRunStatus;
};

export function BankAnalysisStatusBadge({ status }: BankAnalysisStatusBadgeProps) {
  return <BankAnalysisBatchStatusBadge status={status} />;
}