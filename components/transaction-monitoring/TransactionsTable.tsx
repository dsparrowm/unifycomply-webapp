import Link from "next/link";
import { ArrowDownWideNarrow, Clock3, Eye } from "lucide-react";
import {
  TmCategoryBadge,
  TmRiskScoreBar,
  TmStatusText,
} from "@/components/transaction-monitoring/TmBadges";
import type { TmTransactionRecord } from "@/types/transaction-monitoring";

const columns = [
  "Transaction ID",
  "Timestamp",
  "Customer",
  "Amount",
  "TM Category",
  "Risk Score",
  "Rules Trigger",
  "Status",
  "",
] as const;

type TransactionsTableProps = {
  records: TmTransactionRecord[];
  emptyMessage?: string;
};

export function TransactionsTable({
  records,
  emptyMessage = "No User Activity",
}: TransactionsTableProps) {
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
              {columns.map((column) => (
                <th
                  key={column || "actions"}
                  className="whitespace-nowrap px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {column === "Transaction ID" ? (
                    <span className="inline-flex items-center gap-1">
                      {column}
                      <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    column
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-24 text-center">
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${record.transactionId}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    <Link
                      href={`/transactions/${record.id}`}
                      className="hover:text-[color:var(--accent-primary-hover)]"
                    >
                      {record.transactionId}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-[color:var(--text-primary)]">
                        {record.relativeTime}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)]">
                        <Clock3 className="h-3 w-3" />
                        {record.absoluteTime}
                      </span>
                    </div>
                  </td>
                  <td className="max-w-[200px] px-4 py-4 text-[color:var(--text-primary)]">
                    <span className="block truncate" title={record.customerName}>
                      {record.customerName}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.amountLabel}
                  </td>
                  <td className="px-4 py-4">
                    <TmCategoryBadge category={record.category} />
                  </td>
                  <td className="px-4 py-4">
                    <TmRiskScoreBar score={record.riskScore} />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {record.rulesTriggered}
                  </td>
                  <td className="px-4 py-4">
                    <TmStatusText status={record.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/transactions/${record.id}`}
                      aria-label={`View ${record.transactionId}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--accent-primary-hover)]"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
