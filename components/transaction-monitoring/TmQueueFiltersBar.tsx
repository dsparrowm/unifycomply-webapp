"use client";

import { useState } from "react";
import { Calendar, Search, SlidersHorizontal } from "lucide-react";
import { KycFilterDropdown } from "@/components/kyc/KycFilterDropdown";
import {
  tmDateFilterOptions,
  tmDefaultQueueFilters,
  tmEntityFilterOptions,
  tmMoreFilterOptions,
  tmStatusFilterOptions,
} from "@/lib/data/transaction-filters";
import type { TmQueueFilters } from "@/types/transaction-monitoring";

type FilterKey = "date" | "status" | "entity" | "more";

type TmQueueFiltersBarProps = {
  filters: TmQueueFilters;
  onFiltersChange: (filters: TmQueueFilters) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showStatusFilter?: boolean;
};

export function TmQueueFiltersBar({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  showStatusFilter = false,
}: TmQueueFiltersBarProps) {
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  const updateFilter = <K extends keyof TmQueueFilters>(
    key: K,
    value: TmQueueFilters[K],
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleOpenChange = (key: FilterKey) => (open: boolean) => {
    setOpenFilter(open ? key : null);
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <KycFilterDropdown
          label="Date"
          icon={<Calendar className="h-4 w-4" />}
          options={tmDateFilterOptions}
          value={filters.date}
          onChange={(value) => updateFilter("date", value)}
          open={openFilter === "date"}
          onOpenChange={handleOpenChange("date")}
        />
        {showStatusFilter ? (
          <KycFilterDropdown
            label="Status"
            options={tmStatusFilterOptions}
            value={filters.status}
            onChange={(value) => updateFilter("status", value)}
            open={openFilter === "status"}
            onOpenChange={handleOpenChange("status")}
          />
        ) : null}
        <KycFilterDropdown
          label="Entity"
          options={tmEntityFilterOptions}
          value={filters.entity}
          onChange={(value) => updateFilter("entity", value)}
          open={openFilter === "entity"}
          onOpenChange={handleOpenChange("entity")}
        />
        <KycFilterDropdown
          label="More filters"
          icon={<SlidersHorizontal className="h-4 w-4" />}
          options={tmMoreFilterOptions}
          value={filters.more}
          onChange={(value) => updateFilter("more", value)}
          open={openFilter === "more"}
          onOpenChange={handleOpenChange("more")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 lg:flex-none">
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
          className="rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}

export { tmDefaultQueueFilters };
