import { ArrowLeft, FileSpreadsheet, Plus } from "lucide-react";
import Link from "next/link";
import { AmlBatchStatusBadge } from "@/components/aml-screening/AmlStatusBadge";
import { KycMetricCards } from "@/components/kyc/KycMetricCards";
import type { AmlBatchResult } from "@/types/aml-screening";

type AmlScreeningBatchPanelProps = {
  result: AmlBatchResult;
};

export function AmlScreeningBatchPanel({ result }: AmlScreeningBatchPanelProps) {
  const metrics = [
    { id: "total", label: "Total Records", value: result.totalRecords, tone: "info" },
    { id: "successful", label: "Successful", value: result.successful, tone: "success" },
    { id: "review", label: "Needs Review", value: result.review, tone: "warning" },
    { id: "high-risk", label: "High Risk", value: result.highRisk, tone: "error" },
  ] as const;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/aml-screening"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--text-muted)] hover:text-[color:var(--accent-primary-hover)]"
          >
            <ArrowLeft className="h-4 w-4" />
            AML Screening
          </Link>
          <h1 className="mt-4 text-xl font-semibold text-[color:var(--text-primary)]">
            Batch Screening Result
          </h1>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Review successful, flagged, and high-risk screening records
          </p>
        </div>
        <Link
          href="/aml-screening/lookup?mode=batch"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
        >
          <Plus className="h-4 w-4" />
          New Batch
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary)]">
            <FileSpreadsheet className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium text-[color:var(--text-primary)]">{result.batchName}</p>
            <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">{result.fileName}</p>
          </div>
        </div>
        <div className="text-sm text-[color:var(--text-muted)] sm:text-right">
          <p>{result.id}</p>
          <p className="mt-0.5">{result.submittedAt}</p>
        </div>
      </div>

      <KycMetricCards metrics={[...metrics]} />

      <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
              <tr>
                {["Screening ID", "Entity", "Type", "Country", "Status", "Matches", "Risk Score"].map(
                  (column) => (
                    <th
                      key={column}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]"
                    >
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {result.records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-[color:var(--border-default)] last:border-0 hover:bg-[color:var(--bg-muted)]"
                >
                  <td className="whitespace-nowrap px-4 py-4 font-medium">
                    <Link
                      href={`/aml-screening/${record.id}`}
                      className="text-[color:var(--accent-primary-hover)] hover:underline"
                    >
                      {record.screeningId}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 font-medium text-[color:var(--text-primary)]">
                    {record.entityName}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 capitalize text-[color:var(--text-muted)]">
                    {record.entityType}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-[color:var(--text-muted)]">
                    {record.country}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <AmlBatchStatusBadge status={record.status} />
                  </td>
                  <td className="px-4 py-4 text-center text-[color:var(--text-primary)]">
                    {record.matches}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-[color:var(--text-primary)]">
                    {record.riskScore}/4
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
