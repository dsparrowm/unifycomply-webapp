"use client";

import { useMemo, useState } from "react";
import { KybBatchTable } from "@/components/kyb/KybBatchTable";
import { KybChooseActionModal } from "@/components/kyb/KybChooseActionModal";
import { KybFilters, kybDefaultFilters } from "@/components/kyb/KybFilters";
import { KybMetricCards } from "@/components/kyb/KybMetricCards";
import { KybPageHeader } from "@/components/kyb/KybPageHeader";
import { KybTable } from "@/components/kyb/KybTable";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterKybBatches, filterKybRecords } from "@/lib/kyb/filter-kyb-records";
import type { KybListData, KybListFilters } from "@/types/kyb";

const PAGE_SIZE = 10;

type KybListPanelProps = {
  data: KybListData;
  initialSearchMode?: KybListFilters["searchMode"];
};

export function KybListPanel({ data, initialSearchMode }: KybListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<KybListFilters>({
    ...kybDefaultFilters,
    searchMode: initialSearchMode ?? kybDefaultFilters.searchMode,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const isBulkSearch = filters.searchMode === "bulk-search";

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterKybRecords(data.records, filters);

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
  }, [data.records, filters, searchQuery]);

  const filteredBatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const batches = filterKybBatches(data.batches, filters);

    if (!query) {
      return batches;
    }

    return batches.filter((batch) =>
      [
        batch.batchId,
        batch.fileName,
        batch.createdBy,
        batch.assignedTo ?? "Unassigned",
        batch.country,
        batch.status,
        String(batch.total),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.batches, filters, searchQuery]);

  const visibleItems = isBulkSearch ? filteredBatches : filteredRecords;
  const sourceCount = isBulkSearch ? data.batches.length : data.records.length;
  const totalPages = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE));

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRecords]);

  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBatches.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredBatches]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (nextFilters: KybListFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const emptyMessage =
    sourceCount === 0
      ? "No User Activity"
      : searchQuery.trim()
        ? isBulkSearch
          ? "No batches match your search"
          : "No businesses match your search"
        : isBulkSearch
          ? "No batches match your filters"
          : "No businesses match your filters";

  return (
    <div className="flex flex-col gap-8">
      <KybPageHeader onAddBusiness={() => setActionModalOpen(true)} />
      <KybChooseActionModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />

      <KybMetricCards metrics={data.metrics} />

      <div className="flex flex-col gap-4">
        <KybFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        {isBulkSearch ? (
          <KybBatchTable batches={paginatedBatches} emptyMessage={emptyMessage} />
        ) : (
          <KybTable records={paginatedRecords} emptyMessage={emptyMessage} />
        )}
        {visibleItems.length > 0 ? (
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
