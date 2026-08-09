import { BankAnalysisLookupEntryPanel } from "@/components/bank-analysis/lookup/BankAnalysisLookupEntryPanel";
import type { BankAnalysisLookupMode } from "@/types/bank-analysis";

type BankAnalysisLookupPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function BankAnalysisLookupPage({
  searchParams,
}: BankAnalysisLookupPageProps) {
  const { mode } = await searchParams;
  const initialMode: BankAnalysisLookupMode = mode === "batch" ? "batch" : "single";

  return <BankAnalysisLookupEntryPanel initialMode={initialMode} />;
}
