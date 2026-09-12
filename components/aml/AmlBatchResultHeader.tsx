import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";

type AmlBatchResultHeaderProps = {
  lookupSlug: string;
};

export function AmlBatchResultHeader({ lookupSlug }: AmlBatchResultHeaderProps) {
  return (
    <KybLookupBackHeader
      backHref="/aml-screening"
      breadcrumb={`AML Screening / Batch Lookup / ${lookupSlug}`}
      breadcrumbClassName="text-sm text-[color:var(--text-muted)]"
    />
  );
}
