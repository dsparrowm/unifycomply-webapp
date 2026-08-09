"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AmlSearchResultsInformation } from "@/types/aml-screening";

type RailTab = "search-information" | "filters";

type AmlSearchResultsRailProps = {
  information: AmlSearchResultsInformation;
};

export function AmlSearchResultsRail({ information }: AmlSearchResultsRailProps) {
  const [activeTab, setActiveTab] = useState<RailTab>("search-information");

  return (
    <aside className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <div className="flex gap-6 border-b border-[color:var(--border-default)]">
        <RailTabButton
          active={activeTab === "search-information"}
          onClick={() => setActiveTab("search-information")}
        >
          Search Information
        </RailTabButton>
        <RailTabButton
          active={activeTab === "filters"}
          onClick={() => setActiveTab("filters")}
        >
          Filters
        </RailTabButton>
      </div>

      {activeTab === "search-information" ? (
        <div className="mt-5">
          <div className="relative overflow-hidden rounded-lg bg-[color:var(--bg-muted)]">
            <div className="flex h-52 items-center justify-center">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-3xl font-semibold text-[color:var(--accent-primary-hover)]">
                {information.avatarInitials}
              </span>
            </div>
            {information.matchSuccessful ? (
              <span className="absolute right-3 top-3 rounded-md bg-[color:var(--accent-primary-hover)] px-2.5 py-1 text-xs font-medium text-white">
                Match Successful
              </span>
            ) : null}
          </div>

          <dl className="mt-5 space-y-4">
            <InfoRow label="Search Item" value={information.searchItem} />
            <InfoRow label="Entity Type" value={information.entityTypeLabel} />
            <InfoRow label="Match Score" value={`${information.matchScorePercent}%`} />
            <div>
              <dt className="text-sm font-semibold text-[color:var(--text-primary)]">
                Databases
              </dt>
              <dd className="mt-2 space-y-1.5">
                {information.databases.map((database) => (
                  <p
                    key={database.id}
                    className="flex items-center gap-2 text-sm text-[color:var(--text-muted)]"
                  >
                    <span>{database.label}</span>
                    {database.flagged ? (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full bg-[color:var(--state-error)]"
                        aria-label="Matched database"
                      />
                    ) : null}
                  </p>
                ))}
              </dd>
            </div>
            <InfoRow label="Country" value={information.country} />
            <InfoRow label="Risk Engine" value={information.riskEngine} />
          </dl>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[color:var(--text-primary)]">Filters</p>
          <p className="mt-2 text-sm text-[color:var(--text-muted)]">
            Filter controls for this search will appear here once the Figma Filters panel is
            provided.
          </p>
        </div>
      )}
    </aside>
  );
}

function RailTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-b-2 pb-3 text-sm font-medium transition-colors",
        active
          ? "border-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]"
          : "border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
      )}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-[color:var(--text-primary)]">{label}</dt>
      <dd className="mt-1 text-sm text-[color:var(--text-muted)]">{value}</dd>
    </div>
  );
}
