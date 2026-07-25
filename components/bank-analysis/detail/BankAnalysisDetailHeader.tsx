import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type BankAnalysisDetailHeaderProps = {
  customerName: string;
};

export function BankAnalysisDetailHeader({
  customerName,
}: BankAnalysisDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <Link
          href="/bank-analysis"
          className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <p className="text-xs text-[color:var(--text-light)]">
          Bank Analysis/
          <span className="ml-1 font-medium text-[color:var(--accent-primary-hover)]">
            {customerName.toUpperCase()}
          </span>
        </p>
      </div>

      <button
        type="button"
        disabled
        title="Report export is not connected in the mock-data build"
        className="w-fit cursor-default rounded-lg bg-[color:var(--accent-primary-hover)] px-5 py-2.5 text-sm font-medium text-white"
      >
        Export Report
      </button>
    </div>
  );
}
