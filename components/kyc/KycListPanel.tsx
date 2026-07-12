"use client";

import { useMemo, useState } from "react";
import { KycChooseActionModal } from "@/components/kyc/KycChooseActionModal";
import { KycFilters, kycDefaultFilters } from "@/components/kyc/KycFilters";
import { KycMetricCards } from "@/components/kyc/KycMetricCards";
import { KycPageHeader } from "@/components/kyc/KycPageHeader";
import { KycPagination } from "@/components/kyc/KycPagination";
import { KycTable } from "@/components/kyc/KycTable";
import { filterKycRecords } from "@/lib/kyc/filter-kyc-records";
import type { KycListData, KycListFilters } from "@/types/kyc";

const PAGE_SIZE = 10;

type KycListPanelProps = {
  data: KycListData;
};

export function KycListPanel({ data }: KycListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<KycListFilters>(kycDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterKycRecords(data.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.kycId,
        record.customerName,
        record.documentType,
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

  const handleFiltersChange = (nextFilters: KycListFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const emptyMessage =
    data.records.length === 0
      ? "No User Activity"
      : filteredRecords.length === 0
        ? "No customers match your filters"
        : "No customers match your search";

  return (
    <div className="flex flex-col gap-8">
      <KycPageHeader onAddCustomer={() => setActionModalOpen(true)} />
      <KycChooseActionModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />

      <KycMetricCards metrics={data.metrics} />

      <div className="flex flex-col gap-4">
        <KycFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <KycTable records={paginatedRecords} emptyMessage={emptyMessage} />
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
