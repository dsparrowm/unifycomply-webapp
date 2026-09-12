import { BankAnalysisListPanel } from "@/components/bank-analysis/BankAnalysisListPanel";
import {
  bankAnalysisListDataEmpty,
  bankAnalysisListDataPopulated,
} from "@/lib/data/bank-analysis";

type BankAnalysisPageProps = {
  searchParams: Promise<{ empty?: string }>;
};

export default async function BankAnalysisPage({ searchParams }: BankAnalysisPageProps) {
  const { empty } = await searchParams;

  return (
    <BankAnalysisListPanel
      data={empty === "1" ? bankAnalysisListDataEmpty : bankAnalysisListDataPopulated}
    />
  );
}