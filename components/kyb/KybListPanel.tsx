"use client";

import { useMemo, useState } from "react";
import { KybChooseActionModal } from "@/components/kyb/KybChooseActionModal";
import { KybFilters, kybDefaultFilters } from "@/components/kyb/KybFilters";
import { KybMetricCards } from "@/components/kyb/KybMetricCards";
import { KybPageHeader } from "@/components/kyb/KybPageHeader";
import { KybTable } from "@/components/kyb/KybTable";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterKybRecords } from "@/lib/kyb/filter-kyb-records";
import type { KybListData, KybListFilters } from "@/types/kyb";

const PAGE_SIZE = 10;

type KybListPanelProps = {
  data: KybListData;
};

export function KybListPanel({ data }: KybListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<KybListFilters>(kybDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModalOpen, setActionModalOpen] = useState(false);

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
        record.country,
        record.status,
        record.priority,
        String(record.riskScore),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.records, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRecords]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (nextFilters: KybListFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const emptyMessage =
    data.records.length === 0
      ? "No User Activity"
      : filteredRecords.length === 0
        ? "No businesses match your filters"
        : "No businesses match your search";

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
        <KybTable records={paginatedRecords} emptyMessage={emptyMessage} />
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
