import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";

type KybBatchResultHeaderProps = {
  lookupSlug: string;
};

export function KybBatchResultHeader({ lookupSlug }: KybBatchResultHeaderProps) {
  return (
    <KybLookupBackHeader
      backHref="/kyb?mode=bulk"
      breadcrumb={`KYB / Batch Lookup / ${lookupSlug}`}
      breadcrumbClassName="text-sm text-[color:var(--text-muted)]"
    />
  );
}
