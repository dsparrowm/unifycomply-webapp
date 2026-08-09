import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AmlDetailHeaderProps = {
  entityName: string;
};

export function AmlDetailHeader({ entityName }: AmlDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <Link
          href="/aml-screening"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <p className="text-sm font-medium">
          <span className="text-[color:var(--text-muted)]">AML Screening / </span>
          <span className="text-[color:var(--accent-primary-hover)]">
            {entityName.toUpperCase()}
          </span>
        </p>
      </div>

      <button
        type="button"
        disabled
        title="Report export is not connected in the mock-data build"
        className="w-fit cursor-not-allowed rounded-lg bg-[color:var(--accent-primary-hover)] px-5 py-2.5 text-sm font-medium text-white opacity-60"
      >
        Export Report
      </button>
    </div>
  );
}
