"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  FileCheck2,
  FileText,
  Flag,
  Send,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  createSarWizardState,
  sarAssistantSeedReply,
  sarAssistantSuggestions,
  sarJurisdictionOptions,
  sarRedFlagOptions,
  sarWizardSteps,
  toggleIdInList,
} from "@/lib/data/sar-rationale";
import type { TmTransactionDetail } from "@/types/transaction-monitoring";
import type {
  SarAssistantMessage,
  SarBasicInfo,
  SarJurisdictionId,
  SarRationaleFields,
  SarRedFlagId,
  SarWizardState,
  SarWizardStepId,
} from "@/types/sar-rationale";
import { cn } from "@/lib/utils";

const stepIcons: Record<SarWizardStepId, LucideIcon> = {
  basic: UserRound,
  "red-flags": Flag,
  rationale: FileText,
  "export-review": FileCheck2,
};

const inputClass =
  "h-10 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]";

const textareaClass =
  "w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]";

const labelClass = "mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]";

type SarRationaleWizardPanelProps = {
  detail: TmTransactionDetail;
  onSubmit?: (state: SarWizardState) => void;
};

export function SarRationaleWizardPanel({ detail, onSubmit }: SarRationaleWizardPanelProps) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<SarWizardState>(() => createSarWizardState(detail));
  const [assistantMessages, setAssistantMessages] = useState<SarAssistantMessage[]>([]);
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const [savedOpen, setSavedOpen] = useState(false);

  const stepId = sarWizardSteps[stepIndex].id;

  const selectedRedFlags = useMemo(
    () => sarRedFlagOptions.filter((option) => state.redFlagIds.includes(option.id)),
    [state.redFlagIds],
  );

  const selectedJurisdictions = useMemo(
    () =>
      sarJurisdictionOptions.filter((option) => state.jurisdictionIds.includes(option.id)),
    [state.jurisdictionIds],
  );

  const updateBasic = <K extends keyof SarBasicInfo>(key: K, value: SarBasicInfo[K]) => {
    setState((prev) => ({ ...prev, basic: { ...prev.basic, [key]: value } }));
  };

  const updateRationale = <K extends keyof SarRationaleFields>(
    key: K,
    value: SarRationaleFields[K],
  ) => {
    setState((prev) => ({
      ...prev,
      rationale: { ...prev.rationale, [key]: value },
    }));
  };

  const toggleRedFlag = (id: SarRedFlagId) => {
    setState((prev) => ({
      ...prev,
      redFlagIds: toggleIdInList(prev.redFlagIds, id),
    }));
  };

  const toggleJurisdiction = (id: SarJurisdictionId) => {
    setState((prev) => ({
      ...prev,
      jurisdictionIds: toggleIdInList(prev.jurisdictionIds, id),
    }));
  };

  const sendAssistantPrompt = (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMessage: SarAssistantMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setAssistantMessages((prev) => [
      ...prev,
      userMessage,
      { ...sarAssistantSeedReply, id: `assistant-${Date.now()}` },
    ]);
    setAssistantPrompt("");
  };

  const primaryLabel =
    stepId === "export-review" ? "Submit" : stepId === "rationale" ? "Review" : "Continue";

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col gap-4">
        <Link
          href={`/transactions/${detail.id}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
          {detail.transactionId}
        </h1>
      </div>

      <SarStepper stepIndex={stepIndex} />

      {stepId === "basic" ? (
        <>
          <StepPageHeader
            title="Basic Information"
            subtitle="Case details and timeline"
          />
          <BasicInformationStep basic={state.basic} onChange={updateBasic} />
        </>
      ) : null}

      {stepId === "red-flags" ? (
        <>
          <StepPageHeader
            title="Red Flags & Jurisdiction"
            subtitle="Identify all red flags and suspicious indicators observed. This supports your rationale."
          />
          <RedFlagsStep
            selectedFlagIds={state.redFlagIds}
            selectedJurisdictionIds={state.jurisdictionIds}
            additionalObservations={state.additionalObservations}
            onToggleFlag={toggleRedFlag}
            onToggleJurisdiction={toggleJurisdiction}
            onObservationsChange={(value) =>
              setState((prev) => ({ ...prev, additionalObservations: value }))
            }
          />
        </>
      ) : null}

      {stepId === "rationale" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <RationaleStep rationale={state.rationale} onChange={updateRationale} />
          <SarAssistantPanel
            messages={assistantMessages}
            prompt={assistantPrompt}
            onPromptChange={setAssistantPrompt}
            onSend={sendAssistantPrompt}
          />
        </div>
      ) : null}

      {stepId === "export-review" ? (
        <DocumentPreviewStep
          state={state}
          selectedRedFlags={selectedRedFlags}
          selectedJurisdictions={selectedJurisdictions}
          filedDate="2026-02-27"
        />
      ) : null}

      <div className="mt-2 flex items-center justify-end gap-3 border-t border-[color:var(--border-default)] bg-[color:var(--bg-surface)] pt-4">
        <button
          type="button"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-[color:var(--accent-primary-hover)] transition-colors hover:bg-[color:var(--accent-primary-soft)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            if (stepId === "export-review") {
              onSubmit?.(state);
              setSavedOpen(true);
              return;
            }
            setStepIndex((index) => Math.min(sarWizardSteps.length - 1, index + 1));
          }}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          {primaryLabel}
        </button>
      </div>

      <SarSavedModal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        onContinue={() => {
          setSavedOpen(false);
          router.push(`/transactions/${detail.id}`);
        }}
      />
    </div>
  );
}

function StepPageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        {title}
      </h2>
      <p className="mt-1 text-sm text-[color:var(--text-muted)]">{subtitle}</p>
    </div>
  );
}

function SarStepper({ stepIndex }: { stepIndex: number }) {
  return (
    <ol className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-y-0">
      {sarWizardSteps.map((step, index) => {
        const Icon = stepIcons[step.id];
        const complete = index < stepIndex;
        const active = index === stepIndex;
        const showConnector = index < sarWizardSteps.length - 1;

        return (
          <li key={step.id} className="relative flex flex-col items-center text-center">
            {showConnector ? (
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute top-5 left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] hidden h-0 border-t md:block",
                  index < stepIndex
                    ? "border-solid border-[color:var(--accent-primary-hover)]"
                    : "border-dashed border-[color:var(--border-default)]",
                )}
              />
            ) : null}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                complete || active
                  ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-hover)] text-white"
                  : "border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-[color:var(--text-light)]",
              )}
            >
              {complete ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <p
              className={cn(
                "mt-2 max-w-[9.5rem] text-xs font-semibold uppercase tracking-wide",
                active || complete
                  ? "text-[color:var(--accent-primary-hover)]"
                  : "text-[color:var(--text-light)]",
              )}
            >
              {step.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function BasicInformationStep({
  basic,
  onChange,
}: {
  basic: SarBasicInfo;
  onChange: <K extends keyof SarBasicInfo>(key: K, value: SarBasicInfo[K]) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Individual Information">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Case ID (Auto-generated)">
            <input className={inputClass} value={basic.caseId} readOnly />
          </Field>
          <Field label="Transaction ID">
            <input className={inputClass} value={basic.transactionId} readOnly />
          </Field>
          <Field label="Entity Type">
            <select
              className={inputClass}
              value={basic.entityType}
              onChange={(event) =>
                onChange("entityType", event.target.value as SarBasicInfo["entityType"])
              }
            >
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
            </select>
          </Field>
          <Field label="Full Name">
            <input
              className={inputClass}
              value={basic.fullName}
              onChange={(event) => onChange("fullName", event.target.value)}
            />
          </Field>
          <Field label="Date of Birth">
            <input
              type="date"
              className={inputClass}
              value={basic.dateOfBirth}
              onChange={(event) => onChange("dateOfBirth", event.target.value)}
            />
          </Field>
          <Field label="Nationality">
            <select
              className={inputClass}
              value={basic.nationality}
              onChange={(event) => onChange("nationality", event.target.value)}
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Nigeria</option>
              <option>Germany</option>
              <option>Canada</option>
            </select>
          </Field>
          <Field label="Full Address" className="md:col-span-2 xl:col-span-3">
            <input
              className={inputClass}
              placeholder="address"
              value={basic.fullAddress}
              onChange={(event) => onChange("fullAddress", event.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Transaction Details">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Date of transaction">
            <input
              type="date"
              className={inputClass}
              value={basic.transactionDate}
              onChange={(event) => onChange("transactionDate", event.target.value)}
            />
          </Field>
          <Field label="Amount">
            <input
              className={inputClass}
              value={basic.amount}
              onChange={(event) => onChange("amount", event.target.value)}
            />
          </Field>
          <Field label="Type">
            <select
              className={inputClass}
              value={basic.transferType}
              onChange={(event) => onChange("transferType", event.target.value)}
            >
              <option>Wire</option>
              <option>ACH</option>
              <option>Card</option>
              <option>Cash</option>
            </select>
          </Field>
          <Field label="Detection Date">
            <input
              type="date"
              className={inputClass}
              value={basic.detectionDate}
              onChange={(event) => onChange("detectionDate", event.target.value)}
            />
          </Field>
          <Field label="Priority">
            <select
              className={inputClass}
              value={basic.priority}
              onChange={(event) =>
                onChange("priority", event.target.value as SarBasicInfo["priority"])
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </Field>
          <Field label="Risk Level">
            <select
              className={inputClass}
              value={basic.riskLevel}
              onChange={(event) =>
                onChange("riskLevel", event.target.value as SarBasicInfo["riskLevel"])
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </Field>
          <Field label="Narration" className="md:col-span-2 xl:col-span-3">
            <input
              className={inputClass}
              placeholder="address"
              value={basic.narration}
              onChange={(event) => onChange("narration", event.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Account Details">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Account Number">
            <input
              className={inputClass}
              value={basic.accountNumber}
              onChange={(event) => onChange("accountNumber", event.target.value)}
            />
          </Field>
          <Field label="Type">
            <select
              className={inputClass}
              value={basic.accountType}
              onChange={(event) => onChange("accountType", event.target.value)}
            >
              <option>Checking</option>
              <option>Savings</option>
              <option>Business</option>
            </select>
          </Field>
          <Field label="Opened Date">
            <input
              type="date"
              className={inputClass}
              value={basic.openedDate}
              onChange={(event) => onChange("openedDate", event.target.value)}
            />
          </Field>
          <Field label="Status">
            <select
              className={inputClass}
              value={basic.accountStatus}
              onChange={(event) => onChange("accountStatus", event.target.value)}
            >
              <option>Active</option>
              <option>Blocked</option>
              <option>Closed</option>
            </select>
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

function SelectionCard({
  selected,
  title,
  description,
  onToggle,
}: {
  selected: boolean;
  title: string;
  description: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-soft)]"
          : "border-[color:var(--border-default)] bg-[color:var(--bg-surface)] hover:bg-[color:var(--bg-muted)]",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border",
          selected
            ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-hover)] text-white"
            : "border-[color:var(--border-default)] bg-[color:var(--bg-surface)]",
        )}
      >
        {selected ? <Check className="h-3.5 w-3.5" /> : null}
      </span>
      <span>
        <span className="block text-sm font-semibold text-[color:var(--text-primary)]">
          {title}
        </span>
        <span className="mt-1 block text-xs text-[color:var(--text-muted)]">{description}</span>
      </span>
    </button>
  );
}

function RedFlagsStep({
  selectedFlagIds,
  selectedJurisdictionIds,
  additionalObservations,
  onToggleFlag,
  onToggleJurisdiction,
  onObservationsChange,
}: {
  selectedFlagIds: SarRedFlagId[];
  selectedJurisdictionIds: SarJurisdictionId[];
  additionalObservations: string;
  onToggleFlag: (id: SarRedFlagId) => void;
  onToggleJurisdiction: (id: SarJurisdictionId) => void;
  onObservationsChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Red Flags
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sarRedFlagOptions.map((option) => (
            <SelectionCard
              key={option.id}
              selected={selectedFlagIds.includes(option.id)}
              title={option.title}
              description={option.description}
              onToggle={() => onToggleFlag(option.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Transaction Jurisdiction
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sarJurisdictionOptions.map((option) => (
            <SelectionCard
              key={option.id}
              selected={selectedJurisdictionIds.includes(option.id)}
              title={option.country}
              description={option.fiu}
              onToggle={() => onToggleJurisdiction(option.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Additional Red Flags or Observations</label>
        <textarea
          rows={4}
          placeholder="Enter"
          value={additionalObservations}
          onChange={(event) => onObservationsChange(event.target.value)}
          className={textareaClass}
        />
        <p className="mt-2 text-xs text-[color:var(--text-muted)]">
          This will be recorded in the audit trail.
        </p>
      </div>
    </div>
  );
}

function RationaleField({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</h3>
      <textarea
        rows={4}
        placeholder="Enter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(textareaClass, "mt-2")}
      />
      <p className="mt-2 text-xs text-[color:var(--text-muted)]">
        This will be recorded in the audit trail.
      </p>
    </div>
  );
}

function RationaleStep({
  rationale,
  onChange,
}: {
  rationale: SarRationaleFields;
  onChange: <K extends keyof SarRationaleFields>(
    key: K,
    value: SarRationaleFields[K],
  ) => void;
}) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
        Rationale Narrative
      </h2>
      <p className="mt-2 text-sm text-[color:var(--text-muted)]">
        Provide a clear, detailed narrative explaining why this activity is suspicious.
      </p>
      <div className="mt-6 flex flex-col gap-6">
        <RationaleField
          title="Opening Statement (WHO & WHAT)"
          value={rationale.opening}
          onChange={(value) => onChange("opening", value)}
        />
        <RationaleField
          title="Activity Description (WHAT)"
          value={rationale.activity}
          onChange={(value) => onChange("activity", value)}
        />
        <RationaleField
          title="Why It's Suspicious (WHY)"
          value={rationale.whySuspicious}
          onChange={(value) => onChange("whySuspicious", value)}
        />
        <RationaleField
          title="Investigation Steps Taken (HOW)"
          value={rationale.investigation}
          onChange={(value) => onChange("investigation", value)}
        />
        <RationaleField
          title="Summary & Recommendation (CONCLUSION)"
          value={rationale.summary}
          onChange={(value) => onChange("summary", value)}
        />
      </div>
    </section>
  );
}

function SarAssistantPanel({
  messages,
  prompt,
  onPromptChange,
  onSend,
}: {
  messages: SarAssistantMessage[];
  prompt: string;
  onPromptChange: (value: string) => void;
  onSend: (prompt: string) => void;
}) {
  return (
    <aside className="flex h-fit flex-col rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm xl:sticky xl:top-24">
      <div className="flex items-center gap-2 border-b border-[color:var(--border-default)] px-4 py-3">
        <Sparkles className="h-4 w-4 text-[color:var(--accent-primary-hover)]" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          SAR Assistant
        </h2>
      </div>

      <div className="flex max-h-[560px] flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-2">
            {sarAssistantSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => onSend(suggestion)}
                className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-3 py-3 text-left text-sm text-[color:var(--text-primary)] transition-colors hover:border-[color:var(--accent-primary-hover)]"
              >
                <span className="mb-1 inline-flex items-center gap-1 text-[color:var(--accent-primary-hover)]">
                  <Sparkles className="h-3.5 w-3.5" />
                </span>
                {suggestion}
              </button>
            ))}
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-xl px-3 py-3 text-sm",
                message.role === "user"
                  ? "bg-[color:var(--accent-primary-soft)] text-[color:var(--text-primary)]"
                  : "border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] text-[color:var(--text-primary)]",
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.role === "assistant" ? (
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-[color:var(--accent-primary-hover)]"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(message.content);
                    } catch {
                      // Clipboard may be unavailable in some environments.
                    }
                  }}
                >
                  Copy text
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="mt-auto flex items-center gap-2 border-t border-[color:var(--border-default)] p-3">
        <input
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSend(prompt);
            }
          }}
          placeholder="Prompt...."
          className={cn(inputClass, "flex-1")}
        />
        <button
          type="button"
          aria-label="Send prompt"
          onClick={() => onSend(prompt)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

function DocumentPreviewStep({
  state,
  selectedRedFlags,
  selectedJurisdictions,
  filedDate,
}: {
  state: SarWizardState;
  selectedRedFlags: { id: string; title: string; description: string }[];
  selectedJurisdictions: { id: string; country: string; fiu: string }[];
  filedDate: string;
}) {
  const primaryJurisdiction = selectedJurisdictions[0] ?? {
    id: "us",
    country: "United States",
    fiu: "FinCEN",
  };
  const generatedAt = "2/27/2026, 7:22:05 AM";
  const activityStart =
    state.basic.transactionDate || state.basic.detectionDate || "2024-10-10";
  const activityEnd = state.basic.detectionDate || "2024-10-16";
  const detectionDate = state.basic.detectionDate || filedDate;

  const narrativeBlocks = [
    {
      title: "A. Opening Statement (Who & What)",
      body:
        state.rationale.opening.trim() ||
        "This SAR concerns suspected structuring activity designed to evade Currency Transaction Reporting requirements (31 USC 5324).",
    },
    {
      title: "B. Activity Description (What)",
      body:
        state.rationale.activity.trim() ||
        "Review identified 8 transactions over 7 days ranging from $9,850 to $9,950, consistently just below the $10,000 reporting threshold.",
    },
    {
      title: "C. Why It's Suspicious (Why)",
      body:
        state.rationale.whySuspicious.trim() ||
        "The pattern of repeated below-threshold amounts across multiple branches is consistent with structuring and knowledge of BSA reporting thresholds.",
    },
    {
      title: "D. Investigation Steps Taken (How)",
      body:
        state.rationale.investigation.trim() ||
        "Analyst reviewed 12-month transaction history, compared counterparties, and attempted customer contact for an explanation of the activity.",
    },
    {
      title: "E. Summary & Recommendation (Conclusion)",
      body:
        state.rationale.summary.trim() ||
        "Based on the structuring pattern and lack of a satisfactory explanation, this activity warrants SAR filing.",
    },
  ] as const;

  const basicRows: { label: string; value: string; danger?: boolean }[][] = [
    [
      { label: "Case ID", value: state.basic.caseId || "RAT-2026-35128" },
      { label: "Transaction ID", value: state.basic.transactionId },
    ],
    [
      { label: "Full Name", value: state.basic.fullName || "Unknown Individual" },
      { label: "Entity Type", value: state.basic.entityType },
    ],
    [
      {
        label: "Subject Name/Entity",
        value: state.basic.fullName || "Unknown Individual",
      },
      { label: "Account Number", value: state.basic.accountNumber },
    ],
    [
      { label: "Total Amount", value: state.basic.amount },
      {
        label: "Risk Level",
        value: state.basic.riskLevel.toUpperCase(),
        danger: state.basic.riskLevel === "High",
      },
    ],
    [
      { label: "Activity Type", value: "Structuring" },
      { label: "Detection Date", value: detectionDate },
    ],
    [
      { label: "Activity Start Date", value: activityStart },
      { label: "Activity End Date", value: activityEnd },
    ],
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Document Preview
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Review complete SAR Rationale export
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          <Upload className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <article className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-subtle)] pb-5">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">
                SAR Rationale
              </h3>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                Financial Crimes Enforcement Network ({primaryJurisdiction.fiu})
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
                Filing Jurisdictions:
              </span>
              {selectedJurisdictions.length > 0 ? (
                selectedJurisdictions.map((jurisdiction) => (
                  <span
                    key={jurisdiction.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-primary)]"
                  >
                    <span aria-hidden>{jurisdiction.id === "us" ? "🇺🇸" : "🏳️"}</span>
                    {jurisdiction.country} ({jurisdiction.fiu})
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-primary)]">
                  <span aria-hidden>🇺🇸</span>
                  United States (FinCEN)
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
              Filed Date
            </p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
              {filedDate}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="border-b border-[color:var(--border-subtle)] pb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            1. Basic Information
          </h4>
          <div className="mt-4 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {basicRows.flat().map((field) => (
              <div key={field.label} className="space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
                  {field.label}
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold text-[color:var(--text-primary)]",
                    field.danger && "text-[color:var(--state-error)]",
                  )}
                >
                  {field.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            2. Suspicious Indicators
          </h4>
          <ol className="relative mt-5 space-y-5">
            {(selectedRedFlags.length > 0
              ? selectedRedFlags
              : [
                  {
                    id: "below-threshold",
                    title: "Transactions just below $10,000 reporting threshold",
                    description: "Multiple deposits/withdrawals of $9,000–$9,999",
                  },
                ]
            ).map((flag, index, list) => (
              <li key={flag.id} className="relative flex gap-3 pl-1">
                {index < list.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute left-[0.85rem] top-7 bottom-[-1.25rem] w-px bg-[color:var(--border-default)]"
                  />
                ) : null}
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--text-primary)] text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {flag.title}
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                    {flag.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            3. Detailed Narrative
          </h4>
          <div className="mt-4 space-y-5">
            {narrativeBlocks.map((block) => (
              <div key={block.title}>
                <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
                  {block.title}
                </p>
                <div className="mt-2 rounded-lg bg-[color:var(--bg-muted)] px-4 py-3 text-sm leading-relaxed text-[color:var(--text-primary)]">
                  {block.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--border-subtle)] pt-4 text-xs text-[color:var(--text-light)]">
          <p>SENTINEL AML - Transaction Monitoring System</p>
          <p>Generated: {generatedAt}</p>
        </div>
      </article>
    </div>
  );
}

function SarSavedModal({
  open,
  onClose,
  onContinue,
}: {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="sar-saved-title"
        className="relative z-10 w-full max-w-[520px] rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-8 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)]"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--accent-primary-soft)] text-[color:var(--accent-primary-hover)]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2
          id="sar-saved-title"
          className="mt-5 text-center text-lg font-semibold text-[color:var(--text-primary)]"
        >
          SAR Rationale Saved Successfully
        </h2>
        <p className="mt-2 text-center text-sm text-[color:var(--text-muted)]">
          The SAR rationale has been filed successfully, you should proceed to the SAR report to
          track
        </p>
        <div className="mt-5 rounded-lg border border-[color:var(--state-warning)]/40 bg-[color:var(--state-warning-soft)] px-4 py-3 text-sm">
          <p className="font-semibold text-[color:var(--state-warning)]">SAR Rationale</p>
          <p className="mt-1 text-[color:var(--text-primary)]">
            This tool creates internal compliance documentation (SAR Rationale) that supports your
            audit trail and makes the actual SAR filing process easier - it&apos;s not the SAR
            submission itself!
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--bg-muted)] px-4 text-sm font-medium text-[color:var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
