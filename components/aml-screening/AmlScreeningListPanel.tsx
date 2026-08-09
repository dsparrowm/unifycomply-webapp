"use client";

import { useMemo, useState } from "react";
import { AmlScreeningFilters } from "@/components/aml-screening/AmlScreeningFilters";
import { AmlScreeningPageHeader } from "@/components/aml-screening/AmlScreeningPageHeader";
import { AmlScreeningTable } from "@/components/aml-screening/AmlScreeningTable";
import { KycMetricCards } from "@/components/kyc/KycMetricCards";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterAmlRecords } from "@/lib/aml/filter-aml-records";
import { amlDefaultFilters } from "@/lib/data/aml-screening";
import type { AmlListFilters, AmlScreeningListData } from "@/types/aml-screening";

const PAGE_SIZE = 8;

type AmlScreeningListPanelProps = {
  data: AmlScreeningListData;
};

export function AmlScreeningListPanel({ data }: AmlScreeningListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AmlListFilters>(amlDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(
    () => filterAmlRecords(data.records, filters, searchQuery),
    [data.records, filters, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRecords]);

  const updateSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const updateFilters = (nextFilters: AmlListFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const emptyMessage =
    data.records.length === 0
      ? "No User Activity"
      : searchQuery.trim() || Object.values(filters).some((value) => value !== "all")
        ? "No screenings match your filters"
        : "No User Activity";

  return (
    <div className="flex flex-col gap-8">
      <AmlScreeningPageHeader />
      <KycMetricCards metrics={data.metrics} />
      <div className="flex flex-col gap-4">
        <AmlScreeningFilters
          filters={filters}
          onFiltersChange={updateFilters}
          searchQuery={searchQuery}
          onSearchChange={updateSearch}
        />
        <AmlScreeningTable records={paginatedRecords} emptyMessage={emptyMessage} />
        {filteredRecords.length > 0 ? (
          <KycPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        ) : null}
      </div>
    </div>
  );
}
