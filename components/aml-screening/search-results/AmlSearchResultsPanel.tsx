"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AmlActiveMonitoringToggle } from "@/components/aml-screening/detail/AmlActiveMonitoringToggle";
import { AmlSearchResultsRail } from "@/components/aml-screening/search-results/AmlSearchResultsRail";
import { KycPagination } from "@/components/kyc/KycPagination";
import {
  amlSearchMatchStatusLabels,
  amlSearchMatchStatusOptions,
} from "@/lib/data/aml-search-results";
import { cn } from "@/lib/utils";
import type {
  AmlSearchMatchStatus,
  AmlSearchResultRecord,
  AmlSearchResultsData,
} from "@/types/aml-screening";

type AmlSearchResultsPanelProps = {
  data: AmlSearchResultsData;
};

export function AmlSearchResultsPanel({ data }: AmlSearchResultsPanelProps) {
  const [activeMonitoring, setActiveMonitoring] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [records, setRecords] = useState(data.records);
  const [pendingStatus, setPendingStatus] = useState<AmlSearchMatchStatus | "">("");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  const canSave = selectedIds.length > 0 && pendingStatus !== "";

  useEffect(() => {
    if (!statusMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!statusMenuRef.current?.contains(event.target as Node)) {
        setStatusMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStatusMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [statusMenuOpen]);

  const toggleSelected = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const handleSave = () => {
    if (selectedIds.length === 0 || pendingStatus === "") {
      return;
    }

    const nextStatus = pendingStatus;

    setRecords((current) =>
      current.map((record) =>
        selectedIds.includes(record.id) ? { ...record, matchStatus: nextStatus } : record,
      ),
    );
    setSelectedIds([]);
    setPendingStatus("");
    setStatusMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/aml-screening/create-case"
            className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Link>
          <p className="text-sm font-medium">
            <span className="text-[color:var(--text-muted)]">Search Result / </span>
            <span className="text-[color:var(--accent-primary-hover)]">
              {data.queryName.toUpperCase()}
            </span>
          </p>
        </div>
        <AmlActiveMonitoringToggle
          checked={activeMonitoring}
          onChange={setActiveMonitoring}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[color:var(--text-primary)]">
              No of Records : {data.recordCount}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <div ref={statusMenuRef} className="relative">
                <button
                  type="button"
                  aria-expanded={statusMenuOpen}
                  aria-haspopup="listbox"
                  onClick={() => setStatusMenuOpen((open) => !open)}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-sm text-[color:var(--text-primary)]",
                    statusMenuOpen &&
                      "border-[color:var(--accent-primary-hover)] ring-2 ring-[color:var(--accent-primary-soft)]",
                  )}
                >
                  {pendingStatus
                    ? amlSearchMatchStatusLabels[pendingStatus]
                    : "Change Match Status"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-[color:var(--text-muted)] transition-transform",
                      statusMenuOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>

                {statusMenuOpen ? (
                  <div
                    role="listbox"
                    aria-label="Change Match Status"
                    className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[220px] overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
                  >
                    {amlSearchMatchStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={pendingStatus === option.value}
                        onClick={() => {
                          setPendingStatus(option.value);
                          setStatusMenuOpen(false);
                        }}
                        className={cn(
                          "flex w-full px-3.5 py-2.5 text-left text-sm font-medium text-[color:var(--text-primary)]",
                          pendingStatus === option.value
                            ? "bg-[color:var(--accent-primary-soft)]"
                            : "hover:bg-[color:var(--bg-muted)]",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                disabled={!canSave}
                onClick={handleSave}
                className={cn(
                  "inline-flex h-10 items-center rounded-lg px-5 text-sm font-medium transition-colors",
                  canSave
                    ? "bg-[color:var(--accent-primary-hover)] text-white hover:bg-[color:var(--accent-primary)]"
                    : "cursor-not-allowed bg-[color:var(--bg-muted)] text-[color:var(--text-light)]",
                )}
              >
                Save
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {records.map((record) => (
              <AmlSearchResultCard
                key={record.id}
                record={record}
                selected={selectedIds.includes(record.id)}
                onSelectedChange={() => toggleSelected(record.id)}
              />
            ))}
          </div>
        </section>

        <AmlSearchResultsRail information={data.information} />
      </div>

      <KycPagination
        currentPage={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

function AmlSearchResultCard({
  record,
  selected,
  onSelectedChange,
}: {
  record: AmlSearchResultRecord;
  selected: boolean;
  onSelectedChange: () => void;
}) {
  return (
    <article className="rounded-xl border border-[color:var(--border-default)] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelectedChange}
          aria-label={`Select ${record.name}`}
          className="mt-1 h-4 w-4 shrink-0 rounded border-[color:var(--border-default)] accent-[color:var(--accent-primary-hover)]"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-[color:var(--state-success)]">
              Match Score: {record.matchScorePercent}% Match
            </span>
            <span className="inline-flex rounded-md bg-[color:var(--state-warning)] px-2.5 py-0.5 text-xs font-semibold text-white">
              Risk Score: {record.riskScore}
            </span>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <dl className="grid min-w-0 flex-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-[color:var(--text-primary)]">Name</dt>
                <dd className="mt-1">
                  <Link
                    href={`/aml-screening/${record.detailId}`}
                    className="text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--accent-primary-hover)]"
                  >
                    {record.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[color:var(--text-primary)]">
                  Relevance
                </dt>
                <dd className="mt-1 text-sm font-medium text-[color:var(--state-info)]">
                  {record.relevance}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[color:var(--text-primary)]">
                  Match Status
                </dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--state-warning)]">
                  <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {amlSearchMatchStatusLabels[record.matchStatus]}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[color:var(--text-primary)]">DOB</dt>
                <dd className="mt-1 text-sm text-[color:var(--text-muted)]">{record.dateOfBirth}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-[color:var(--text-primary)]">Database</dt>
                <dd className="mt-1">
                  <span className="inline-flex rounded-md bg-[color:var(--state-info-soft)] px-2 py-0.5 text-sm font-medium text-[color:var(--state-info)]">
                    {record.database}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[color:var(--bg-muted)] sm:h-20 sm:w-20">
              <span className="text-lg font-semibold text-[color:var(--accent-primary-hover)]">
                {record.avatarInitials}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
