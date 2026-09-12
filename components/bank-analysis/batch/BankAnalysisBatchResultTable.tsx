import Link from "next/link";
import { Eye } from "lucide-react";
import {
  BankAnalysisBatchEntityTypeBadge,
  BankAnalysisBatchStatusBadge,
} from "@/components/bank-analysis/BankAnalysisBatchBadges";
import { KycAssignedToCell } from "@/components/kyc/KycAssignedToCell";
import type { BankAnalysisBatchEntity } from "@/types/bank-analysis";

const columns = [
  "Run ID",
  "Full Name",
  "Date",
  "Type",
  "Accounts",
  "Assigned To",
  "Alerts",
  "Risk Score",
  "Status",
] as const;

type BankAnalysisBatchResultTableProps = {
  records: BankAnalysisBatchEntity[];
  emptyMessage?: string;
};

export function BankAnalysisBatchResultTable({
  records,
  emptyMessage = "No User Activity",
}: BankAnalysisBatchResultTableProps) {
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
                  key={column}
                  className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
              <th className="px-4 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-24 text-center">
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
                      aria-label={`Select ${record.fullName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.runId}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{record.fullName}</td>
                  <td className="px-4 py-4 text-[color:var(--text-muted)]">{record.date}</td>
                  <td className="px-4 py-4">
                    <BankAnalysisBatchEntityTypeBadge entityType={record.entityType} />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{record.accounts}</td>
                  <td className="px-4 py-4">
                    <KycAssignedToCell
                      assignedTo={record.assignedTo}
                      customerName={record.fullName}
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.alerts}
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.riskScore}
                  </td>
                  <td className="px-4 py-4">
                    <BankAnalysisBatchStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={
                        record.riskScore >= 3
                          ? "/bank-analysis/ba-run-1?view=high-risk"
                          : "/bank-analysis/ba-run-1"
                      }
                      aria-label={`View ${record.fullName}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
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