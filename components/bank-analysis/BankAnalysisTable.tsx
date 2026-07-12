import type { BankAnalysisRun } from "@/types/bank-analysis";
import {
  BankAnalysisPriorityBadge,
  BankAnalysisStatusBadge,
} from "@/components/bank-analysis/BankAnalysisStatusBadge";

const columns = [
  "Analysis ID",
  "Entity Name",
  "Account Number",
  "Bank",
  "Country",
  "Status",
  "Alerts",
  "Risk Score",
  "Priority",
  "Date Run",
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
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-24 text-center">
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
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {run.analysisId}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{run.entityName}</td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">
                    {run.accountNumber}
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{run.bank}</td>
                  <td className="px-4 py-4 text-[color:var(--text-primary)]">{run.country}</td>
                  <td className="px-4 py-4">
                    <BankAnalysisStatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {run.alertsGenerated}
                  </td>
                  <td className="px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {run.riskScore}
                  </td>
                  <td className="px-4 py-4">
                    <BankAnalysisPriorityBadge priority={run.priority} />
                  </td>
                  <td className="px-4 py-4 text-[color:var(--text-muted)]">{run.dateRun}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
