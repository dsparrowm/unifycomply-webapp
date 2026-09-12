"use client";

import { useMemo, useState } from "react";
import { KycPagination } from "@/components/kyc/KycPagination";
import { TransactionsFilters } from "@/components/transaction-monitoring/TransactionsFilters";
import { TransactionsMetricCards } from "@/components/transaction-monitoring/TransactionsMetricCards";
import { TransactionsTable } from "@/components/transaction-monitoring/TransactionsTable";
import { tmDefaultFilters } from "@/lib/data/transaction-filters";
import { filterTransactionRecords } from "@/lib/transactions/filter-transactions";
import type {
  TmListFilters,
  TmTransactionsListData,
} from "@/types/transaction-monitoring";

const PAGE_SIZE = 10;

type TransactionsListPanelProps = {
  data: TmTransactionsListData;
};

export function TransactionsListPanel({ data }: TransactionsListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TmListFilters>(tmDefaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterTransactionRecords(data.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.transactionId,
        record.customerName,
        record.amountLabel,
        record.status,
        record.category,
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

  const handleFiltersChange = (nextFilters: TmListFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const emptyMessage =
    data.records.length === 0
      ? "No User Activity"
      : filteredRecords.length === 0
        ? "No transactions match your filters"
        : "No transactions match your search";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
          Real-time Monitoring
        </h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
          Real-time fraud detection and risk analysis dashboard
        </p>
      </div>

      <TransactionsMetricCards metrics={data.metrics} />

      <div className="flex flex-col gap-4">
        <TransactionsFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <TransactionsTable records={paginatedRecords} emptyMessage={emptyMessage} />
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
