"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type AmlEntityTypeOption = {
  value: string;
  label: string;
};

type AmlEntityTypeMultiSelectProps = {
  label: string;
  options: readonly AmlEntityTypeOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
};

function formatDisplayLabel(options: readonly AmlEntityTypeOption[], value: string[]) {
  if (value.length === 0) {
    return "Select";
  }

  const labels = options.filter((option) => value.includes(option.value)).map((option) => option.label);
  return labels.join(", ");
}

function toggleValue(values: string[], next: string) {
  return values.includes(next) ? values.filter((item) => item !== next) : [...values, next];
}

export function AmlEntityTypeMultiSelect({
  label,
  options,
  value,
  onChange,
  className,
}: AmlEntityTypeMultiSelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const allSelected = options.length > 0 && options.every((option) => value.includes(option.value));
  const displayLabel = formatDisplayLabel(options, value);
  const hasSelection = value.length > 0;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelectAll = () => {
    onChange(allSelected ? [] : options.map((option) => option.value));
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <span className="mb-1.5 block text-sm font-medium text-[color:var(--text-primary)]">{label}</span>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3.5 text-left text-sm outline-none transition-colors",
          open &&
            "border-[color:var(--accent-primary-hover)] ring-2 ring-[color:var(--accent-primary-soft)]",
          hasSelection
            ? "text-[color:var(--text-primary)]"
            : "text-[color:var(--text-light)]",
        )}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[color:var(--text-muted)] transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
          className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          <OptionRow
            label="Select All"
            selected={allSelected}
            onSelect={handleSelectAll}
          />
          {options.map((option) => {
            const selected = value.includes(option.value);
            return (
              <OptionRow
                key={option.value}
                label={option.label}
                selected={selected}
                onSelect={() => onChange(toggleValue(value, option.value))}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function OptionRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-[color:var(--text-primary)] transition-colors",
        selected
          ? "bg-[color:var(--accent-primary-soft)]"
          : "hover:bg-[color:var(--bg-muted)]",
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          selected
            ? "border-[color:var(--accent-primary-hover)] bg-[color:var(--accent-primary-hover)]"
            : "border-[color:var(--border-default)] bg-[color:var(--bg-surface)]",
        )}
        aria-hidden="true"
      >
        {selected ? <Check className="h-3 w-3 text-white" strokeWidth={3} /> : null}
      </span>
      <span className="flex-1 font-medium">{label}</span>
      {selected ? (
        <Check className="h-5 w-5 shrink-0 text-[color:var(--accent-primary-hover)]" aria-hidden="true" />
      ) : (
        <span className="h-5 w-5 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}
