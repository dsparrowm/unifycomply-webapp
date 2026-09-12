import { BankAnalysisLookupEntryPanel } from "@/components/bank-analysis/lookup/BankAnalysisLookupEntryPanel";

type BankAnalysisLookupPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function BankAnalysisLookupPage({
  searchParams,
}: BankAnalysisLookupPageProps) {
  const { mode } = await searchParams;

  return <BankAnalysisLookupEntryPanel mode={mode === "batch" ? "batch" : "single"} />;
}