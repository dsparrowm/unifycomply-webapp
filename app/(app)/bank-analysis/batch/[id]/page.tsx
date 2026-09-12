import { BankAnalysisBatchResultPanel } from "@/components/bank-analysis/batch/BankAnalysisBatchResultPanel";
import { getBankAnalysisBatchResult } from "@/lib/data/bank-analysis-batch-results";

type BankAnalysisBatchResultPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BankAnalysisBatchResultPage({
  params,
}: BankAnalysisBatchResultPageProps) {
  const { id } = await params;

  return <BankAnalysisBatchResultPanel result={getBankAnalysisBatchResult(id)} />;
}