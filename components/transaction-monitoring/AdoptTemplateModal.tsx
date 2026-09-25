"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  Coins,
  CreditCard,
  Search,
  Send,
  Shield,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { tmRuleTemplateCatalog } from "@/lib/data/tm-rule-templates";
import type {
  TmRuleTemplate,
  TmTemplateRule,
  TmTemplateRuleAction,
} from "@/types/tm-rule-templates";
import type { TmRuleSeverity } from "@/types/tm-rules";
import { cn } from "@/lib/utils";

const packageIcons: Record<string, LucideIcon> = {
  "tpl-fintech": CreditCard,
  "tpl-banking": Building2,
  "tpl-ecommerce": ShoppingCart,
  "tpl-crypto": Coins,
  "tpl-remittance": Send,
  "tpl-insurance": Shield,
};

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

const actionStyles: Record<TmTemplateRuleAction, string> = {
  autoblock: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  "stop-payment": "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  "cumulative-frequency":
    "bg-[color:var(--state-purple-soft)] text-[color:var(--state-purple)]",
};

const actionLabels: Record<TmTemplateRuleAction, string> = {
  autoblock: "Autoblock",
  "stop-payment": "Stop Payment",
  "cumulative-frequency": "Cumulative Frequency",
};

type AdoptTemplateModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm?: (template: TmRuleTemplate) => void;
  templates?: TmRuleTemplate[];
};

export function AdoptTemplateModal({
  open,
  onClose,
  onConfirm,
  templates,
}: AdoptTemplateModalProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedId(null);
      setDetailId(null);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (detailId) {
          setDetailId(null);
          return;
        }
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [detailId, onClose, open]);

  const filteredPackages = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return tmRuleTemplateCatalog.packages;
    }

    return (templates ?? tmRuleTemplateCatalog.packages).filter((item) =>
      [item.name, item.industryLabel, item.description].some((value) =>
        value.toLowerCase().includes(needle),
      ),
    );
  }, [query]);

  if (!open) {
    return null;
  }

  const packages = templates ?? tmRuleTemplateCatalog.packages;
  const detailPackage = packages.find(
    (item) => item.id === detailId,
  );
  const selectedPackage = packages.find(
    (item) => item.id === selectedId,
  );

  const handleConfirm = (template: TmRuleTemplate) => {
    onConfirm?.(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close template dialog"
        className="absolute inset-0 bg-[color:var(--text-primary)]/25"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adopt-template-title"
        className="relative flex max-h-[92vh] w-full max-w-[880px] flex-col overflow-hidden rounded-2xl bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-start justify-between px-8 pb-2 pt-6">
          <div>
            <h2
              id="adopt-template-title"
              className="text-xl font-semibold text-[color:var(--text-primary)]"
            >
              TM Rules Template
            </h2>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              Select and industry that best describe your business
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-4">
          {detailPackage ? (
            <TemplateDetailView template={detailPackage} />
          ) : (
            <TemplateCatalogView
              query={query}
              onQueryChange={setQuery}
              packages={filteredPackages}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onViewDetails={setDetailId}
            />
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-8 py-5">
          <button
            type="button"
            onClick={detailPackage ? () => setDetailId(null) : onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          {detailPackage ? (
            <button
              type="button"
              onClick={() => {
                setSelectedId(detailPackage.id);
                setDetailId(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)]"
            >
              Select Package
            </button>
          ) : (
            <button
              type="button"
              disabled={!selectedPackage}
              onClick={() => selectedPackage && handleConfirm(selectedPackage)}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm Template
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateCatalogView({
  query,
  onQueryChange,
  packages,
  selectedId,
  onSelect,
  onViewDetails,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  packages: TmRuleTemplate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onViewDetails: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-[color:var(--network-secondary)]/40 bg-[color:var(--accent-primary-subtle)] px-5 py-4">
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--accent-primary-hover)]">
          <Sparkles className="h-4 w-4" />
          Industry Template
        </p>
        <p className="mt-2 text-base font-semibold text-[color:var(--text-primary)]">
          Select your Industry Package
        </p>
        <p className="mt-1 text-sm leading-6 text-[color:var(--text-muted)]">
          Choose a professionally crafted rule package designed specifically for
          your industry. Each package includes multiple detection rules optimized
          for common fraud patterns.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--text-light)]" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by industry, name or features"
          aria-label="Search templates"
          className="h-11 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] py-2 pl-10 pr-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary)]"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Total Package"
          value={String(tmRuleTemplateCatalog.totalPackages).padStart(2, "0")}
        />
        <MetricCard
          label="Industries"
          value={String(tmRuleTemplateCatalog.industries).padStart(2, "0")}
        />
        <MetricCard
          label="Total Rules"
          value={String(tmRuleTemplateCatalog.totalRules).padStart(2, "0")}
        />
      </div>

      <div className="flex flex-col gap-3">
        {packages.map((item) => {
          const Icon = packageIcons[item.id] ?? CreditCard;
          const selected = selectedId === item.id;

          return (
            <div
              key={item.id}
              className={cn(
                "w-full rounded-xl border px-5 py-4 transition-colors",
                selected
                  ? "border-[color:var(--network-secondary)] bg-[color:var(--accent-primary-subtle)]"
                  : "border-[color:var(--border-default)] bg-[color:var(--bg-surface)]",
              )}
            >
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[color:var(--text-primary)]">
                        {item.name}
                      </p>
                      {item.popular ? <PopularBadge /> : null}
                    </div>
                    <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                      {item.description}
                    </p>
                    <PackageMeta template={item} />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => onViewDetails(item.id)}
                  className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[color:var(--text-primary)] hover:text-[color:var(--accent-primary-hover)]"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TemplateDetailView({ template }: { template: TmRuleTemplate }) {
  const Icon = packageIcons[template.id] ?? CreditCard;

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-[color:var(--network-secondary)]/50 bg-[color:var(--accent-primary-subtle)] px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary)] text-white">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[color:var(--text-primary)]">
              {template.name}
            </p>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              {template.description}
            </p>
            <PackageMeta template={template} />
          </div>
          {template.popular ? <PopularBadge /> : null}
        </div>
      </div>

      <div className="rounded-xl bg-[color:var(--sandbox-bg)] px-5 py-3.5">
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--sandbox-text)]">
          <Sparkles className="h-4 w-4" />
          Key Features
        </p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[color:var(--sandbox-text)]">
          {template.features.map((feature) => (
            <span key={feature} className="inline-flex items-center gap-1.5">
              <span aria-hidden>✓</span>
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-base font-semibold text-[color:var(--text-primary)]">
          Detection Rules
        </p>
        <p className="mt-1 text-sm text-[color:var(--text-muted)]">
          {template.rulesBlurb}
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {template.rules.map((rule, index) => (
            <TemplateRuleRow key={rule.id} rule={rule} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateRuleRow({
  rule,
  index,
}: {
  rule: TmTemplateRule;
  index: number;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[color:var(--bg-muted)] text-xs font-semibold text-[color:var(--text-primary)]">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-medium text-[color:var(--text-primary)]">{rule.name}</p>
            <div className="flex flex-wrap gap-1.5">
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                  severityStyles[rule.severity],
                )}
              >
                {severityLabels[rule.severity]}
              </span>
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                  actionStyles[rule.action],
                )}
              >
                {actionLabels[rule.action]}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            {rule.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[color:var(--text-muted)]">
            <span>{rule.priorityLabel}</span>
            <span>{rule.conditionsLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PackageMeta({ template }: { template: TmRuleTemplate }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--text-muted)]">
      <span className="inline-flex rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-1 font-medium text-[color:var(--state-success)]">
        {template.industryLabel}
      </span>
      <span>{template.rulesCount} Rules</span>
      <span>{template.screeningLabel}</span>
    </div>
  );
}

function PopularBadge() {
  return (
    <span className="inline-flex rounded-full bg-[color:var(--state-success-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--state-success)]">
      Popular
    </span>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}
