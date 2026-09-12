import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type AmlCaseDetailHeaderProps = {
  caseName: string;
};

export function AmlCaseDetailHeader({ caseName }: AmlCaseDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-4">
        <Link
          href="/aml-screening"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <p className="text-sm text-[color:var(--text-muted)]">
          AML Screening / {caseName}
        </p>
      </div>
      <button
        type="button"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
      >
        Export Report
      </button>
    </div>
  );
}
