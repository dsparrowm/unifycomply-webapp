import Link from "next/link";
import { Eye } from "lucide-react";
import { BankAnalysisTypeBadge } from "@/components/bank-analysis/BankAnalysisBatchBadges";
import { BankAnalysisStatusBadge } from "@/components/bank-analysis/BankAnalysisStatusBadge";
import { KycAssignedToCell } from "@/components/kyc/KycAssignedToCell";
import { getBankAnalysisRunHref } from "@/lib/data/bank-analysis";
import type { BankAnalysisRun } from "@/types/bank-analysis";

const columns = [
  "Run ID",
  "Full Name",
  "Date",
  "Type",
  "Accounts",
  "Analyst",
  "Assigned To",
  "Alerts",
  "Risk Score",
  "Status",
] as const;

type BankAnalysisTableProps = {
  runs: BankAnalysisRun[];
  emptyMessage?: string;
};

export function BankAnalysisTable({
  runs,
  emptyMessage = "No User Activity",
}: BankAnalysisTableProps) {
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
            {runs.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-24 text-center">
                  <p className="text-2xl font-medium text-[color:var(--text-light)]">
                    {emptyMessage}
                  </p>
                </td>
              </tr>
            ) : (
              runs.map((run) => (
                <tr
                  key={run.id}
                  className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-surface)] last:border-b-0"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      aria-label={`Select ${run.fullName}`}
                      className="rounded border-[color:var(--border-default)]"
                    />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {run.runId}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{run.fullName}</td>
                  <td className="px-4 py-4 text-[color:var(--text-muted)]">{run.date}</td>
                  <td className="px-4 py-4">
                    <BankAnalysisTypeBadge type={run.type} />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{run.accounts}</td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{run.analyst}</td>
                  <td className="px-4 py-4">
                    <KycAssignedToCell assignedTo={run.assignedTo} customerName={run.fullName} />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {run.alerts}
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {run.riskScore}
                  </td>
                  <td className="px-4 py-4">
                    <BankAnalysisStatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={getBankAnalysisRunHref(run)}
                      aria-label={`View ${run.fullName}`}
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