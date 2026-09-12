"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { AmlSearchFiltersPanel, type AmlSearchResultFilters } from "@/components/aml/lookup/AmlSearchFiltersPanel";
import { AmlSearchInfoSidebar } from "@/components/aml/lookup/AmlSearchInfoSidebar";
import { AmlSearchMatchCard } from "@/components/aml/lookup/AmlSearchMatchCard";
import { AmlToggle } from "@/components/aml/lookup/AmlToggle";
import { KycPagination } from "@/components/kyc/KycPagination";
import { KybLookupBackHeader } from "@/components/kyb/lookup/KybLookupBackHeader";
import { amlMatchStatusOptions } from "@/lib/data/aml-search-result";
import { cn } from "@/lib/utils";
import type { AmlMatchStatus, AmlSearchMatch, AmlSearchResultData } from "@/types/aml";

const PAGE_SIZE = 4;

const emptyFilters: AmlSearchResultFilters = {
  relevance: ["name"],
  entityTypes: [],
  databases: [],
};

type SidebarTab = "information" | "filters";

type AmlSearchResultPanelProps = {
  data: AmlSearchResultData;
};

function matchesFilters(match: AmlSearchMatch, filters: AmlSearchResultFilters) {
  if (filters.relevance.length > 0) {
    if (match.relevance === "country" || !filters.relevance.includes(match.relevance)) {
      return false;
    }
  }

  if (filters.entityTypes.length > 0 && !filters.entityTypes.includes("person")) {
    return false;
  }

  return true;
}

export function AmlSearchResultPanel({ data }: AmlSearchResultPanelProps) {
  const [activeMonitoring, setActiveMonitoring] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("information");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matches, setMatches] = useState(data.matches);
  const [draftFilters, setDraftFilters] = useState<AmlSearchResultFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<AmlSearchResultFilters>({
    relevance: [],
    entityTypes: [],
    databases: [],
  });
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<AmlMatchStatus>("potential-match");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMatches = useMemo(
    () => matches.filter((match) => matchesFilters(match, appliedFilters)),
    [appliedFilters, matches],
  );

  const totalPages = Math.max(1, Math.ceil(filteredMatches.length / PAGE_SIZE));
  const pageMatches = filteredMatches.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasSelection = selectedIds.length > 0;

  const handleSave = () => {
    if (!hasSelection) {
      return;
    }

    setMatches((current) =>
      current.map((match) =>
        selectedIds.includes(match.id) ? { ...match, matchStatus: pendingStatus } : match,
      ),
    );
    setStatusMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <KybLookupBackHeader
        backHref="/aml-screening/lookup"
        breadcrumb={`Search Result / ${data.caseName}`}
        action={
          <AmlToggle
            id="aml-result-monitoring"
            label="Active Monitoring"
            checked={activeMonitoring}
            onChange={setActiveMonitoring}
          />
        }
      />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="min-w-0 flex-1 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                No of Records : {filteredMatches.length}
              </p>
              {hasSelection ? (
                <div className="relative">
                  <button
                    type="button"
                    aria-expanded={statusMenuOpen}
                    onClick={() => setStatusMenuOpen((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-white px-3 py-2 text-sm text-[color:var(--text-muted)]"
                  >
                    Change Match Status
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {statusMenuOpen ? (
                    <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-52 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-lg">
                      {amlMatchStatusOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setPendingStatus(option.value);
                            setStatusMenuOpen(false);
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
                        >
                          {option.label}
                          {pendingStatus === option.value ? (
                            <Check className="h-4 w-4 text-[color:var(--accent-primary)]" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {hasSelection ? (
              <button
                type="button"
                onClick={handleSave}
                className="h-10 min-w-[88px] rounded-lg border border-[color:var(--border-default)] bg-white px-4 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
              >
                Save
              </button>
            ) : null}
          </div>

          <div
            className={cn(
              "grid gap-4",
              pageMatches.length > 1 ? "md:grid-cols-2" : "grid-cols-1",
            )}
          >
            {pageMatches.map((match) => (
              <AmlSearchMatchCard
                key={match.id}
                match={match}
                selected={selectedIds.includes(match.id)}
                onSelectedChange={(selected) => {
                  setSelectedIds((current) =>
                    selected
                      ? [...current, match.id]
                      : current.filter((id) => id !== match.id),
                  );
                }}
              />
            ))}
          </div>

          {filteredMatches.length === 0 ? (
            <p className="py-16 text-center text-sm text-[color:var(--text-muted)]">
              No matches for the selected filters
            </p>
          ) : (
            <div className="mt-6">
              <KycPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>

        <aside className="w-full shrink-0 overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] xl:w-[320px]">
          <div className="grid grid-cols-2 gap-2 p-3">
            {(
              [
                { id: "information", label: "Search Information" },
                { id: "filters", label: "Filters" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSidebarTab(tab.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  sidebarTab === tab.id
                    ? "bg-white text-[color:var(--text-primary)] shadow-sm"
                    : "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {sidebarTab === "information" ? (
            <AmlSearchInfoSidebar information={data.searchInformation} />
          ) : (
            <AmlSearchFiltersPanel
              draft={draftFilters}
              onDraftChange={setDraftFilters}
              onClear={() => {
                setDraftFilters({ relevance: [], entityTypes: [], databases: [] });
                setAppliedFilters({ relevance: [], entityTypes: [], databases: [] });
                setCurrentPage(1);
              }}
              onApply={() => {
                setAppliedFilters(draftFilters);
                setCurrentPage(1);
              }}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
