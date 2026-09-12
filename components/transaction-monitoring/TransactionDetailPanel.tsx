"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Info,
} from "lucide-react";
import { EscalateCaseModal } from "@/components/transaction-monitoring/EscalateCaseModal";
import { ResolveCaseModal } from "@/components/transaction-monitoring/ResolveCaseModal";
import { PlacePndModal } from "@/components/transaction-monitoring/PlacePndModal";
import type { TmTransactionDetail, TmTxCategory } from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";

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
      />

      <PlacePndModal
        open={pndOpen}
        transactionId={detail.transactionId}
        customerName={detail.customerName}
        onClose={() => setPndOpen(false)}
      />

      <EscalateCaseModal
        open={escalateOpen}
        transactionId={detail.transactionId}
        customerName={detail.customerName}
        onClose={() => setEscalateOpen(false)}
      />

      <div className="flex items-center gap-6 border-b border-[color:var(--border-default)]">
        <TabButton active={tab === "details"} onClick={() => setTab("details")}>
          Transaction Details
        </TabButton>
        <TabButton active={tab === "case"} onClick={() => setTab("case")}>
          Case Management
        </TabButton>
      </div>

      {tab === "details" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
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
            <RelatedCard
              items={detail.relatedTransactions}
              totalCount={detail.relatedTotalCount}
            />
          </div>
          <div className="flex flex-col gap-4">
            <TimelineCard steps={detail.timeline} />
            <KeyValueCard title="Quick Stats" rows={detail.quickStats} />
            <KeyValueCard title="Full Metadata" rows={detail.metadata} grid />
          </div>
        </div>
      ) : (
        <CaseManagementPlaceholder />
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
        "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
        active
          ? "border-[color:var(--accent-primary-hover)] text-[color:var(--accent-primary-hover)]"
          : "border-transparent text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)]",
      )}
    >
      {children}
    </button>
  );
}

function riskTheme(category: TmTxCategory, score: number) {
  if (category === "cumulative-frequency") {
    return {
      header: "bg-[color:var(--state-purple)]",
      bar: "bg-[color:var(--state-purple)]",
      border: "border-[color:var(--state-purple)]/30",
      soft: "bg-[color:var(--state-purple-soft)]",
    };
  }
  if (category === "stop-payment" || (score >= 70 && score < 100)) {
    return {
      header: "bg-[color:var(--state-warning)]",
      bar: "bg-[color:var(--state-warning)]",
      border: "border-[color:var(--state-warning)]/30",
      soft: "bg-[color:var(--state-warning-soft)]",
    };
  }
  if (category === "tm-blocked" || score >= 90) {
    return {
      header: "bg-[color:var(--state-error)]",
      bar: "bg-[color:var(--state-error)]",
      border: "border-[color:var(--state-error)]/30",
      soft: "bg-[color:var(--state-error-soft)]",
    };
  }
  return {
    header: "bg-[color:var(--state-success)]",
    bar: "bg-[color:var(--state-success)]",
    border: "border-[color:var(--border-default)]",
    soft: "bg-[color:var(--state-success-soft)]",
  };
}

function AiRiskCard({ detail }: { detail: TmTransactionDetail }) {
  const theme = riskTheme(detail.category, detail.riskScore);

  return (
    <div className={cn("overflow-hidden rounded-xl border shadow-sm", theme.border)}>
      <div
        className={cn(
          "flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white",
          theme.header,
        )}
      >
        <AlertTriangle className="h-4 w-4" />
        AI Risk Analysis
      </div>
      <div className={cn("space-y-4 p-5", theme.soft)}>
        <div>
          <p className="text-base font-semibold text-[color:var(--text-primary)]">
            {detail.riskHeadline}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
            <div
              className={cn("h-full rounded-full", theme.bar)}
              style={{ width: `${Math.max(detail.riskScore, detail.riskScore === 0 ? 2 : 0)}%` }}
            />
          </div>
        </div>
        <ul className="space-y-2 text-sm text-[color:var(--text-muted)]">
          {detail.riskFindings.map((finding) => (
            <li key={finding} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--text-light)]" />
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ detail }: { detail: TmTransactionDetail }) {
  const fields = [
    { label: "Amount", value: detail.amountLabel },
    { label: "Type", value: detail.typeLabel, accent: "success" as const },
    { label: "Severity", value: detail.severityLabel, accent: "severity" as const },
    { label: "Analyst Status", value: detail.analystStatus },
    { label: "Date & Time", value: detail.dateTime },
    { label: "Customer", value: detail.customerName },
    { label: "Payment Purpose", value: detail.paymentPurpose },
    { label: "Source Country", value: detail.sourceCountry },
  ];

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
        Transaction Summary
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="text-xs text-[color:var(--text-muted)]">{field.label}</p>
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                field.accent === "success" && "text-[color:var(--state-success)]",
                field.accent === "severity" && severityTextClass(detail.severityLabel),
                !field.accent && "text-[color:var(--text-primary)]",
              )}
            >
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function severityTextClass(severity: string) {
  const normalized = severity.toLowerCase();
  if (normalized === "high") return "text-[color:var(--state-error)]";
  if (normalized === "medium") return "text-[color:var(--state-warning)]";
  return "text-[color:var(--state-success)]";
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
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <p className="mt-3 text-base font-semibold text-[color:var(--text-primary)]">
        {party.name}
      </p>
      <p className="text-xs text-[color:var(--text-muted)]">ID {party.maskedId}</p>
      <dl className="mt-4 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3 text-sm">
            <dt className="text-[color:var(--text-muted)]">{row.label}</dt>
            <dd className="font-medium text-[color:var(--text-primary)]">{row.value}</dd>
          </div>
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
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
          Customer Category: {party.categoryLabel ?? "Individual"}
        </h2>
        {party.riskLabel ? (
          <span className="rounded-md bg-[color:var(--state-success-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--state-success)]">
            {party.riskLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-base font-semibold text-[color:var(--accent-primary-hover)]">
        {party.name}
      </p>
      <p className="text-xs text-[color:var(--text-muted)]">ID {party.maskedId}</p>
      <dl className="mt-4 space-y-2">
        <div className="flex justify-between gap-3 text-sm">
          <dt className="text-[color:var(--text-muted)]">Country</dt>
          <dd className="font-medium text-[color:var(--text-primary)]">{party.country}</dd>
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <dt className="text-[color:var(--text-muted)]">Date of Birth</dt>
          <dd className="font-medium text-[color:var(--text-primary)]">
            {party.dateOfBirth ?? "-"}
          </dd>
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <dt className="text-[color:var(--text-muted)]">National Code</dt>
          <dd className="font-medium text-[color:var(--text-primary)]">
            {party.nationalCode ?? "-"}
          </dd>
        </div>
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
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">Rules Triggered</h2>
      <ul className="mt-4 space-y-3">
        {rules.map((rule) => (
          <li key={rule.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-[color:var(--text-primary)]">{rule.label}</span>
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-medium",
                rule.outcome === "cleared"
                  ? "text-[color:var(--state-success)]"
                  : "text-[color:var(--state-error)]",
              )}
            >
              {rule.outcome === "cleared" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              {rule.outcome === "cleared" ? "Cleared" : "Flagged"}
            </span>
          </li>
        ))}
      </ul>
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
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
        Related Transactions in Pattern
      </h2>
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
    success: "text-[color:var(--state-success)]",
    warning: "text-[color:var(--state-warning)]",
    error: "text-[color:var(--state-error)]",
    info: "text-[color:var(--state-info)]",
    pending: "text-[color:var(--text-muted)]",
  } as const;

  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
        Transaction Timeline
      </h2>
      <ol className="mt-4 space-y-4">
        {steps.map((step, index) => {
          const Icon = toneIcon[step.tone];
          return (
            <li key={step.id} className="relative flex gap-3">
              {index < steps.length - 1 ? (
                <span
                  className="absolute left-[11px] top-7 h-[calc(100%-8px)] w-px bg-[color:var(--border-default)]"
                  aria-hidden
                />
              ) : null}
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", toneClass[step.tone])} />
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
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</h2>
      <dl
        className={cn(
          "mt-4",
          grid ? "grid grid-cols-2 gap-3" : "space-y-2",
        )}
      >
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              "text-sm",
              grid ? "space-y-0.5" : "flex items-center justify-between gap-3",
            )}
          >
            <dt className="text-[color:var(--text-muted)]">{row.label}</dt>
            <dd className="font-medium text-[color:var(--text-primary)]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CaseManagementPlaceholder() {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6 py-16 text-center shadow-sm">
      <p className="text-lg font-medium text-[color:var(--text-primary)]">Case Management</p>
      <p className="mt-2 text-sm text-[color:var(--text-muted)]">
        SAR filing and PND placement status will appear here after Resolve / Place PND actions.
      </p>
    </div>
  );
}
