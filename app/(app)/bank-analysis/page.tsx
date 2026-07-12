import { BankAnalysisListPanel } from "@/components/bank-analysis/BankAnalysisListPanel";
import { bankAnalysisListDataPopulated } from "@/lib/data/bank-analysis";

export default function BankAnalysisPage() {
  return <BankAnalysisListPanel data={bankAnalysisListDataPopulated} />;
}
