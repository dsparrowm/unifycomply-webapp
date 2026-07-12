import { KycMetricCards } from "@/components/kyc/KycMetricCards";
import type { BankAnalysisMetric } from "@/types/bank-analysis";

type BankAnalysisMetricCardsProps = {
  metrics: BankAnalysisMetric[];
};

export function BankAnalysisMetricCards({ metrics }: BankAnalysisMetricCardsProps) {
  return <KycMetricCards metrics={metrics} />;
}
