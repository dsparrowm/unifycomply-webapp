"use client";

import { useMemo, useState } from "react";
import { BankAnalysisChooseActionModal } from "@/components/bank-analysis/BankAnalysisChooseActionModal";
import {
  BankAnalysisFilters,
  bankAnalysisDefaultFilters,
} from "@/components/bank-analysis/BankAnalysisFilters";
import { BankAnalysisMetricCards } from "@/components/bank-analysis/BankAnalysisMetricCards";
import { BankAnalysisPageHeader } from "@/components/bank-analysis/BankAnalysisPageHeader";
import { BankAnalysisTable } from "@/components/bank-analysis/BankAnalysisTable";
import { KycPagination } from "@/components/kyc/KycPagination";
import { filterBankAnalysisRuns } from "@/lib/bank-analysis/filter-bank-analysis-runs";
import type { BankAnalysisListData, BankAnalysisListFilters } from "@/types/bank-analysis";

const PAGE_SIZE = 10;

type BankAnalysisListPanelProps = {
  data: BankAnalysisListData;
};

export function BankAnalysisListPanel({ data }: BankAnalysisListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<BankAnalysisListFilters>(bankAnalysisDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const filteredRuns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const runs = filterBankAnalysisRuns(data.runs, filters);

    if (!query) {
      return runs;
    }

    return runs.filter((run) =>
      [
        run.analysisId,
        run.entityName,
        run.accountNumber,
        run.bank,
        run.country,
        run.status,
        run.priority,
        String(run.alertsGenerated),
        String(run.riskScore),
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.runs, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRuns.length / PAGE_SIZE));

  const paginatedRuns = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRuns.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredRuns]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFiltersChange = (nextFilters: BankAnalysisListFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const emptyMessage =
    data.runs.length === 0
      ? "No User Activity"
      : filteredRuns.length === 0
        ? "No analysis runs match your filters"
        : "No analysis runs match your search";

  return (
    <div className="flex flex-col gap-8">
      <BankAnalysisPageHeader onNewLookup={() => setActionModalOpen(true)} />
      <BankAnalysisChooseActionModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />

      <BankAnalysisMetricCards metrics={data.metrics} />

      <div className="flex flex-col gap-4">
        <BankAnalysisFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <BankAnalysisTable runs={paginatedRuns} emptyMessage={emptyMessage} />

        {filteredRuns.length > 0 ? (
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
