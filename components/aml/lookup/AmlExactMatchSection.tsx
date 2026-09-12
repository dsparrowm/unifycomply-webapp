"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AmlMatchMode } from "@/types/aml";

type AmlExactMatchSectionProps = {
  matchMode: AmlMatchMode;
  matchScore: number;
  onMatchModeChange: (mode: AmlMatchMode) => void;
  onMatchScoreChange: (score: number) => void;
};

export function AmlExactMatchSection({
  matchMode,
  matchScore,
  onMatchModeChange,
  onMatchScoreChange,
}: AmlExactMatchSectionProps) {
  const scoreEnabled = matchMode === "score";

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">Exact Match</h3>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="aml-match-mode"
              checked={matchMode === "score"}
              onChange={() => onMatchModeChange("score")}
              className="h-4 w-4 accent-[color:var(--accent-primary-hover)]"
            />
            <span className="text-sm text-[color:var(--text-primary)]">Match Score</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="aml-match-mode"
              checked={matchMode === "exact"}
              onChange={() => onMatchModeChange("exact")}
              className="h-4 w-4 accent-[color:var(--accent-primary-hover)]"
            />
            <span className="inline-flex items-center gap-1 text-sm text-[color:var(--text-primary)]">
              Exact Match
              <Info className="h-3.5 w-3.5 text-[color:var(--text-light)]" aria-hidden />
            </span>
          </label>
        </div>

        {scoreEnabled ? (
          <span className="rounded-full border border-[color:var(--border-default)] bg-white px-2.5 py-0.5 text-xs font-medium text-[color:var(--text-primary)]">
            {matchScore}%
          </span>
        ) : null}
      </div>

      <div className="space-y-2">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={matchScore}
          disabled={!scoreEnabled}
          onChange={(event) => onMatchScoreChange(Number(event.target.value))}
          className={cn(
            "h-1.5 w-full appearance-none rounded-full accent-[color:var(--accent-primary-hover)]",
            scoreEnabled
              ? "bg-[color:var(--border-default)]"
              : "cursor-not-allowed bg-[color:var(--border-subtle)] opacity-60",
          )}
        />
        <div className="flex justify-between text-xs text-[color:var(--text-light)]">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </section>
  );
}
