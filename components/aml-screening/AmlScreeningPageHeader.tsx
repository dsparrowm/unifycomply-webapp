import Link from "next/link";

export function AmlScreeningPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">AML Screening</h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
          Review aml screening and monitoring
        </p>
      </div>
      <Link
        href="/aml-screening/create-case"
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
      >
        Create a Case
      </Link>
    </div>
  );
}
