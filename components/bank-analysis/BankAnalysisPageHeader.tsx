type BankAnalysisPageHeaderProps = {
  onNewLookup: () => void;
};

export function BankAnalysisPageHeader({ onNewLookup }: BankAnalysisPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">Bank Analysis</h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
          Review account analysis runs
        </p>
      </div>
      <button
        type="button"
        onClick={onNewLookup}
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
      >
        New Lookup
      </button>
    </div>
  );
}
