"use client";

import { Check, Circle } from "lucide-react";
import type { DocumentRequirementItem } from "@/types/customer-compliance";

type DocumentRequirementsChecklistProps = {
  requirements: DocumentRequirementItem[];
  title?: string;
};

export function DocumentRequirementsChecklist({
  requirements,
  title = "Required documents",
}: DocumentRequirementsChecklistProps) {
  if (requirements.length === 0) {
    return null;
  }

  const satisfiedCount = requirements.filter((item) => item.satisfied).length;

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</h3>
        <p className="text-xs text-[color:var(--text-muted)]">
          {satisfiedCount} of {requirements.length} received
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {requirements.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-lg border border-[color:var(--border-subtle)] px-3 py-3"
          >
            <span
              className={
                item.satisfied
                  ? "mt-0.5 text-[color:var(--state-success)]"
                  : "mt-0.5 text-[color:var(--text-light)]"
              }
              aria-hidden
            >
              {item.satisfied ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[color:var(--text-primary)]">{item.label}</p>
                <span
                  className={
                    item.satisfied
                      ? "rounded-full bg-[color:var(--state-success-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--state-success)]"
                      : "rounded-full bg-[color:var(--state-warning-soft)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--state-warning)]"
                  }
                >
                  {item.satisfied ? "Received" : "Missing"}
                </span>
              </div>
              {item.acceptedTypes.length > 0 ? (
                <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                  Accepts: {item.acceptedTypes.join(", ")}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
