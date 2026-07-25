"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const dateOptions = [
  "Last 7 days",
  "Last month",
  "Last 3 month",
  "Last 6 month",
  "Select specific date",
] as const;

export function BankAnalysisDateRangeMenu() {
  const [selectedDate, setSelectedDate] =
    useState<(typeof dateOptions)[number]>("Last month");
  const [dateLabel, setDateLabel] = useState<string>("Last 30 days");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex w-fit items-center gap-3 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-4 py-2.5 text-xs font-medium text-[color:var(--text-muted)]"
      >
        {dateLabel}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-20 mt-2 min-w-52 rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] py-2 shadow-lg"
        >
          {dateOptions.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              onClick={() => {
                setSelectedDate(option);
                setDateLabel(option);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-xs text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
            >
              {option}
              {option === selectedDate ? (
                <Check
                  className="h-4 w-4 text-[color:var(--accent-primary-hover)]"
                  aria-hidden="true"
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
