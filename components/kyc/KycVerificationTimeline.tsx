import { Check, Clock } from "lucide-react";
import type { KycTimelineEvent } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycVerificationTimelineProps = {
  events: KycTimelineEvent[];
};

export function KycVerificationTimeline({ events }: KycVerificationTimelineProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Verification Timeline
      </h2>

      <ol className="relative mt-6 space-y-0">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const isCompleted = event.status === "completed";

          return (
            <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-4 top-8 h-[calc(100%-8px)] w-px bg-[color:var(--border-default)]"
                />
              ) : null}

              <span
                className={cn(
                  "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  isCompleted
                    ? "bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]"
                    : "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </span>

              <div className="pt-1">
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{event.title}</p>
                <p className="text-sm text-[color:var(--text-muted)]">{event.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
