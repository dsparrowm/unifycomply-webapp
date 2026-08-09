import { Check, ShieldAlert } from "lucide-react";

type BankAnalysisDetailActionsProps = {
  escalated: boolean;
  onEscalate: () => void;
};

export function BankAnalysisDetailActions({
  escalated,
  onEscalate,
}: BankAnalysisDetailActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 border-t border-[color:var(--border-default)] bg-[color:var(--bg-base)] px-4 py-4 sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[color:var(--text-muted)]">
          Escalate unusual account activity for a Senior Officer decision.
        </p>
        <button
          type="button"
          onClick={onEscalate}
          disabled={escalated}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)] disabled:cursor-not-allowed disabled:bg-[color:var(--border-default)] disabled:text-[color:var(--text-muted)]"
        >
          {escalated ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
          )}
          {escalated ? "Escalated to Senior Officer" : "Escalate to Senior Officer"}
        </button>
      </div>
    </div>
  );
}
