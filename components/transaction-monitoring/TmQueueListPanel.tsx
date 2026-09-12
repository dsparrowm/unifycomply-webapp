"use client";

import { useMemo, useState } from "react";
import { KycPagination } from "@/components/kyc/KycPagination";
import { TransactionsMetricCards } from "@/components/transaction-monitoring/TransactionsMetricCards";
import {
  TmQueueFiltersBar,
  tmDefaultQueueFilters,
} from "@/components/transaction-monitoring/TmQueueFiltersBar";
import { TmQueueTable } from "@/components/transaction-monitoring/TmQueueTable";
import { filterQueueRecords } from "@/lib/transactions/filter-queue-records";
import type { TmQueueFilters, TmQueueListData } from "@/types/transaction-monitoring";

const PAGE_SIZE = 10;

type TmQueueListPanelProps = {
  data: TmQueueListData;
};

export function TmQueueListPanel({ data }: TmQueueListPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TmQueueFilters>(tmDefaultQueueFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const records = filterQueueRecords(data.records, filters);

    if (!query) {
      return records;
    }

    return records.filter((record) =>
      [
        record.transactionId,
        record.customerName,
        record.amountLabel,
        record.status,
        record.entityType,
        record.severityLabel,
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
      : filteredRecords.length === 0
        ? "No transactions match your filters"
        : "No transactions match your search";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
          {data.title}
        </h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">{data.subtitle}</p>
      </div>

      <TransactionsMetricCards metrics={data.metrics} />

      <div className="flex flex-col gap-4">
        <TmQueueFiltersBar
          filters={filters}
          onFiltersChange={(next) => {
            setFilters(next);
            setCurrentPage(1);
          }}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          showStatusFilter={data.showStatusFilter}
        />
        <TmQueueTable
          records={paginatedRecords}
          columns={data.columns}
          emptyMessage={emptyMessage}
          timestampHeader={
            data.queueId === "cumulative-frequency" ? "Time" : "Timestamp"
          }
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
