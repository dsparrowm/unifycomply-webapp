"use client";

import { AmlMatchPortrait } from "@/components/aml/lookup/AmlMatchPortrait";
import { cn } from "@/lib/utils";
import type { AmlSearchInformation } from "@/types/aml";

type AmlSearchInfoSidebarProps = {
  information: AmlSearchInformation;
};

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[color:var(--border-subtle)] px-5 py-4 last:border-b-0">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{label}</p>
      <div className="mt-2 text-sm text-[color:var(--text-muted)]">{children}</div>
    </div>
  );
}

export function AmlSearchInfoSidebar({ information }: AmlSearchInfoSidebarProps) {
  return (
    <div>
      {information.photoSrc ? (
        <div className="relative mx-5 mt-5 overflow-hidden rounded-xl bg-[color:var(--bg-muted)]">
          <AmlMatchPortrait className="h-52 w-full" />
          {information.matchSuccessful ? (
            <span className="absolute right-3 top-3 rounded-md bg-[color:var(--accent-primary)] px-2 py-1 text-[11px] font-medium text-white">
              Match Successful
            </span>
          ) : null}
        </div>
      ) : null}

      <InfoBlock label="Search Item">{information.searchItem}</InfoBlock>
      <InfoBlock label="Entity Type">{information.entityType}</InfoBlock>
      <InfoBlock label={information.scoreLabel}>{information.score}%</InfoBlock>
      <InfoBlock label="Databases">
        <ul className="space-y-1">
          {information.databases.map((database) => (
            <li key={database} className={cn(database === "PEP TIER 3" && "relative")}>
              {database}
            </li>
          ))}
        </ul>
      </InfoBlock>
      <InfoBlock label="Country">{information.country}</InfoBlock>
      <InfoBlock label="Risk Engine">{information.riskEngine}</InfoBlock>
    </div>
  );
}
