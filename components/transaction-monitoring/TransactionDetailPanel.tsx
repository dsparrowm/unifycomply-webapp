"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { EscalateCaseModal } from "@/components/transaction-monitoring/EscalateCaseModal";
import { ResolveCaseModal } from "@/components/transaction-monitoring/ResolveCaseModal";
import { PlacePndModal } from "@/components/transaction-monitoring/PlacePndModal";
import type { TmTransactionDetail, TmTxCategory } from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";
import { useTransactionActions, useTransactionCase } from "@/lib/hooks/use-transaction-monitoring";

type TransactionDetailPanelProps = {
  detail: TmTransactionDetail;
};

export function TransactionDetailPanel({ detail }: TransactionDetailPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"details" | "case">("details");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [pndOpen, setPndOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const caseQuery = useTransactionCase(detail.id, tab === "case");
  const actions = useTransactionActions(detail.id);

  const resolveCase = (payload: {
    resolutionType: string;
    outcomeSummary: string;
    actionsTaken: string[];
    notes: string;
  }) => {
    const resolutionTypeMap: Record<string, "cleared-no-issues" | "false-positive" | "escalated-to-authorities" | "resolved-after-contact" | "documentation-provided-cleared"> = {
      cleared: "cleared-no-issues",
      "false-positive": "false-positive",
      escalated: "escalated-to-authorities",
      "customer-contact": "resolved-after-contact",
      documentation: "documentation-provided-cleared",
    };
    const actionMap: Record<string, string> = {
      "Customer verification completed": "customer-verification-completed",
      "Source of funds verified": "source-of-funds-verified",
      "PEP screening cleared": "pep-screening-cleared",
      "Enhanced due diligence performed": "enhanced-due-diligence-performed",
      "Transaction pattern analyzed": "transaction-pattern-analyzed",
      "Adverse media check completed": "adverse-media-check-completed",
      "Business relationship reviewed": "business-relationship-reviewed",
      "Sanctions screening passed": "sanctions-screening-passed",
    };
    void actions.resolve.mutateAsync({
      resolutionType: resolutionTypeMap[payload.resolutionType] ?? "cleared-no-issues",
      outcomeSummary: payload.outcomeSummary,
      actionsTaken: payload.actionsTaken.map((action) => actionMap[action] ?? action),
      resolutionNotes: payload.notes,
    });
  };

  const handleAction = (label: string) => {
    setActionsOpen(false);
    if (label === "Resolve Case") {
      setResolveOpen(true);
    }
    if (label === "Place PND") {
      setPndOpen(true);
    }
    if (label === "Generate SAR Rationale") {
      router.push(`/transactions/${detail.id}/sar-rationale`);
    }
    if (label === "Escalate Case") {
      setEscalateOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <DetailHeader
        detail={detail}
        actionsOpen={actionsOpen}
        onActionsOpenChange={setActionsOpen}
        onAction={handleAction}
      />

      <ResolveCaseModal
        open={resolveOpen}
        transactionId={detail.transactionId}
        onClose={() => setResolveOpen(false)}
        onSubmit={resolveCase}
      />

      <PlacePndModal
        open={pndOpen}
        transactionId={detail.transactionId}
        customerName={detail.customerName}
        onClose={() => setPndOpen(false)}
        onSubmit={(payload) => void actions.placePnd.mutateAsync(payload)}
      />

      <EscalateCaseModal
        open={escalateOpen}
        transactionId={detail.transactionId}
        customerName={detail.customerName}
        onClose={() => setEscalateOpen(false)}
        onConfirm={(notes) => void actions.escalate.mutateAsync(notes)}
      />

      <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-[color:var(--bg-muted)] p-1">
        <TabButton active={tab === "details"} onClick={() => setTab("details")}>
          Transaction Details
        </TabButton>
        <TabButton active={tab === "case"} onClick={() => setTab("case")}>
          Case Management
        </TabButton>
      </div>

      {tab === "details" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-4">
            <AiRiskCard detail={detail} />
            <SummaryCard detail={detail} />
            <div className="grid gap-4 lg:grid-cols-2">
              <PartyCard title="Counterparty" party={detail.counterparty} />
              <CustomerCard
                party={detail.customer}
                accountActivityHref={`/transactions/${detail.id}/account-statement`}
              />
            </div>
            <RulesCard rules={detail.rules} />
            {detail.relatedTransactions.length > 0 ? (
              <RelatedCard
                items={detail.relatedTransactions}
                totalCount={detail.relatedTotalCount}
              />
            ) : null}
          </div>
          <div className="flex flex-col gap-4">
            <TimelineCard steps={detail.timeline} />
            <KeyValueCard title="Quick Stats" rows={detail.quickStats} />
            <KeyValueCard title="Full Metadata" rows={detail.metadata} grid />
          </div>
        </div>
      ) : (
        <CaseManagementPlaceholder data={caseQuery.data} isLoading={caseQuery.isLoading} />
      )}
    </div>
  );
}

function DetailHeader({
  detail,
  actionsOpen,
  onActionsOpenChange,
  onAction,
}: {
  detail: TmTransactionDetail;
  actionsOpen: boolean;
  onActionsOpenChange: (open: boolean) => void;
  onAction: (label: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/transactions"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
            Transaction Details
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[color:var(--text-muted)]">
              {detail.transactionId}
            </span>
            <span className="text-[color:var(--text-light)]">•</span>
            <span
              className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase",
                detail.direction === "incoming"
                  ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
                  : "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
              )}
            >
              {detail.direction}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-expanded={actionsOpen}
            aria-haspopup="menu"
            onClick={() => onActionsOpenChange(!actionsOpen)}
            className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
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
              <p className="px-3.5 py-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-light)]">
                Reporting Actions
              </p>
              {[
                "Resolve Case",
                "Place PND",
                "Generate SAR Rationale",
                "Escalate Case",
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  onClick={() => onAction(label)}
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
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[color:var(--bg-surface)] text-[color:var(--accent-primary-hover)] shadow-sm"
          : "text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
      )}
    >
      {children}
    </button>
  );
}

const cardClass =
  "rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm";

function SectionTitle({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">
      {Icon ? <Icon className="h-4 w-4 text-[color:var(--accent-primary-hover)]" /> : null}
      {children}
    </h2>
  );
}

function riskTheme(category: TmTxCategory, score: number) {
  if (category === "cumulative-frequency") {
    return {
      text: "text-[color:var(--state-purple)]",
      bar: "bg-[color:var(--state-purple)]",
      border: "border-[color:var(--state-purple)]/30",
      soft: "bg-[color:var(--state-purple-soft)]",
    };
  }
  if (category === "stop-payment" || (score >= 70 && score < 100)) {
    return {
      text: "text-[color:var(--state-warning)]",
      bar: "bg-[color:var(--state-warning)]",
      border: "border-[color:var(--state-warning)]/30",
      soft: "bg-[color:var(--state-warning-soft)]",
    };
  }
  if (category === "tm-blocked" || score >= 90) {
    return {
      text: "text-[color:var(--state-error)]",
      bar: "bg-[color:var(--state-error)]",
      border: "border-[color:var(--state-error)]/30",
      soft: "bg-[color:var(--state-error-soft)]",
    };
  }
  return {
    text: "text-[color:var(--state-success)]",
    bar: "bg-[color:var(--state-success)]",
    border: "border-[color:var(--state-success)]/30",
    soft: "bg-[color:var(--state-success-soft)]",
  };
}

function splitHeadline(headline: string) {
  const match = headline.match(/^(.*?)(\s*\([^)]*\))$/);
  return match ? { main: match[1], suffix: match[2] } : { main: headline, suffix: "" };
}

function AiRiskCard({ detail }: { detail: TmTransactionDetail }) {
  const theme = riskTheme(detail.category, detail.riskScore);
  const headline = splitHeadline(detail.riskHeadline);

  return (
    <div className={cn("space-y-4 rounded-xl border p-5 shadow-sm", theme.border, theme.soft)}>
      <p
        className={cn(
          "flex items-center gap-2 text-xs font-medium uppercase tracking-wide",
          theme.text,
        )}
      >
        <AlertTriangle className="h-4 w-4" />
        AI Risk Analysis
      </p>
      <div>
        <p className="text-xl font-semibold text-[color:var(--text-primary)]">
          {headline.main}
          <span className="text-sm font-medium">{headline.suffix}</span>
        </p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--bg-surface)]">
            <div
              className={cn("h-full rounded-full", theme.bar)}
              style={{ width: `${Math.max(detail.riskScore, detail.riskScore === 0 ? 2 : 0)}%` }}
            />
          </div>
          <span className="text-sm font-medium text-[color:var(--text-primary)]">
            {detail.riskScore}%
          </span>
        </div>
      </div>
      <ul className="space-y-2 rounded-lg bg-[color:var(--bg-surface)] px-3 py-3 text-sm text-[color:var(--text-primary)]">
        {detail.riskFindings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>
    </div>
  );
}

function SummaryCard({ detail }: { detail: TmTransactionDetail }) {
  const fields: { label: string; value: ReactNode; strong?: boolean }[] = [
    { label: "Amount", value: detail.amountLabel, strong: true },
    {
      label: "Type",
      value: (
        <span className="inline-flex rounded-md bg-[color:var(--state-success-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
          {detail.typeLabel}
        </span>
      ),
    },
    {
      label: "Severity",
      value: (
        <span
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-medium",
            severityPillClass(detail.severityLabel),
          )}
        >
          {detail.severityLabel}
        </span>
      ),
    },
    { label: "Analyst Status", value: detail.analystStatus },
    { label: "Date & Time", value: detail.dateTime },
    { label: "Customer", value: detail.customerName },
    { label: "Payment Purpose", value: detail.paymentPurpose },
    { label: "Source Country", value: detail.sourceCountry },
  ];

  return (
    <div className={cardClass}>
      <SectionTitle icon={Banknote}>Transaction Summary</SectionTitle>
      <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <p className="text-xs text-[color:var(--text-muted)]">{field.label}</p>
            <div
              className={cn(
                "mt-1.5 truncate text-sm text-[color:var(--text-primary)]",
                field.strong ? "text-base font-semibold" : "font-medium",
              )}
            >
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function severityPillClass(severity: string) {
  const normalized = severity.toLowerCase();
  if (normalized === "high" || normalized === "critical") {
    return "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]";
  }
  if (normalized === "medium") {
    return "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]";
  }
  return "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 text-sm">
      <dt className="text-xs uppercase text-[color:var(--text-muted)]">{label}</dt>
      <dd className="truncate font-medium text-[color:var(--text-primary)]">{value}</dd>
    </div>
  );
}

function PartyCard({
  title,
  party,
}: {
  title: string;
  party: TmTransactionDetail["counterparty"];
}) {
  const rows = [
    { label: "Country", value: party.country },
    { label: "Bank", value: party.bank ?? "-" },
    { label: "BIC", value: party.bic ?? "-" },
    { label: "Source Country", value: party.sourceCountry ?? "-" },
    { label: "Destination Country", value: party.destinationCountry ?? "-" },
    { label: "Recipient", value: party.recipient ?? "-" },
  ];

  return (
    <div className={cardClass}>
      <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">{title}</p>
      <p className="mt-3 truncate text-base font-semibold text-[color:var(--text-primary)]">
        {party.name}
      </p>
      <p className="text-xs text-[color:var(--text-muted)]">{party.maskedId}</p>
      <dl className="mt-5 space-y-2.5">
        {rows.map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
    </div>
  );
}

function CustomerCard({
  party,
  accountActivityHref,
}: {
  party: TmTransactionDetail["customer"];
  accountActivityHref: string;
}) {
  const rows = [
    { label: "Country", value: party.country },
    { label: "Date of Birth", value: party.dateOfBirth ?? "-" },
    { label: "National Code", value: party.nationalCode ?? "-" },
    { label: "Activities", value: party.activities ?? "-" },
    { label: "Activity Description", value: party.activityDescription ?? "-" },
    { label: "Registration Date", value: party.registrationDate ?? "-" },
  ];

  return (
    <div className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-[color:var(--text-muted)]">
          Customer Category: {party.categoryLabel ?? "Individual"}
        </p>
        {party.riskLabel ? (
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-semibold",
              severityPillClass(party.riskLabel),
            )}
          >
            {party.riskLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-3 truncate text-base font-semibold text-[color:var(--accent-primary-hover)] underline underline-offset-2">
        {party.name}
      </p>
      <p className="text-xs text-[color:var(--text-muted)]">{party.maskedId}</p>
      <dl className="mt-5 space-y-2.5">
        {rows.map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
      <Link
        href={accountActivityHref}
        className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
      >
        View Account Activity
      </Link>
    </div>
  );
}

function RulesCard({ rules }: { rules: TmTransactionDetail["rules"] }) {
  return (
    <div className={cardClass}>
      <SectionTitle icon={ShieldCheck}>Rules Triggered</SectionTitle>
      <div className="mt-4 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] px-3 py-2">
        {rules.length === 0 ? (
          <p className="py-2 text-sm text-[color:var(--text-muted)]">
            No rules triggered for this transaction.
          </p>
        ) : (
          <ul className="divide-y divide-[color:var(--border-subtle)]">
            {rules.map((rule) => (
              <li key={rule.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="inline-flex items-center gap-2 text-[color:var(--text-primary)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[color:var(--accent-primary-hover)]" />
                  {rule.label}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
                    rule.outcome === "cleared"
                      ? "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]"
                      : "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
                  )}
                >
                  {rule.outcome === "cleared" ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <AlertTriangle className="h-3 w-3" />
                  )}
                  {rule.outcome === "cleared" ? "Cleared" : "Flagged"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function RelatedCard({
  items,
  totalCount,
}: {
  items: TmTransactionDetail["relatedTransactions"];
  totalCount: number;
}) {
  return (
    <div className={cardClass}>
      <SectionTitle>Related Transactions in Pattern</SectionTitle>
      <ul className="mt-4 divide-y divide-[color:var(--border-subtle)]">
        {items.map((item) => (
          <li
            key={`${item.id}-${item.relativeTime}`}
            className="flex items-center justify-between gap-3 py-3 text-sm"
          >
            <div>
              <p className="font-medium text-[color:var(--accent-primary-hover)]">
                {item.transactionId}
              </p>
              <p className="text-xs text-[color:var(--text-muted)]">{item.relativeTime}</p>
            </div>
            <p className="font-medium text-[color:var(--text-primary)]">{item.amountLabel}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="mt-2 text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
      >
        View all {totalCount} Transactions →
      </button>
    </div>
  );
}

function TimelineCard({ steps }: { steps: TmTransactionDetail["timeline"] }) {
  const toneIcon = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertTriangle,
    info: Clock3,
    pending: Info,
  } as const;

  const toneClass = {
    success: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
    warning: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
    error: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
    info: "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
    pending: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
  } as const;

  return (
    <div className={cardClass}>
      <SectionTitle>Transaction Timeline</SectionTitle>
      <ol className="mt-5 space-y-5">
        {steps.map((step) => {
          const Icon = toneIcon[step.tone];
          return (
            <li key={step.id} className="flex gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  toneClass[step.tone],
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-[color:var(--text-primary)]">
                  {step.label}
                </p>
                {step.detail ? (
                  <p className="text-xs text-[color:var(--text-muted)]">{step.detail}</p>
                ) : null}
                {step.timestamp ? (
                  <p className="text-xs text-[color:var(--text-light)]">{step.timestamp}</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function KeyValueCard({
  title,
  rows,
  grid = false,
}: {
  title: string;
  rows: { label: string; value: string }[];
  grid?: boolean;
}) {
  return (
    <div className={cardClass}>
      <SectionTitle>{title}</SectionTitle>
      <dl className={cn("mt-5", grid ? "grid grid-cols-2 gap-x-4 gap-y-5" : "space-y-2.5")}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "min-w-0 text-sm",
              grid
                ? "space-y-1"
                : "flex items-center justify-between gap-3 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-muted)] px-3 py-2.5",
            )}
          >
            <dt className={cn("shrink-0 text-[color:var(--text-muted)]", grid && "text-xs")}>
              {row.label}
            </dt>
            <dd className="truncate font-medium text-[color:var(--text-primary)]" title={row.value}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CaseManagementPlaceholder({
  data,
  isLoading,
}: {
  data?: Record<string, unknown>;
  isLoading: boolean;
}) {
  const entries = Object.entries(data ?? {}).filter(([, value]) => value !== null && value !== undefined);

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6 py-16 text-center shadow-sm">
      <p className="text-lg font-medium text-[color:var(--text-primary)]">Case Management</p>
      {isLoading ? <p className="mt-2 text-sm text-[color:var(--text-muted)]">Loading case details...</p> : null}
      {!isLoading && entries.length === 0 ? (
        <p className="mt-2 text-sm text-[color:var(--text-muted)]">No case data is available for this transaction.</p>
      ) : null}
      {entries.length > 0 ? (
        <dl className="mx-auto mt-6 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
          {entries.map(([label, value]) => (
            <div key={label} className="rounded-lg bg-[color:var(--bg-muted)] px-3 py-2">
              <dt className="text-xs text-[color:var(--text-muted)]">{label}</dt>
              <dd className="mt-1 text-sm font-medium text-[color:var(--text-primary)]">
                {typeof value === "string" || typeof value === "number" ? String(value) : JSON.stringify(value)}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
