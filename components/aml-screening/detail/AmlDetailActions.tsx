import { BriefcaseBusiness, Check, ShieldAlert } from "lucide-react";
import type { AmlScreeningStatus } from "@/types/aml-screening";

type AmlDetailActionsProps = {
  status: AmlScreeningStatus;
  onClear: () => void;
  onCreateCase: () => void;
  onEscalate: () => void;
};

export function AmlDetailActions({
  status,
  onClear,
  onCreateCase,
  onEscalate,
}: AmlDetailActionsProps) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="font-semibold text-[color:var(--text-primary)]">Decision Actions</h2>
      <p className="mt-1 text-sm text-[color:var(--text-muted)]">
        Record a compliance outcome for this screening
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={onClear}
          disabled={status === "clear"}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--state-success)] text-sm font-medium text-[color:var(--state-success)] hover:bg-[color:var(--state-success-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Clear Screening
        </button>
        <button
          type="button"
          onClick={onCreateCase}
          disabled={status === "case-created"}
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--accent-primary)] text-sm font-medium text-[color:var(--accent-primary)] hover:bg-[color:var(--accent-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BriefcaseBusiness className="h-4 w-4" />
          Create Case
        </button>
        <button
          type="button"
          onClick={onEscalate}
          disabled={status === "escalated"}
          className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[color:var(--accent-primary)] text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldAlert className="h-4 w-4" />
          Escalate to Senior Officer
        </button>
      </div>
    </section>
  );
}
