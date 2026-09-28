"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowDownWideNarrow,
  MoreVertical,
  Zap,
} from "lucide-react";
import { AdoptTemplateModal } from "@/components/transaction-monitoring/AdoptTemplateModal";
import { KycPagination } from "@/components/kyc/KycPagination";
import type { TmRuleRecord, TmRuleSeverity } from "@/types/tm-rules";
import type { TmRuleTemplate } from "@/types/tm-rule-templates";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const severityStyles: Record<TmRuleSeverity, string> = {
  critical: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  high: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  medium: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  low: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
};

const severityLabels: Record<TmRuleSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

type TransactionRulesListPanelProps = {
  rules: TmRuleRecord[];
  templates?: TmRuleTemplate[];
  onTemplateAdopt?: (template: TmRuleTemplate) => void;
};

export function TransactionRulesListPanel({ rules, templates, onTemplateAdopt }: TransactionRulesListPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [templateOpen, setTemplateOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(rules.length / PAGE_SIZE));
  const paginatedRules = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rules.slice(start, start + PAGE_SIZE);
  }, [currentPage, rules]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
            Transaction Rules
          </h1>
          <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
            Manage transaction monitoring detection rules and thresholds
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/rules/new"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
            Create New Rule
          </Link>
          <button
            type="button"
            onClick={() => setTemplateOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-[color:var(--accent-primary-hover)] transition-colors hover:bg-[color:var(--accent-primary-soft)]"
          >
            <Zap className="h-4 w-4" />
            Adopt Template
          </button>
        </div>
      </div>

      <AdoptTemplateModal
        open={templateOpen}
        onClose={() => setTemplateOpen(false)}
        templates={templates}
        onConfirm={onTemplateAdopt}
      />

      <div className="overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[color:var(--border-default)] bg-[color:var(--bg-muted)]">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all rules"
                    className="rounded border-[color:var(--border-default)]"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                  <span className="inline-flex items-center gap-1">
                    Rule Name
                    <ArrowDownWideNarrow className="h-3.5 w-3.5" />
                  </span>
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                  Description
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                  Severity
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                  Triggers
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-[color:var(--text-muted)]">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedRules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]">
                        <Archive className="h-7 w-7" />
                      </div>
                      <p className="text-base font-semibold text-[color:var(--text-primary)]">
                        0 Rules set
                      </p>
                      <p className="text-sm text-[color:var(--text-muted)]">
                        No violation rules triggered
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="border-b border-[color:var(--border-subtle)] last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        aria-label={`Select ${rule.name}`}
                        className="rounded border-[color:var(--border-default)]"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/rules/${rule.id}`}
                        className="font-medium text-[color:var(--text-primary)] hover:text-[color:var(--accent-primary-hover)]"
                      >
                        {rule.name}
                      </Link>
                    </td>
                    <td className="max-w-md px-4 py-4">
                      <p className="text-[color:var(--text-primary)]">{rule.description}</p>
                      <p className="mt-1 text-xs text-[color:var(--text-muted)]">
                        {rule.conditionsLabel}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-xs font-semibold",
                          severityStyles[rule.severity],
                        )}
                      >
                        {severityLabels[rule.severity]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[color:var(--text-primary)]">
                      {rule.triggers}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md bg-[color:var(--state-success-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--state-success)]">
                        {rule.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="relative px-4 py-4">
                      <button
                        type="button"
                        aria-label={`Actions for ${rule.name}`}
                        aria-expanded={menuOpenId === rule.id}
                        onClick={() =>
                          setMenuOpenId((current) =>
                            current === rule.id ? null : rule.id,
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      {menuOpenId === rule.id ? (
                        <div
                          role="menu"
                          className="absolute right-4 top-12 z-20 w-40 overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-lg"
                        >
                          <Link
                            href={`/rules/${rule.id}`}
                            role="menuitem"
                            className="block px-3 py-2 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
                            onClick={() => setMenuOpenId(null)}
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            role="menuitem"
                            className="block w-full px-3 py-2 text-left text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
                            onClick={() => setMenuOpenId(null)}
                          >
                            Deactivate
                          </button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {rules.length > 0 ? (
        <KycPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : null}
    </div>
  );
}
