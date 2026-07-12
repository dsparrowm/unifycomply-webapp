"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import type { SettingsPepTier } from "@/types/settings";
import { cn } from "@/lib/utils";

type EditPepTierModalProps = {
  tier: SettingsPepTier | null;
  open: boolean;
  onClose: () => void;
  onSave: (tier: SettingsPepTier) => void;
};

function RiskScoreSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const percentage = (value / 4) * 100;

  return (
    <div className="space-y-2">
      <label htmlFor="pep-risk-score" className="text-sm font-medium text-[color:var(--text-primary)]">
        Risk Score Impact (0-4) <span className="text-[color:var(--state-error)]">*</span>
      </label>
      <div className="relative h-2 rounded-full bg-[color:var(--border-subtle)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--accent-primary-hover)]"
          style={{ width: `${percentage}%` }}
        />
        <input
          id="pep-risk-score"
          type="range"
          min={0}
          max={4}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="threshold-slider absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-[color:var(--text-primary)]">
        <span>0</span>
        <span>{value}</span>
        <span>4</span>
      </div>
    </div>
  );
}

function PermissionRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--border-default)] px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[color:var(--text-primary)]">{title}</p>
          <p className="mt-1 text-xs text-[color:var(--text-light)]">{description}</p>
        </div>
        <SettingsToggle checked={checked} onChange={onChange} label={title} />
      </div>
    </div>
  );
}

export function EditPepTierModal({ tier, open, onClose, onSave }: EditPepTierModalProps) {
  const [draft, setDraft] = useState<SettingsPepTier | null>(tier);
  const [exampleInput, setExampleInput] = useState("");

  useEffect(() => {
    if (open && tier) {
      setDraft(tier);
      setExampleInput("");
    }
  }, [open, tier]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleAddExample = () => {
    const trimmed = exampleInput.trim();
    if (!trimmed || !draft || draft.examples.includes(trimmed)) {
      return;
    }

    setDraft({ ...draft, examples: [...draft.examples, trimmed] });
    setExampleInput("");
  };

  const handleRemoveExample = (example: string) => {
    if (!draft) {
      return;
    }

    setDraft({ ...draft, examples: draft.examples.filter((item) => item !== example) });
  };

  const handleSubmit = () => {
    if (!draft) {
      return;
    }

    onSave(draft);
    onClose();
  };

  if (!open || !draft) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-pep-tier-title"
        className="relative z-10 flex max-h-[calc(100vh-4rem)] w-full max-w-[790px] flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="border-b border-[color:var(--border-default)] px-7 py-5">
          <div className="flex items-start justify-between gap-4">
            <h2
              id="edit-pep-tier-title"
              className="text-xl font-semibold text-[color:var(--text-primary)]"
            >
              Edit PEP TIER {draft.level}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-7 py-6">
          <div className="space-y-6">
            <SettingsField
              label="Tier Title"
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="pep-tier-description"
                className="text-sm font-medium text-[color:var(--text-primary)]"
              >
                Description
              </label>
              <textarea
                id="pep-tier-description"
                value={draft.description}
                onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                rows={4}
                className={cn(
                  "w-full resize-none rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[color:var(--text-light)] focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]",
                )}
              />
            </div>

            <RiskScoreSlider
              value={draft.riskScoreImpact}
              onChange={(riskScoreImpact) => setDraft({ ...draft, riskScoreImpact })}
            />

            <div className="space-y-3">
              <p className="text-base font-medium text-[color:var(--text-primary)]">Permissions</p>
              <PermissionRow
                title="Requires Approval"
                description="Customers must be manually approved"
                checked={draft.requiresApproval}
                onChange={(requiresApproval) => setDraft({ ...draft, requiresApproval })}
              />
              <PermissionRow
                title="Auto-Escalation"
                description="Automatically escalate to senior team"
                checked={draft.autoEscalation}
                onChange={(autoEscalation) => setDraft({ ...draft, autoEscalation })}
              />
            </div>

            <div className="space-y-3">
              <SettingsField
                label="Examples"
                value={exampleInput}
                onChange={(event) => setExampleInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleAddExample();
                  }
                }}
                placeholder="Add an example and press Enter"
              />
              {draft.examples.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {draft.examples.map((example) => (
                    <span
                      key={example}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-3 py-1 text-xs text-[color:var(--text-primary)]"
                    >
                      {example}
                      <button
                        type="button"
                        onClick={() => handleRemoveExample(example)}
                        aria-label={`Remove ${example}`}
                        className="text-[color:var(--text-light)] hover:text-[color:var(--text-primary)]"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[color:var(--border-default)] px-7 py-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 min-w-[240px] items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-11 min-w-[240px] items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-6 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
