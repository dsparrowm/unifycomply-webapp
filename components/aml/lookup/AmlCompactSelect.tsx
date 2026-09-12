"use client";

import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { AmlFilterOption } from "@/types/aml";
import { cn } from "@/lib/utils";

type AmlCompactSelectProps<T extends string> = {
  label?: string;
  placeholder: string;
  options: AmlFilterOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export function AmlCompactSelect<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  open,
  onOpenChange,
  className,
}: AmlCompactSelectProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

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
    <div ref={containerRef} className={cn("relative", className)}>
      {label ? (
        <p className="mb-1.5 text-sm font-medium text-[color:var(--text-primary)]">{label}</p>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => onOpenChange(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-[color:var(--border-default)] bg-white px-3 py-2.5 text-left text-sm shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]",
          open && "border-[color:var(--accent-primary-hover)] ring-2 ring-[color:var(--accent-primary-soft)]",
        )}
      >
        <span className={cn(selected ? "text-[color:var(--text-primary)]" : "text-[color:var(--text-light)]")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[color:var(--text-light)]", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+4px)] z-50 max-h-56 w-full overflow-y-auto rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                onOpenChange(false);
              }}
              className={cn(
                "flex w-full px-3 py-2 text-left text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]",
                option.value === value && "bg-[color:var(--bg-muted)]",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
