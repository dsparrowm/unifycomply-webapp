import { Building2, Landmark, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BankAnalysisLinkedEntity } from "@/types/bank-analysis";

type BankAnalysisLinkedEntityCardProps = {
  entity: BankAnalysisLinkedEntity;
};

export function BankAnalysisLinkedEntityCard({
  entity,
}: BankAnalysisLinkedEntityCardProps) {
  return (
    <article className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]">
            {entity.kind === "trust" ? (
              <UserRound className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Building2 className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-[color:var(--text-primary)]">
              {entity.name}
            </h3>
            <p className="text-xs text-[color:var(--text-light)]">{entity.relationship}</p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
            entity.tier === 3
              ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
              : "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
          )}
        >
          Tier {entity.tier}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between text-xs">
        <span className="text-[color:var(--text-muted)]">Shared Account</span>
        <span className="font-medium text-[color:var(--text-primary)]">
          {entity.sharedAccounts}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]">
            <Landmark className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-[color:var(--text-primary)]">
              {entity.bankName}
            </p>
            <p className="text-xs text-[color:var(--text-light)]">
              {entity.maskedAccountNumber}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">
            {entity.balance}
          </p>
          <p className="mt-1 text-xs font-medium text-[color:var(--state-info)]">
            {entity.accountType}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-xs">
        <span className="text-[color:var(--text-muted)]">Last Activity</span>
        <span className="font-medium text-[color:var(--text-primary)]">
          {entity.lastActivity}
        </span>
      </div>
    </article>
  );
}
