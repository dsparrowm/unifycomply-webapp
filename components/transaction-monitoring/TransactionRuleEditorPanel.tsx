"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import type { TmRuleDetail, TmRuleSeverity } from "@/types/tm-rules";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]";

const textareaClass =
  "w-full rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)]";

const labelClass = "mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]";

const conditionTypes = [
  "Data Match",
  "Compare Fields",
  "Velocity Check",
  "Layering Activity",
] as const;

const fieldOptions = [
  "Transaction Amount",
  "Currency",
  "Category",
  "Transaction Type",
  "Device Location",
  "Ip Address",
  "Merchant Type",
] as const;

const severityStyles: Record<TmRuleSeverity, string> = {
  critical: "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
  high: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  medium: "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  low: "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
};

type TransactionRuleEditorPanelProps = {
  initial: TmRuleDetail;
  mode: "create" | "edit";
};

export function TransactionRuleEditorPanel({
  initial,
  mode,
}: TransactionRuleEditorPanelProps) {
  const router = useRouter();
  const [form, setForm] = useState(initial);

  const previewName = form.name.trim() || "Untitled rule";
  const previewDescription =
    form.description.trim() || "Rule description will appear here.";
  const logicLabel = useMemo(() => {
    if (form.conditions.length === 0) {
      return "No conditions configured";
    }
    return form.conditions
      .map(
        (condition) =>
          `${condition.field} ${condition.operator} "${condition.value || "…"}"`,
      )
      .join(" AND ");
  }, [form.conditions]);

  const updateField = <K extends keyof TmRuleDetail>(key: K, value: TmRuleDetail[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addCondition = () => {
    setForm((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          id: `c-${Date.now()}`,
          type: "Data Match",
          field: "Transaction Amount",
          operator: "Greater Than (>)",
          value: "",
        },
      ],
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/rules"
        className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[color:var(--bg-muted)] px-3 py-1.5 text-sm text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--border-default)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-4">
            <h1 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              {mode === "create" ? "Create Rule" : "Edit Rule"}
            </h1>
            <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--state-success)]">
              {form.sourceLabel}
            </span>
          </div>

          <div className="space-y-6 p-5">
            <div>
              <label className={labelClass}>Rule Name</label>
              <input
                className={inputClass}
                placeholder="Enter"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                className={textareaClass}
                placeholder="enter"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Severity Level</label>
              <select
                className={inputClass}
                value={form.severity}
                onChange={(event) =>
                  updateField("severity", event.target.value as TmRuleSeverity)
                }
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-4 rounded-xl border border-[color:var(--border-default)] p-4">
              <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
                Action Settings
              </h2>
              <div>
                <label className={labelClass}>TM Condition</label>
                <select
                  className={inputClass}
                  value={form.tmCondition}
                  onChange={(event) => updateField("tmCondition", event.target.value)}
                >
                  <option>TM Blocked</option>
                  <option>Stop Payment</option>
                  <option>Cumulative Frequency</option>
                  <option>TM Not-Blocked</option>
                </select>
              </div>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.blockOnTrigger}
                  onChange={(event) => updateField("blockOnTrigger", event.target.checked)}
                  className="mt-1 rounded border-[color:var(--border-default)]"
                />
                <span>
                  <span className="font-medium text-[color:var(--text-primary)]">
                    New Device High Amount
                  </span>
                  <span className="mt-0.5 block text-xs text-[color:var(--text-muted)]">
                    Automatically block any transaction that trigger the rule
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.sendAlerts}
                  onChange={(event) => updateField("sendAlerts", event.target.checked)}
                  className="mt-1 rounded border-[color:var(--border-default)]"
                />
                <span>
                  <span className="font-medium text-[color:var(--text-primary)]">
                    Send Alerts
                  </span>
                  <span className="mt-0.5 block text-xs text-[color:var(--text-muted)]">
                    Send notification when this is triggered
                  </span>
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
                  Conditions
                </h2>
                <button
                  type="button"
                  onClick={addCondition}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--accent-primary-hover)]"
                >
                  <Plus className="h-4 w-4" />
                  Add Condition
                </button>
              </div>

              {form.conditions.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[color:var(--border-default)] px-4 py-6 text-center text-sm text-[color:var(--text-muted)]">
                  No conditions yet. Add a condition to build rule logic.
                </p>
              ) : (
                <div className="space-y-3">
                  {form.conditions.map((condition, index) => (
                    <div
                      key={condition.id}
                      className="grid gap-3 rounded-xl border border-[color:var(--border-default)] p-4 md:grid-cols-2"
                    >
                      <div>
                        <label className={labelClass}>Condition Type</label>
                        <select
                          className={inputClass}
                          value={condition.type}
                          onChange={(event) => {
                            const next = [...form.conditions];
                            next[index] = { ...condition, type: event.target.value };
                            updateField("conditions", next);
                          }}
                        >
                          {conditionTypes.map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Field to Check</label>
                        <select
                          className={inputClass}
                          value={condition.field}
                          onChange={(event) => {
                            const next = [...form.conditions];
                            next[index] = { ...condition, field: event.target.value };
                            updateField("conditions", next);
                          }}
                        >
                          {fieldOptions.map((field) => (
                            <option key={field}>{field}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Operator</label>
                        <input
                          className={inputClass}
                          value={condition.operator}
                          onChange={(event) => {
                            const next = [...form.conditions];
                            next[index] = { ...condition, operator: event.target.value };
                            updateField("conditions", next);
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Value</label>
                        <input
                          className={inputClass}
                          value={condition.value}
                          onChange={(event) => {
                            const next = [...form.conditions];
                            next[index] = { ...condition, value: event.target.value };
                            updateField("conditions", next);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[color:var(--border-default)] px-5 py-4">
            <button
              type="button"
              onClick={() => router.push("/rules")}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--bg-muted)] px-4 text-sm font-medium text-[color:var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => router.push("/rules")}
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)]"
            >
              {mode === "create" ? "Create Rule" : "Update Rule"}
            </button>
          </div>
        </section>

        <aside className="h-fit rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm xl:sticky xl:top-24">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Live Preview
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-[color:var(--text-muted)]">Rule Name</p>
              <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">
                {previewName}
              </p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-muted)]">Description</p>
              <p className="mt-1 text-sm text-[color:var(--text-primary)]">{previewDescription}</p>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-muted)]">Severity</p>
              <span
                className={cn(
                  "mt-1 inline-flex rounded-md px-2 py-0.5 text-xs font-semibold capitalize",
                  severityStyles[form.severity],
                )}
              >
                {form.severity}
              </span>
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-muted)]">Human Readable Logic</p>
              <div className="mt-1 rounded-lg bg-[color:var(--bg-muted)] px-3 py-2 text-xs leading-relaxed text-[color:var(--text-primary)]">
                {logicLabel}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div>
                <p className="text-xs text-[color:var(--text-muted)]">Conditions</p>
                <p className="mt-1 font-medium text-[color:var(--text-primary)]">
                  {form.conditions.length} Conditions
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-[color:var(--state-error-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--state-error)]">
                {form.actionLabel}
              </span>
              <span className="rounded-md bg-[color:var(--state-error-soft)] px-2 py-0.5 text-xs font-semibold text-[color:var(--state-error)]">
                {form.tmCondition}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
