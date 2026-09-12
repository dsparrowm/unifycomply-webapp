"use client";

import { AmlToggle } from "@/components/aml/lookup/AmlToggle";

type AmlAdvanceConfigurationProps = {
  matchAka: boolean;
  matchRca: boolean;
  onMatchAkaChange: (checked: boolean) => void;
  onMatchRcaChange: (checked: boolean) => void;
};

export function AmlAdvanceConfiguration({
  matchAka,
  matchRca,
  onMatchAkaChange,
  onMatchRcaChange,
}: AmlAdvanceConfigurationProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
        Advance Configuration
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4">
          <AmlToggle
            id="aml-match-aka"
            label="Match AKA"
            checked={matchAka}
            onChange={onMatchAkaChange}
          />
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">
            Broaden entity name search to Aliases and Alternate Names to eliminate false negatives
          </p>
        </div>
        <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4">
          <AmlToggle
            id="aml-match-rca"
            label="Match RCA"
            checked={matchRca}
            onChange={onMatchRcaChange}
          />
          <p className="mt-3 text-sm text-[color:var(--text-muted)]">
            Search through Relatives and close Associates for comprehensive compliance
          </p>
        </div>
      </div>
    </section>
  );
}
