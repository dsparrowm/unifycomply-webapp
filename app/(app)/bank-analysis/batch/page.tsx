import { BankAnalysisBatchPanel } from "@/components/bank-analysis/BankAnalysisBatchPanel";
import { bankAnalysisBatchResult } from "@/lib/data/bank-analysis";

export default function BankAnalysisBatchPage() {
  return <BankAnalysisBatchPanel result={bankAnalysisBatchResult} />;
}
