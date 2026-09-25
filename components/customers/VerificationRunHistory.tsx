import { CheckCircle2, CircleAlert, Clock3 } from "lucide-react";
import type { ApiVerificationDetail, ApiVerificationEvent, ApiVerificationTask } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type VerificationRunHistoryProps = {
  detail: ApiVerificationDetail;
  isLoading?: boolean;
};

function formatLabel(value: string | undefined | null): string {
  if (!value) return "Unknown";
  return value
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string | undefined | null): string {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function outcomeClass(outcome: string | undefined): string {
  if (["passed", "verified", "success"].includes(outcome?.toLowerCase() ?? "")) {
    return "text-[color:var(--state-success)]";
  }
  if (["failed", "error"].includes(outcome?.toLowerCase() ?? "")) {
    return "text-[color:var(--state-error)]";
  }
  return "text-[color:var(--state-warning)]";
}

function OutcomeIcon({ outcome }: { outcome?: string }) {
  const normalized = outcome?.toLowerCase();
  if (["passed", "verified", "success"].includes(normalized ?? "")) {
    return <CheckCircle2 className="h-4 w-4" />;
  }
  if (["failed", "error"].includes(normalized ?? "")) {
    return <CircleAlert className="h-4 w-4" />;
  }
  return <Clock3 className="h-4 w-4" />;
}

function EventRow({ event }: { event: ApiVerificationEvent }) {
  return (
    <li className="flex gap-3 border-b border-[color:var(--border-default)] py-3 last:border-b-0">
      <span className="mt-0.5 rounded-full bg-[color:var(--bg-muted)] p-1.5 text-[color:var(--text-muted)]">
        <Clock3 className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[color:var(--text-primary)]">
          {formatLabel(event.action)}
        </p>
        <p className="text-xs text-[color:var(--text-muted)]">
          {formatDate(event.createdAt)}
          {event.actor ? ` · ${event.actor}` : ""}
        </p>
      </div>
    </li>
  );
}

export function VerificationRunHistory({ detail, isLoading = false }: VerificationRunHistoryProps) {
  const tasks = detail.run?.tasks ?? [];
  const events = detail.events ?? [];
  const risk = detail.risk;

  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Verification run
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            {detail.workflow.verificationTypes?.map(formatLabel).join(" + ") ||
              formatLabel(detail.workflow.verificationType)}
          </p>
        </div>
        <span className="rounded-full bg-[color:var(--state-info-soft)] px-3 py-1 text-sm font-medium text-[color:var(--state-info)]">
          {formatLabel(detail.workflow.status)}
        </span>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-[color:var(--text-muted)]">Loading run details...</p>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-[color:var(--bg-muted)] p-3">
              <p className="text-xs text-[color:var(--text-muted)]">Started</p>
              <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
                {formatDate(detail.run?.run.startedAt ?? detail.workflow.createdAt)}
              </p>
            </div>
            <div className="rounded-lg bg-[color:var(--bg-muted)] p-3">
              <p className="text-xs text-[color:var(--text-muted)]">Risk decision</p>
              <p className={cn("mt-1 text-sm font-medium", outcomeClass(risk?.decision))}>
                {formatLabel(risk?.decision ?? risk?.band ?? "Pending")}
              </p>
            </div>
            <div className="rounded-lg bg-[color:var(--bg-muted)] p-3">
              <p className="text-xs text-[color:var(--text-muted)]">Risk score</p>
              <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
                {risk?.score ?? "Pending"}
              </p>
            </div>
          </div>

          {tasks.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Checks
              </h3>
              <ul className="mt-2 divide-y divide-[color:var(--border-default)]">
                {tasks.map((task: ApiVerificationTask) => (
                  <li key={task.id} className="flex items-center justify-between gap-3 py-3">
                    <span className="text-sm text-[color:var(--text-primary)]">
                      {formatLabel(task.verificationType)}
                    </span>
                    <span className={cn("flex items-center gap-1.5 text-sm font-medium", outcomeClass(task.outcome))}>
                      <OutcomeIcon outcome={task.outcome} />
                      {formatLabel(task.outcome)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {events.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Audit history
              </h3>
              <ul className="mt-2">
                {events.map((event) => <EventRow key={event.id} event={event} />)}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-[color:var(--text-muted)]">
              No workflow events have been recorded yet.
            </p>
          )}
        </div>
      )}
    </section>
  );
}