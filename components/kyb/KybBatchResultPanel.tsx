"use client";

import { useMemo, useState } from "react";
import { KybBatchResultHeader } from "@/components/kyb/KybBatchResultHeader";
import { KybFilters, kybDefaultFilters } from "@/components/kyb/KybFilters";
import { KybTable } from "@/components/kyb/KybTable";
import { KybTotalBusinessCard } from "@/components/kyb/KybTotalBusinessCard";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterKybRecords } from "@/lib/kyb/filter-kyb-records";
import type { KybBatchResult, KybListFilters } from "@/types/kyb";

const PAGE_SIZE = 10;

type KybBatchResultPanelProps = {
  result: KybBatchResult;
};

export function KybBatchResultPanel({ result }: KybBatchResultPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<KybListFilters>({
    ...kybDefaultFilters,
    searchMode: "bulk-search",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterKybRecords(result.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.kybId,
        record.businessName,
        record.businessType,
        record.verificationType,
        record.country,
        record.status,
        record.priority,
        record.assignedTo ?? "Unassigned",
        String(record.riskScore),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [filters, result.records, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRecords]);

  const emptyMessage =
    result.records.length === 0
      ? "No User Activity"
      : searchQuery.trim()
        ? "No businesses match your search"
        : "No businesses match your filters";

  return (
    <div className="flex flex-col gap-8">
      <KybBatchResultHeader lookupSlug={result.lookupSlug} />
      <KybTotalBusinessCard total={result.batch.total} />
      <div className="flex flex-col gap-4">
        <KybFilters
          filters={filters}
          onFiltersChange={(nextFilters) => {
            setFilters(nextFilters);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          searchModeLabel="Batch search"
        />
        <KybTable
          records={paginatedRecords}
          emptyMessage={emptyMessage}
          showViewAction
        />
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
