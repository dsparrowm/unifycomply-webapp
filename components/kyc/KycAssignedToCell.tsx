"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  KYC_UNASSIGNED_LABEL,
  kycAssigneeOptions,
} from "@/lib/data/kyc-assignees";
import { cn } from "@/lib/utils";

type KycAssignedToCellProps = {
  assignedTo: string | null;
  customerName: string;
};

export function KycAssignedToCell({
  assignedTo,
  customerName,
}: KycAssignedToCellProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(assignedTo ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(assignedTo ?? "");
  }, [assignedTo]);

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

  const label = value || KYC_UNASSIGNED_LABEL;
  const isUnassigned = value === "";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Assigned to ${label} for ${customerName}`}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex max-w-full items-center gap-1 text-left text-sm",
          isUnassigned
            ? "text-[color:var(--text-muted)]"
            : "text-[color:var(--text-primary)]",
        )}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-[color:var(--text-light)] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Assign reviewer"
          className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[200px] overflow-hidden rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-[0px_12px_16px_-4px_rgba(16,24,40,0.08),0px_4px_6px_-2px_rgba(16,24,40,0.03)]"
        >
          {kycAssigneeOptions.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value || "unassigned"}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setValue(option.value);
                  setOpen(false);
                }}
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
