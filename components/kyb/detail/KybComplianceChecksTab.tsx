"use client";

import { useState } from "react";
import { KybDetailSectionHeader } from "@/components/kyb/detail/KybDetailSectionHeader";
import { KybSanctionsMatchDetailPanel } from "@/components/kyb/detail/KybSanctionsMatchDetailPanel";
import { AlertTriangle, Check, ChevronDown, ChevronUp } from "lucide-react";
import type {
  KybComplianceChecksData,
  KybComplianceRegistryCheck,
  KybComplianceRegistryStatus,
  KybComplianceSanctionsCheck,
  KybComplianceScreeningCheck,
  KybComplianceScreeningStatus,
} from "@/types/kyb";
import { cn } from "@/lib/utils";

type KybComplianceChecksTabProps = {
  complianceChecks: KybComplianceChecksData;
};

function RegistryStatusBadge({ status }: { status: KybComplianceRegistryStatus }) {
  if (status === "passed") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-success)]">
        <Check className="h-4 w-4" />
        Passed
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-error)]">
        <AlertTriangle className="h-4 w-4" />
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-warning)]">
      <AlertTriangle className="h-4 w-4" />
      Review
    </span>
  );
}

function ScreeningStatusLabel({ status }: { status: KybComplianceScreeningStatus }) {
  if (status === "no-match") {
    return <span className="text-sm font-medium text-[color:var(--state-success)]">No Match</span>;
  }

  if (status === "match") {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--state-warning)]">
        <AlertTriangle className="h-4 w-4" />
        Match
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--state-error-soft)] px-2.5 py-0.5 text-sm font-medium text-[color:var(--state-error)]">
      <AlertTriangle className="h-4 w-4" />
      Flagged
    </span>
  );
}

function TealCheckIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent-primary-hover)] text-white">
      <Check className="h-3.5 w-3.5" />
    </span>
  );
}

function RegistryCheckRow({ check }: { check: KybComplianceRegistryCheck }) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 py-4 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{check.title}</p>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">{check.description}</p>
      </div>
      <RegistryStatusBadge status={check.status} />
    </article>
  );
}

function ScreeningSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
        {title}
      </h3>
      <div className={cn("mt-3 rounded-xl bg-[color:var(--bg-muted)] px-5 py-2", className)}>
        {children}
      </div>
    </div>
  );
}

function SanctionsRow({ entry }: { entry: KybComplianceSanctionsCheck }) {
  if (entry.matchDetail) {
    return <KybSanctionsMatchDetailPanel listLabel={entry.label} detail={entry.matchDetail} />;
  }

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        {entry.status === "no-match" ? (
          <TealCheckIcon />
        ) : (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
        )}
        <p className="text-sm font-semibold text-[color:var(--text-primary)]">{entry.label}</p>
      </div>
      <ScreeningStatusLabel status={entry.status} />
    </div>
  );
}

function ExpandableScreeningCheck({ check }: { check: KybComplianceScreeningCheck }) {
  const [expanded, setExpanded] = useState(check.defaultExpanded ?? false);
  const canExpand = Boolean(check.detailSummary) && check.status !== "no-match";

  if (!canExpand) {
    return (
      <div className="flex items-center justify-between gap-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">{check.label}</p>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">{check.description}</p>
        </div>
        <ScreeningStatusLabel status={check.status} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[color:var(--text-primary)]">{check.label}</p>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">{check.description}</p>
        </div>
        <ScreeningStatusLabel status={check.status} />
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
          <div className="border-t border-[color:var(--border-default)] px-5 py-4">
            <p className="text-sm leading-6 text-[color:var(--text-primary)]">{check.detailSummary}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function KybComplianceChecksTab({ complianceChecks }: KybComplianceChecksTabProps) {
  const hasExpandedSanctions = complianceChecks.sanctionsLists.some((entry) => entry.matchDetail);
  const adverseTitle =
    complianceChecks.adverseMediaSectionTitle ?? "Adverse Media Screening";

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <KybDetailSectionHeader
        title="AML Screening"
        description="Anti Money Laundering compliance screening"
        status={complianceChecks.clearanceStatus}
      />

      <div className="space-y-6 p-6">
        <div className="space-y-3">
          {complianceChecks.registryChecks.map((check) => (
            <RegistryCheckRow key={check.id} check={check} />
          ))}
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
            Sanctions Screening (Screened against 4 global sanctions lists)
          </h3>
          {hasExpandedSanctions ? (
            <div className="mt-3 space-y-3">
              {complianceChecks.sanctionsLists.map((entry) =>
                entry.matchDetail ? (
                  <KybSanctionsMatchDetailPanel
                    key={entry.id}
                    listLabel={entry.label}
                    detail={entry.matchDetail}
                  />
                ) : (
                  <div
                    key={entry.id}
                    className="rounded-xl bg-[color:var(--bg-muted)] px-5"
                  >
                    <SanctionsRow entry={entry} />
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="mt-3 rounded-xl bg-[color:var(--bg-muted)] px-5 py-2">
              <div className="divide-y divide-[color:var(--border-subtle)]">
                {complianceChecks.sanctionsLists.map((entry) => (
                  <SanctionsRow key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}
        </div>

        <ScreeningSection
          title="Politically Exposed Person"
          className={
            complianceChecks.pepCheck.detailSummary &&
            complianceChecks.pepCheck.status !== "no-match"
              ? "bg-transparent px-0 py-0"
              : undefined
          }
        >
          <ExpandableScreeningCheck check={complianceChecks.pepCheck} />
        </ScreeningSection>

        <ScreeningSection
          title={adverseTitle}
          className={
            complianceChecks.adverseMediaCheck.detailSummary &&
            complianceChecks.adverseMediaCheck.status !== "no-match"
              ? "bg-transparent px-0 py-0"
              : undefined
          }
        >
          <ExpandableScreeningCheck check={complianceChecks.adverseMediaCheck} />
        </ScreeningSection>
      </div>
    </div>
  );
}
