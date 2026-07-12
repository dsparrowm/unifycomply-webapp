"use client";

import { useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { KybFilterOption } from "@/types/kyb";
import { cn } from "@/lib/utils";

type KybLookupTypeDropdownProps<T extends string> = {
  label: string;
  placeholder?: string;
  options: KybFilterOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KybLookupTypeDropdown<T extends string>({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
  open,
  onOpenChange,
}: KybLookupTypeDropdownProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;
  const hasSelection = Boolean(selectedOption);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onOpenChange, open]);

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{label}</p>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-left text-sm text-[color:var(--text-primary)] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] transition-colors",
          open && "border-[color:var(--accent-primary-hover)] ring-2 ring-[color:var(--accent-primary-soft)]",
        )}
      >
        <span className={cn(!hasSelection && "text-[color:var(--text-light)]")}>{displayLabel}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+4px)] z-50 max-h-80 w-full overflow-y-auto rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.value);
                  onOpenChange(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-[color:var(--text-primary)] transition-colors",
                  selected ? "bg-[color:var(--bg-muted)]" : "hover:bg-[color:var(--bg-muted)]",
                )}
              >
                <span className="flex-1">{option.label}</span>
                {selected ? (
                  <Check className="h-5 w-5 shrink-0 text-[color:var(--accent-primary)]" />
                ) : (
                  <span className="h-5 w-5 shrink-0" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
