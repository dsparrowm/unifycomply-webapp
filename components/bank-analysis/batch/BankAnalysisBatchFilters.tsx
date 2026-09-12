"use client";

import { useState } from "react";
import { Calendar, Filter, Search } from "lucide-react";
import { KycFilterDropdown } from "@/components/kyc/KycFilterDropdown";
import {
  bankAnalysisBatchAssigneeFilterOptions,
  bankAnalysisBatchDateFilterOptions,
  bankAnalysisBatchDefaultFilters,
  bankAnalysisBatchMoreFilterOptions,
  bankAnalysisBatchStatusFilterOptions,
  bankAnalysisBatchTypeFilterOptions,
} from "@/lib/data/bank-analysis-batch-filters";
import type { BankAnalysisBatchFilters } from "@/types/bank-analysis";

type BankAnalysisBatchFilterKey = "date" | "status" | "assignee" | "type" | "more";

type BankAnalysisBatchFiltersProps = {
  filters: BankAnalysisBatchFilters;
  onFiltersChange: (filters: BankAnalysisBatchFilters) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function BankAnalysisBatchFilterBar({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
}: BankAnalysisBatchFiltersProps) {
  const [openFilter, setOpenFilter] = useState<BankAnalysisBatchFilterKey | null>(null);

  const updateFilter = <K extends keyof BankAnalysisBatchFilters>(
    key: K,
    value: BankAnalysisBatchFilters[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleOpenChange = (key: BankAnalysisBatchFilterKey) => (open: boolean) => {
    setOpenFilter(open ? key : null);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <KycFilterDropdown
          label="Date"
          icon={<Calendar className="h-4 w-4" />}
          options={bankAnalysisBatchDateFilterOptions}
          value={filters.date}
          onChange={(value) => updateFilter("date", value)}
          open={openFilter === "date"}
          onOpenChange={handleOpenChange("date")}
        />

        <KycFilterDropdown
          label="Status"
          options={bankAnalysisBatchStatusFilterOptions}
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          open={openFilter === "status"}
          onOpenChange={handleOpenChange("status")}
        />

        <KycFilterDropdown
          label="Assignee"
          options={bankAnalysisBatchAssigneeFilterOptions}
          value={filters.assignee}
          onChange={(value) => updateFilter("assignee", value)}
          open={openFilter === "assignee"}
          onOpenChange={handleOpenChange("assignee")}
        />

        <KycFilterDropdown
          label="Type"
          options={bankAnalysisBatchTypeFilterOptions}
          value={filters.type}
          onChange={(value) => updateFilter("type", value)}
          open={openFilter === "type"}
          onOpenChange={handleOpenChange("type")}
        />

        <KycFilterDropdown
          label="More filters"
          icon={<Filter className="h-4 w-4" />}
          options={bankAnalysisBatchMoreFilterOptions}
          value={filters.more}
          onChange={(value) => updateFilter("more", value)}
          open={openFilter === "more"}
          onOpenChange={handleOpenChange("more")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[color:var(--border-default)] px-3 py-2 lg:flex-none">
          <Search className="h-4 w-4 text-[color:var(--text-light)]" />
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--text-light)]"
          />
        </div>

        <button
          type="button"
          className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}

export { bankAnalysisBatchDefaultFilters };