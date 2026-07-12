"use client";

import { useState } from "react";
import { AlertTriangle, Check, ChevronDown, ChevronUp, X } from "lucide-react";
import type { KycPepMatchDetail } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycPepMatchDetailPanelProps = {
  detail: KycPepMatchDetail;
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

function MatchPercent({ value }: { value: number }) {
  const isHigh = value >= 90;

  return (
    <span
      className={cn(
        "text-sm font-medium",
        isHigh ? "text-[color:var(--state-success)]" : "text-[color:var(--state-warning)]",
      )}
    >
      Match: {value}%
    </span>
  );
}

function DetailField({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs text-[color:var(--text-muted)]">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold text-[color:var(--text-primary)]", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

function SectionBlock({
  title,
  children,
  titleClassName,
}: {
  title: string;
  children: React.ReactNode;
  titleClassName?: string;
}) {
  return (
    <div>
      <h4
        className={cn(
          "text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]",
          titleClassName,
        )}
      >
        {title}
      </h4>
      <div className="mt-3 rounded-xl bg-[color:var(--bg-muted)] px-4">{children}</div>
    </div>
  );
}

export function KycPepMatchDetailPanel({ detail }: KycPepMatchDetailPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
        Politically Exposed Person (PEP) Check
      </h3>

      <div className="mt-3 overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-[color:var(--text-primary)]">PEP Screening</p>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">Politically exposed person</p>
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
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">PEP Match</p>
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
                    <span className="font-semibold text-[color:var(--state-warning)]">{detail.riskLevel}</span>
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailField label="Name" value={detail.subject.name} />
                <DetailField label="Title/Position" value={detail.subject.title} />
                <DetailField label="PEP Position" value={detail.subject.pepPosition} />
                <DetailField label="Jurisdiction" value={detail.subject.jurisdiction} />
                <DetailField label="Relationship" value={detail.subject.relationship} />
                <DetailField
                  label="Match"
                  value={`${detail.subject.matchPercent}%`}
                  valueClassName="text-[color:var(--state-warning)]"
                />
              </div>

              <SectionBlock title="Match Analysis (Hit)">
                {detail.bioMatches.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-3 py-3",
                      index < detail.bioMatches.length - 1 &&
                        "border-b border-[color:var(--border-default)]",
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-[color:var(--text-primary)]">{item.label}</p>
                      {item.value ? (
                        <p className="text-sm text-[color:var(--text-muted)]">{item.value}</p>
                      ) : null}
                      {item.secondaryValue ? (
                        <p className="text-sm text-[color:var(--text-muted)]">{item.secondaryValue}</p>
                      ) : null}
                    </div>
                    <MatchPercent value={item.matchPercent} />
                  </div>
                ))}
              </SectionBlock>

              <SectionBlock title="Source Analysis">
                {detail.sources.map((source, index) => (
                  <div
                    key={source.id}
                    className={cn(
                      "flex items-center justify-between gap-3 py-3",
                      index < detail.sources.length - 1 &&
                        "border-b border-[color:var(--border-default)]",
                    )}
                  >
                    <p className="text-sm text-[color:var(--text-primary)]">{source.label}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--state-success)]">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--state-success)] text-white">
                        <Check className="h-3 w-3" />
                      </span>
                      Found
                    </span>
                  </div>
                ))}
              </SectionBlock>

              <SectionBlock title="PEP Timeline">
                <div className="grid gap-3 py-3 sm:grid-cols-2">
                  <p className="text-sm text-[color:var(--text-primary)]">
                    <span className="text-[color:var(--text-muted)]">PEP Status Commenced:</span>{" "}
                    {detail.timeline.commenced}
                  </p>
                  <p className="text-sm text-[color:var(--text-primary)]">
                    <span className="text-[color:var(--text-muted)]">PEP Status Ended:</span>{" "}
                    {detail.timeline.ended}
                  </p>
                </div>
              </SectionBlock>

              <SectionBlock title="Known Family Members">
                {detail.familyMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center justify-between gap-3 py-3",
                      index < detail.familyMembers.length - 1 &&
                        "border-b border-[color:var(--border-default)]",
                    )}
                  >
                    <p className="text-sm text-[color:var(--text-primary)]">
                      <span className="font-medium">{member.relationship}:</span> {member.name}
                    </p>
                    {member.pepMatch ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--state-error-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--state-error)]">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        PEP Match
                      </span>
                    ) : null}
                  </div>
                ))}
              </SectionBlock>

              <SectionBlock title="Associated Entities">
                {detail.associatedEntities.map((entity, index) => (
                  <div
                    key={entity.id}
                    className={cn(
                      "py-3",
                      index < detail.associatedEntities.length - 1 &&
                        "border-b border-[color:var(--border-default)]",
                    )}
                  >
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">{entity.name}</p>
                    <p className="text-sm text-[color:var(--text-muted)]">{entity.period}</p>
                  </div>
                ))}
              </SectionBlock>

              <div>
                <h4 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--state-error)]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
                    <X className="h-2.5 w-2.5" />
                  </span>
                  Risk Factors
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {detail.riskFactors.map((factor) => (
                    <li
                      key={factor}
                      className="flex items-start gap-2.5 text-sm text-[color:var(--text-primary)]"
                    >
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]">
                        <X className="h-2.5 w-2.5" />
                      </span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-[color:var(--state-warning)]/40 bg-[color:var(--state-warning-soft)] px-4 py-4">
                <p className="text-sm leading-6 text-[color:var(--text-primary)]">{detail.recommendation}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
