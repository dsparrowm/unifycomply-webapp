"use client";

import { useState } from "react";
import { KycChooseActionModal } from "@/components/kyc/KycChooseActionModal";

export function KycPageHeader() {
  const [chooseActionOpen, setChooseActionOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">KYC</h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">Know your customers</p>
      </div>
      <button
        type="button"
        onClick={() => setChooseActionOpen(true)}
        className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
      >
        Add Customer
      </button>
      <KycChooseActionModal open={chooseActionOpen} onClose={() => setChooseActionOpen(false)} />
    </div>
  );
}
