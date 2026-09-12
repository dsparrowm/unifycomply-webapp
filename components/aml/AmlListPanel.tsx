"use client";

import { useMemo, useState } from "react";
import { AmlChooseActionModal } from "@/components/aml/AmlChooseActionModal";
import { AmlFilters, amlDefaultFilters } from "@/components/aml/AmlFilters";
import { AmlMetricCards } from "@/components/aml/AmlMetricCards";
import { AmlPageHeader } from "@/components/aml/AmlPageHeader";
import { AmlTable } from "@/components/aml/AmlTable";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterAmlRecords } from "@/lib/aml/filter-aml-records";
import type { AmlListData, AmlListFilters } from "@/types/aml";

const PAGE_SIZE = 10;

type AmlListPanelProps = {
  data: AmlListData;
};

export function AmlListPanel({ data }: AmlListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AmlListFilters>(amlDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [chooseActionOpen, setChooseActionOpen] = useState(false);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterAmlRecords(data.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.amlId,
        record.customerName,
        record.customerSubtitle ?? "",
        record.date,
        record.type,
        record.initiatedBy,
        record.status,
        record.assignedTo ?? "Unassigned",
        record.monitoringActive ? "Yes" : "No",
        String(record.riskScore),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.records, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRecords.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRecords]);

  const emptyMessage =
    data.records.length === 0
      ? "No User Activity"
      : searchQuery.trim()
        ? "No screenings match your search"
        : "No screenings match your filters";

  return (
    <div className="flex flex-col gap-6">
      <AmlPageHeader onCreateCase={() => setChooseActionOpen(true)} />
      <AmlMetricCards metrics={data.metrics} />
      <div className="flex flex-col gap-4">
        <AmlFilters
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
        />
        <AmlTable records={paginatedRecords} emptyMessage={emptyMessage} />
        {filteredRecords.length > 0 ? (
          <KycPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        ) : null}
      </div>
      <AmlChooseActionModal open={chooseActionOpen} onClose={() => setChooseActionOpen(false)} />
    </div>
  );
}
