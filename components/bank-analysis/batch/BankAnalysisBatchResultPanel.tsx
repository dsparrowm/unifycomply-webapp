"use client";

import { useMemo, useState } from "react";
import { BankAnalysisMetricCards } from "@/components/bank-analysis/BankAnalysisMetricCards";
import { BankAnalysisBatchFilterBar } from "@/components/bank-analysis/batch/BankAnalysisBatchFilters";
import { BankAnalysisBatchResultHeader } from "@/components/bank-analysis/batch/BankAnalysisBatchResultHeader";
import { BankAnalysisBatchResultTable } from "@/components/bank-analysis/batch/BankAnalysisBatchResultTable";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterBankAnalysisBatchEntities } from "@/lib/bank-analysis/filter-bank-analysis-batch-entities";
import { bankAnalysisBatchDefaultFilters } from "@/lib/data/bank-analysis-batch-filters";
import type { BankAnalysisBatchFilters, BankAnalysisBatchResult } from "@/types/bank-analysis";

const PAGE_SIZE = 10;

type BankAnalysisBatchResultPanelProps = {
  result: BankAnalysisBatchResult;
};

export function BankAnalysisBatchResultPanel({ result }: BankAnalysisBatchResultPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BankAnalysisBatchFilters>(
    bankAnalysisBatchDefaultFilters,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterBankAnalysisBatchEntities(result.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.runId,
        record.fullName,
        record.date,
        record.entityType,
        record.assignedTo ?? "Unassigned",
        record.status,
        String(record.accounts),
        String(record.alerts),
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
        ? "No entities match your search"
        : "No entities match your filters";

  return (
    <div className="flex flex-col gap-6">
      <BankAnalysisBatchResultHeader lookupSlug={result.lookupSlug} />
      <BankAnalysisMetricCards metrics={result.metrics} />
      <div className="flex flex-col gap-4">
        <BankAnalysisBatchFilterBar
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
        <BankAnalysisBatchResultTable records={paginatedRecords} emptyMessage={emptyMessage} />
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