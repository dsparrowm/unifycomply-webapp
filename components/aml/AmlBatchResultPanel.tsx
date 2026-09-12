"use client";

import { useMemo, useState } from "react";
import { AmlBatchResultHeader } from "@/components/aml/AmlBatchResultHeader";
import { AmlBatchResultTable } from "@/components/aml/AmlBatchResultTable";
import { AmlFilters, amlDefaultFilters } from "@/components/aml/AmlFilters";
import { AmlMetricCards } from "@/components/aml/AmlMetricCards";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterAmlBatchEntities } from "@/lib/aml/filter-aml-batch-entities";
import { amlBatchCountryLabels } from "@/lib/data/aml-batch-results";
import type { AmlBatchResult, AmlListFilters } from "@/types/aml";

const PAGE_SIZE = 10;

type AmlBatchResultPanelProps = {
  result: AmlBatchResult;
};

export function AmlBatchResultPanel({ result }: AmlBatchResultPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AmlListFilters>(amlDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterAmlBatchEntities(result.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.amlId,
        record.customerName,
        record.entityType,
        record.country,
        amlBatchCountryLabels[record.country],
        record.status,
        record.assignedTo ?? "Unassigned",
        record.monitoringActive ? "Yes" : "No",
        String(record.riskScore),
        record.matches === 0 ? "0" : `${record.matches} Matches`,
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
        ? "No entities match your search"
        : "No entities match your filters";

  return (
    <div className="flex flex-col gap-6">
      <AmlBatchResultHeader lookupSlug={result.lookupSlug} />
      <AmlMetricCards metrics={result.metrics} />
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
        <AmlBatchResultTable records={paginatedRecords} emptyMessage={emptyMessage} />
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
