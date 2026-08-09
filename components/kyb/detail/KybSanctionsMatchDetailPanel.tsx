"use client";

import { useState } from "react";
import { AlertTriangle, Check, ChevronDown, ChevronUp, X } from "lucide-react";
import type { KybSanctionsMatchCriterion, KybSanctionsMatchDetail } from "@/types/kyb";
import { cn } from "@/lib/utils";

type KybSanctionsMatchDetailPanelProps = {
  listLabel: string;
  detail: KybSanctionsMatchDetail;
};

function FlaggedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-[color:var(--state-error-soft)] font-medium text-[color:var(--state-error)]",
        compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-sm",
      )}
    >
      <AlertTriangle className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      Flagged
    </span>
  );
}

function CriterionResult({ criterion }: { criterion: KybSanctionsMatchCriterion }) {
  if (criterion.result === "percent") {
    return (
      <span className="text-sm font-medium text-[color:var(--state-warning)]">
        {criterion.percent ?? criterion.value}%
      </span>
    );
  }

  if (criterion.result === "yes") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-success)]">
        <Check className="h-4 w-4" />
        Yes
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-error)]">
      <X className="h-4 w-4" />
      No
      <span className="font-normal text-[color:var(--text-muted)]">({criterion.value})</span>
    </span>
  );
}

export function KybSanctionsMatchDetailPanel({
  listLabel,
  detail,
}: KybSanctionsMatchDetailPanelProps) {
  const [expanded, setExpanded] = useState(detail.defaultExpanded ?? false);

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">{listLabel}</p>
        </div>
        <FlaggedBadge />
      </div>

      <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-[color:var(--state-error)]/30">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="flex w-full items-center justify-between bg-[color:var(--bg-muted)] px-5 py-3 text-left text-sm font-semibold text-[color:var(--text-primary)]"
        >
          View Details
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {expanded ? (
          <div className="space-y-5 border-t border-[color:var(--border-default)] px-5 py-5">
            <div className="rounded-xl border border-[color:var(--state-error)]/20 bg-[color:var(--state-error-soft)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {detail.summaryTitle}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">{detail.summary}</p>
                </div>
                <FlaggedBadge compact />
              </div>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <p className="text-[color:var(--text-muted)]">
                  <span className="font-medium text-[color:var(--text-primary)]">Screening Date:</span>{" "}
                  {detail.screeningDate}
                </p>
                <p className="text-[color:var(--text-muted)]">
                  <span className="font-medium text-[color:var(--text-primary)]">Match Type:</span>{" "}
                  {detail.matchType}
                </p>
                <p className="text-[color:var(--text-muted)]">
                  <span className="font-medium text-[color:var(--text-primary)]">Risk Level:</span>{" "}
                  <span className="font-semibold text-[color:var(--state-warning)]">
                    {detail.riskLevel}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {detail.entity.name}
                  </p>
                  <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
                    {detail.entity.country}
                  </p>
                </div>
                <p className="text-sm leading-6 text-[color:var(--text-muted)]">
                  {detail.entity.reason}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[color:var(--text-muted)]">List source</p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
                    {detail.listSource.name}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[color:var(--text-muted)]">Date listed</p>
                    <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
                      {detail.listSource.dateListed}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[color:var(--text-muted)]">Program</p>
                    <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
                      {detail.listSource.program}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Match Analysis
              </h4>
              <div className="mt-3 rounded-xl bg-[color:var(--bg-muted)] px-4">
                {detail.matchAnalysis.map((criterion, index) => (
                  <div
                    key={criterion.id}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 py-3",
                      index < detail.matchAnalysis.length - 1 &&
                        "border-b border-[color:var(--border-default)]",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--text-primary)]">
                        {criterion.label}
                      </p>
                      {criterion.result === "percent" ? (
                        <p className="text-sm text-[color:var(--text-muted)]">{criterion.value}</p>
                      ) : null}
                    </div>
                    <CriterionResult criterion={criterion} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Analysis Notes
              </h4>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-primary)]">
                {detail.analysisNotes}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
              >
                {detail.primaryActionLabel}
              </button>
              <button
                type="button"
                className="rounded-lg border border-[color:var(--state-error)]/40 bg-[color:var(--bg-surface)] px-4 py-2 text-sm font-medium text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
              >
                {detail.secondaryActionLabel}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
