"use client";

import { useState } from "react";
import { Calendar, Filter, Search } from "lucide-react";
import { KycFilterDropdown } from "@/components/kyc/KycFilterDropdown";
import {
  kybDateFilterOptions,
  kybDefaultFilters,
  kybMoreFilterOptions,
  kybPriorityFilterOptions,
  kybSearchModeFilterOptions,
  kybStatusFilterOptions,
} from "@/lib/data/kyb-filters";
import type { KybListFilters } from "@/types/kyb";

type KybFilterKey = "date" | "status" | "priority" | "searchMode" | "more";

type KybFiltersProps = {
  filters: KybListFilters;
  onFiltersChange: (filters: KybListFilters) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export function KybFilters({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
}: KybFiltersProps) {
  const [openFilter, setOpenFilter] = useState<KybFilterKey | null>(null);

  const updateFilter = <K extends keyof KybListFilters>(key: K, value: KybListFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleOpenChange = (key: KybFilterKey) => (open: boolean) => {
    setOpenFilter(open ? key : null);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <KycFilterDropdown
          label="Date"
          icon={<Calendar className="h-4 w-4" />}
          options={kybDateFilterOptions}
          value={filters.date}
          onChange={(value) => updateFilter("date", value)}
          open={openFilter === "date"}
          onOpenChange={handleOpenChange("date")}
        />

        <KycFilterDropdown
          label="Status"
          options={kybStatusFilterOptions}
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          open={openFilter === "status"}
          onOpenChange={handleOpenChange("status")}
        />

        <KycFilterDropdown
          label="Priorities"
          options={kybPriorityFilterOptions}
          value={filters.priority}
          onChange={(value) => updateFilter("priority", value)}
          open={openFilter === "priority"}
          onOpenChange={handleOpenChange("priority")}
        />

        <KycFilterDropdown
          label="Single entity"
          options={kybSearchModeFilterOptions}
          value={filters.searchMode}
          onChange={(value) => updateFilter("searchMode", value)}
          open={openFilter === "searchMode"}
          onOpenChange={handleOpenChange("searchMode")}
        />

        <KycFilterDropdown
          label="More filters"
          icon={<Filter className="h-4 w-4" />}
          options={kybMoreFilterOptions}
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

export { kybDefaultFilters };
