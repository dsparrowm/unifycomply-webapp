"use client";

import type { ReactNode } from "react";
import { File } from "lucide-react";
import { KycAssignedToCell, type AssigneeChoice } from "@/components/kyc/KycAssignedToCell";
import { mapTransactionCase } from "@/lib/api/mappers/transaction-case";
import { cn } from "@/lib/utils";
import type { TmCasePndCard, TmCaseRationaleCard, TmCaseTone } from "@/types/transaction-monitoring";

const cardClass =
  "rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm";

const pillClass: Record<TmCaseTone, string> = {
  success: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  warning: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  danger: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  muted: "bg-[color:var(--bg-muted)] text-[color:var(--text-muted)]",
};

const valueClass: Record<TmCaseTone, string> = {
  success: "text-[color:var(--state-success)]",
  warning: "text-[color:var(--state-warning)]",
  danger: "text-[color:var(--state-error)]",
  muted: "text-[color:var(--text-primary)]",
};

type CaseManagementPanelProps = {
  data?: Record<string, unknown>;
  isLoading: boolean;
  isError: boolean;
  accountNumber?: string;
  assignees?: AssigneeChoice[];
  assigning?: boolean;
  onAssign?: (userId: string | null) => void;
  sidebar: ReactNode;
};

export function CaseManagementPanel({
  data,
  isLoading,
  isError,
  accountNumber,
  assignees,
  assigning,
  onAssign,
  sidebar,
}: CaseManagementPanelProps) {
  const caseView = data ? mapTransactionCase(data, { accountNumber }) : null;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="flex flex-col gap-4">
        {onAssign ? (
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[color:var(--text-muted)]">Assigned to</span>
            <KycAssignedToCell
              assignedTo={caseView?.assignedTo ?? null}
              assignedToId={caseView?.assignedToId ?? null}
              customerName="this case"
              assignees={assignees ?? [{ value: "", label: "Unassigned" }]}
              disabled={assigning || isLoading}
              onAssign={onAssign}
            />
          </div>
        ) : null}
        {isLoading ? <p className="text-sm text-[color:var(--text-muted)]">Loading case details...</p> : null}
        {isError ? (
          <p className="text-sm text-[color:var(--state-error)]">Case details could not be loaded.</p>
        ) : null}
        {!isLoading && !isError ? (
          <>
            <RationaleCard card={caseView?.rationale} />
            <PndCard card={caseView?.pnd} />
          </>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{sidebar}</div>
    </div>
  );
}

function RationaleCard({ card }: { card?: TmCaseRationaleCard }) {
  return (
    <section className={cardClass}>
      <CardHeader title="Rationale Filed" byline={card?.byline} statusLabel={card?.statusLabel} statusTone={card?.statusTone} />
      <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="SAR Number" value={card?.sarNumber} />
        <Field label="Filing Date" value={card?.filingDate} />
        <Field label="Priority" value={card?.priority} tone={card?.priority === "—" ? "muted" : card?.priorityTone} />
        <Field label="Category" value={card?.category} />
      </div>
      <div className="mt-5">
        <p className="text-xs text-[color:var(--text-muted)]">Narrative</p>
        <p className="mt-2 rounded-lg bg-[color:var(--bg-muted)] px-3 py-3 text-sm text-[color:var(--text-primary)]">
          {card?.narrative ?? "—"}
        </p>
      </div>
      <div className="mt-5">
        <p className="text-xs text-[color:var(--text-muted)]">Involve Parties</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {card && card.parties.length > 0 ? (
            card.parties.map((party) => (
              <span key={party} className="text-sm font-medium text-[color:var(--accent-primary-hover)]">
                {party}
              </span>
            ))
          ) : (
            <span className="text-sm font-medium text-[color:var(--text-primary)]">—</span>
          )}
        </div>
      </div>
      <DocumentList documents={card?.documents} />
    </section>
  );
}

function PndCard({ card }: { card?: TmCasePndCard }) {
  return (
    <section className={cardClass}>
      <CardHeader
        title="Post No Debit (PND) Placed"
        byline={card?.byline}
        statusLabel={card?.statusLabel}
        statusTone={card?.statusTone}
      />
      <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="PND Number" value={card?.pndNumber} />
        <Field label="Filing Date" value={card?.filingDate} />
        <Field label="Risk Level" value={card?.riskLevel} tone={card?.riskLevel === "—" ? "muted" : card?.riskTone} />
        <Field label="Account Number" value={card?.accountNumber} />
      </div>
      <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Field label="Reason" value={card?.reason} />
        <Field label="Freeze Amount" value={card?.freezeAmount} />
      </div>
      <div className="mt-5">
        <p className="text-xs text-[color:var(--text-muted)]">Legal Basis</p>
        <p className="mt-2 rounded-lg bg-[color:var(--bg-muted)] px-3 py-3 text-sm text-[color:var(--text-primary)]">
          {card?.legalBasis ?? "—"}
        </p>
      </div>
      <div className="mt-5 grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <Field label="Review Date" value={card?.reviewDate} />
        <DocumentList documents={card?.documents} />
      </div>
    </section>
  );
}

function CardHeader({
  title,
  byline,
  statusLabel,
  statusTone = "muted",
}: {
  title: string;
  byline?: string | null;
  statusLabel?: string | null;
  statusTone?: TmCaseTone;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-primary)]">{title}</h2>
        {byline ? <p className="mt-1 text-xs text-[color:var(--text-muted)]">{byline}</p> : null}
      </div>
      {statusLabel ? (
        <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium", pillClass[statusTone])}>
          {statusLabel}
        </span>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value?: string;
  tone?: TmCaseTone;
}) {
  const shown = value && value.trim() ? value : "—";

  return (
    <div className="min-w-0">
      <p className="text-xs text-[color:var(--text-muted)]">{label}</p>
      <p className={cn("mt-1.5 truncate text-sm font-medium", shown === "—" ? "text-[color:var(--text-primary)]" : valueClass[tone])}>
        {shown}
      </p>
    </div>
  );
}

function DocumentList({ documents }: { documents?: string[] }) {
  return (
    <div>
      <p className="text-xs text-[color:var(--text-muted)]">Supporting Doc</p>
      {documents && documents.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {documents.map((document) => (
            <li key={document} className="flex items-center gap-2 text-sm text-[color:var(--accent-primary-hover)]">
              <File className="h-4 w-4 shrink-0" />
              <span className="truncate">{document}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-sm font-medium text-[color:var(--text-primary)]">—</p>
      )}
    </div>
  );
}
