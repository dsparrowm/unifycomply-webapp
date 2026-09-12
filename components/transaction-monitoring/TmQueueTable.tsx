import Link from "next/link";
import { ArrowDownWideNarrow, Clock3, Eye } from "lucide-react";
import {
  TmRiskScoreBar,
  TmStatusText,
} from "@/components/transaction-monitoring/TmBadges";
import type {
  TmEntityType,
  TmQueueColumn,
  TmTransactionRecord,
} from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";

const columnLabels: Record<TmQueueColumn, string> = {
  timestamp: "Timestamp",
  customer: "Customer",
  entity: "Entity",
  amount: "Amount",
  riskScore: "Risk Score",
  rules: "Rules Trigger",
  status: "Status",
  severity: "Severity",
};

function EntityBadge({ entityType }: { entityType: TmEntityType }) {
  return (
    <span className="inline-flex items-center rounded-md bg-[color:var(--accent-primary-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--accent-primary-hover)]">
      {entityType === "organization" ? "Organization" : "Individual"}
    </span>
  );
}

function SeverityText({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  return (
    <span
      className={cn(
        "text-sm font-medium",
        normalized === "high" && "text-[color:var(--state-error)]",
        normalized === "medium" && "text-[color:var(--state-warning)]",
        normalized === "low" && "text-[color:var(--state-success)]",
      )}
    >
      {label}
    </span>
  );
}

type TmQueueTableProps = {
  records: TmTransactionRecord[];
  columns: TmQueueColumn[];
  emptyMessage?: string;
  timestampHeader?: string;
};

export function TmQueueTable({
  records,
  columns,
  emptyMessage = "No User Activity",
  timestampHeader = "Timestamp",
}: TmQueueTableProps) {
  const labels = columns.map((column) =>
    column === "timestamp" ? timestampHeader : columnLabels[column],
  );

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
                  Transaction ID
                  <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                </span>
              </th>
              {labels.map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 3} className="px-4 py-24 text-center">
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[color:var(--border-default)] last:border-b-0"
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
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-4">
                      <QueueCell record={record} column={column} />
                    </td>
                  ))}
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

function QueueCell({
  record,
  column,
}: {
  record: TmTransactionRecord;
  column: TmQueueColumn;
}) {
  switch (column) {
    case "timestamp":
      return (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-[color:var(--text-primary)]">
            {record.relativeTime}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)]">
            <Clock3 className="h-3 w-3" />
            {record.absoluteTime}
          </span>
        </div>
      );
    case "customer":
      return <span className="text-[color:var(--text-primary)]">{record.customerName}</span>;
    case "entity":
      return <EntityBadge entityType={record.entityType} />;
    case "amount":
      return (
        <span className="font-medium text-[color:var(--text-primary)]">
          {record.amountLabel}
        </span>
      );
    case "riskScore":
      return <TmRiskScoreBar score={record.riskScore} />;
    case "rules":
      return <span className="text-[color:var(--text-primary)]">{record.rulesTriggered}</span>;
    case "status":
      return <TmStatusText status={record.status} />;
    case "severity":
      return <SeverityText label={record.severityLabel} />;
    default:
      return null;
  }
}
