"use client";

type KycDetailFooterActionsProps = {
  onRequestResubmission: () => void;
  onReject: () => void;
  onApprove: () => void;
};

export function KycDetailFooterActions({
  onRequestResubmission,
  onReject,
  onApprove,
}: KycDetailFooterActionsProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-2 border-t border-[color:var(--border-default)] bg-[color:var(--bg-base)] px-4 py-4 sm:-mx-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onRequestResubmission}
          className="h-11 min-w-[190px] rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
        >
          Request Resubmission
        </button>
        <button
          type="button"
          onClick={onReject}
          className="h-11 min-w-[135px] rounded-lg border border-[color:var(--state-error)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="h-11 min-w-[135px] rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
