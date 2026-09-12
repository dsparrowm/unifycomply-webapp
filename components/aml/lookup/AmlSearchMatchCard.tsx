"use client";

import { AlertTriangle } from "lucide-react";
import { AmlCheckbox } from "@/components/aml/lookup/AmlCheckbox";
import { AmlMatchPortrait } from "@/components/aml/lookup/AmlMatchPortrait";
import { amlMatchRelevanceLabels, amlMatchStatusLabels } from "@/lib/data/aml-search-result";
import { cn } from "@/lib/utils";
import type { AmlSearchMatch } from "@/types/aml";

type AmlSearchMatchCardProps = {
  match: AmlSearchMatch;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
};

export function AmlSearchMatchCard({
  match,
  selected,
  onSelectedChange,
}: AmlSearchMatchCardProps) {
  return (
    <article className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <AmlCheckbox
            id={`${match.id}-select`}
            label={`Match Score: ${match.matchScore}% Match`}
            checked={selected}
            onChange={onSelectedChange}
          />
        </div>
        <span className="text-sm font-medium text-[color:var(--state-warning)]">
          Risk Score: {match.riskScore}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <p className="text-xs text-[color:var(--text-light)]">Name</p>
            <p className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">{match.name}</p>
          </div>
          <div>
            <p className="text-xs text-[color:var(--text-light)]">Relevance</p>
            <span className="mt-1 inline-flex rounded-md bg-[color:var(--state-info-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--state-info)]">
              {amlMatchRelevanceLabels[match.relevance]}
            </span>
          </div>
          <div>
            <p className="text-xs text-[color:var(--text-light)]">Match Status</p>
            <p
              className={cn(
                "mt-1 inline-flex items-center gap-1.5 text-sm font-medium",
                match.matchStatus === "potential-match"
                  ? "text-[color:var(--state-warning)]"
                  : "text-[color:var(--text-primary)]",
              )}
            >
              {match.matchStatus === "potential-match" ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : null}
              {amlMatchStatusLabels[match.matchStatus]}
            </p>
          </div>
          <div>
            <p className="text-xs text-[color:var(--text-light)]">DOB</p>
            <p className="mt-1 text-sm text-[color:var(--text-primary)]">{match.dateOfBirth}</p>
          </div>
        </div>

        {match.photoSrc ? <AmlMatchPortrait className="h-16 w-16 rounded-lg" /> : null}
      </div>

      <div className="mt-5">
        <p className="text-xs text-[color:var(--text-light)]">Database</p>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {match.databases.map((database) => (
            <span
              key={database}
              className="inline-flex rounded-md bg-[color:var(--bg-muted)] px-2 py-0.5 text-xs font-medium text-[color:var(--text-muted)]"
            >
              {database}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
