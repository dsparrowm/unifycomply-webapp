import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";

type BankAnalysisBatchResultHeaderProps = {
  lookupSlug: string;
};

export function BankAnalysisBatchResultHeader({
  lookupSlug,
}: BankAnalysisBatchResultHeaderProps) {
  return (
    <KybLookupBackHeader
      backHref="/bank-analysis"
      breadcrumb={`Bank Analysis / Batch Lookup / ${lookupSlug}`}
      breadcrumbClassName="text-sm text-[color:var(--text-muted)]"
    />
  );
}