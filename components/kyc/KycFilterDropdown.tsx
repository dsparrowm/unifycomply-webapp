"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { KycFilterOption } from "@/types/kyc";
import { cn } from "@/lib/utils";

type KycFilterDropdownProps<T extends string> = {
  label: string;
  icon?: ReactNode;
  options: KycFilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function KycFilterDropdown<T extends string>({
  label,
  icon,
  options,
  value,
  onChange,
  open,
  onOpenChange,
}: KycFilterDropdownProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleSelect = (nextValue: T) => {
    onChange(nextValue);
    onOpenChange(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-2 text-sm text-[color:var(--text-muted)] transition-colors",
          open && "border-[color:var(--accent-primary-hover)] ring-2 ring-[color:var(--accent-primary-soft)]",
        )}
      >
        {icon}
        {label}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+4px)] z-50 w-[248px] overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm font-medium text-[color:var(--text-primary)] transition-colors",
                  selected
                    ? "bg-[color:var(--bg-muted)]"
                    : "hover:bg-[color:var(--bg-muted)]",
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
