"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Calendar,
  ChevronDown,
  FileText,
  Search,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { KycFilterDropdown } from "@/components/kyc/KycFilterDropdown";
import { KycPagination } from "@/components/kyc/KycPagination";
import {
  accountStatementDefaultFilters,
  filterAccountStatementLines,
} from "@/lib/data/account-statement";
import type {
  AccountStatementData,
  AccountStatementFilters,
  AccountStatementLine,
  AccountStatementTypeFilter,
} from "@/types/account-statement";
import type { TmFilterOption, TmListMetric } from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const dateOptions: TmFilterOption[] = [
  { value: "all-time", label: "All time" },
  { value: "today", label: "Today" },
  { value: "last-7-days", label: "Last 7 days" },
  { value: "this-month", label: "This month" },
  { value: "all", label: "Any date" },
];

const typeOptions: TmFilterOption<AccountStatementTypeFilter>[] = [
  { value: "all", label: "All types" },
  { value: "credit", label: "Credit" },
  { value: "debit", label: "Debit" },
  { value: "wire", label: "Wire" },
  { value: "ach", label: "ACH" },
];

const moreOptions: TmFilterOption[] = [
  { value: "all", label: "All" },
  { value: "high-value", label: "High value ($50k+)" },
];

const metricIcons: Record<string, LucideIcon> = {
  balance: BarChart3,
  credit: ArrowDownLeft,
  debit: ArrowUpRight,
  count: Activity,
  opened: Calendar,
  opening: Banknote,
};

const metricToneClass: Record<string, string> = {
  balance: "text-[color:var(--text-muted)] bg-[color:var(--bg-muted)]",
  credit: "text-[color:var(--state-success)] bg-[color:var(--state-success-soft)]",
  debit: "text-[color:var(--state-error)] bg-[color:var(--state-error-soft)]",
  count: "text-[color:var(--state-info)] bg-[color:var(--state-info-soft)]",
  opened: "text-[color:var(--state-info)] bg-[color:var(--state-info-soft)]",
  opening: "text-[color:var(--text-muted)] bg-[color:var(--bg-muted)]",
};

type AccountStatementPanelProps = {
  transactionId: string;
  data: AccountStatementData;
};

export function AccountStatementPanel({
  transactionId,
  data,
}: AccountStatementPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<AccountStatementFilters>(
    accountStatementDefaultFilters,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState<"date" | "type" | "more" | null>(
    null,
  );
  const [actionsOpen, setActionsOpen] = useState(false);

  const filteredLines = useMemo(
    () => filterAccountStatementLines(data.lines, filters, searchQuery),
    [data.lines, filters, searchQuery],
  );

  const totalPages = Math.max(1, Math.ceil(filteredLines.length / PAGE_SIZE));

  const paginatedLines = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLines.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredLines]);

  const emptyMessage =
    data.lines.length === 0
      ? "No User Activity"
      : filteredLines.length === 0
        ? "No transactions match your filters"
        : "No transactions match your search";

  const exportLabel = data.lines.length === 0 ? "Export Report" : "Export Statement";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href={`/transactions/${transactionId}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-col gap-4 border-b border-[color:var(--border-subtle)] pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
              Account Statement
            </h1>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
              Complete transaction history for {data.customerName}
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-expanded={actionsOpen}
              aria-haspopup="menu"
              onClick={() => setActionsOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
            >
              <FileText className="h-4 w-4" />
              Actions
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", actionsOpen && "rotate-180")}
              />
            </button>
            {actionsOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-[calc(100%+4px)] z-50 w-56 overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08)]"
              >
                {["Download PDF", "Download CSV", "Print Statement"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    role="menuitem"
                    onClick={() => setActionsOpen(false)}
                    className="flex w-full px-3.5 py-2.5 text-left text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <AccountStatementMetricCards metrics={data.metrics} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <KycFilterDropdown
              label={filters.date === "all-time" ? "All time" : "Date"}
              icon={<Calendar className="h-4 w-4" />}
              options={dateOptions}
              value={filters.date}
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  date: value as AccountStatementFilters["date"],
                }));
                setCurrentPage(1);
              }}
              open={openFilter === "date"}
              onOpenChange={(open) => setOpenFilter(open ? "date" : null)}
            />
            <KycFilterDropdown
              label="Types"
              options={typeOptions}
              value={filters.type}
              onChange={(value) => {
                setFilters((prev) => ({ ...prev, type: value }));
                setCurrentPage(1);
              }}
              open={openFilter === "type"}
              onOpenChange={(open) => setOpenFilter(open ? "type" : null)}
            />
            <KycFilterDropdown
              label="More filters"
              icon={<SlidersHorizontal className="h-4 w-4" />}
              options={moreOptions}
              value={filters.more}
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  more: value as AccountStatementFilters["more"],
                }));
                setCurrentPage(1);
              }}
              open={openFilter === "more"}
              onOpenChange={(open) => setOpenFilter(open ? "more" : null)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-light)]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                aria-label="Search"
                className="h-10 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary)]"
              />
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
            >
              {exportLabel}
            </button>
          </div>
        </div>

        <AccountStatementTable lines={paginatedLines} emptyMessage={emptyMessage} />

        {filteredLines.length > 0 ? (
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

function AccountStatementMetricCards({ metrics }: { metrics: TmListMetric[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metricIcons[metric.id] ?? BarChart3;
        const toneClass =
          metricToneClass[metric.id] ??
          "text-[color:var(--text-muted)] bg-[color:var(--bg-muted)]";

        return (
          <div
            key={metric.id}
            className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  toneClass,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                {metric.label}
              </p>
            </div>
            <p className="mt-4 text-2xl font-semibold text-[color:var(--text-primary)] xl:text-3xl">
              {metric.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function AccountStatementTable({
  lines,
  emptyMessage,
}: {
  lines: AccountStatementLine[];
  emptyMessage: string;
}) {
  const isEmpty = lines.length === 0;
  const showLedgerExtras = !isEmpty;

  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  className="rounded border-[color:var(--border-default)]"
                />
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                <span className="inline-flex items-center gap-1">
                  S/N
                  <span aria-hidden className="text-[color:var(--text-light)]">
                    ↓
                  </span>
                </span>
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                Timestamp
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                Description
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                Reference
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                Debit
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                Credit
              </th>
              <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                Balance
              </th>
              {showLedgerExtras ? (
                <>
                  <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                    <span className="sr-only">Action</span>
                  </th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-24 text-center text-sm font-medium text-[color:var(--text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              lines.map((line) => {
                const [datePart, timePart] = splitTimestamp(line.timestamp);

                return (
                  <tr
                    key={line.id}
                    className="border-b border-[color:var(--border-subtle)] last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${line.reference}`}
                        className="rounded border-[color:var(--border-default)]"
                      />
                    </td>
                    <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                      {line.serial}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <p className="font-medium text-[color:var(--text-primary)]">{datePart}</p>
                      {timePart ? (
                        <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">{timePart}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-[color:var(--text-primary)]">
                        {line.description}
                      </p>
                      <p className="mt-0.5 text-xs text-[color:var(--text-muted)]">
                        {line.channelLabel}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-primary)]">
                      {line.reference}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-4 font-medium",
                        line.debitLabel
                          ? "text-[color:var(--state-error)]"
                          : "text-[color:var(--text-light)]",
                      )}
                    >
                      {line.debitLabel ?? "-"}
                    </td>
                    <td
                      className={cn(
                        "whitespace-nowrap px-4 py-4 font-medium",
                        line.creditLabel
                          ? "text-[color:var(--state-success)]"
                          : "text-[color:var(--text-light)]",
                      )}
                    >
                      {line.creditLabel ?? "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-[color:var(--text-primary)]">
                      {line.balanceLabel}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md bg-[color:var(--state-success-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--state-success)]">
                        Completed
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        aria-label={`View ${line.reference}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function splitTimestamp(timestamp: string): [string, string | null] {
  const parts = timestamp.trim().split(/\s+/);
  if (parts.length < 2) {
    return [timestamp, null];
  }
  return [parts[0], parts.slice(1).join(" ")];
}
