"use client";

import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";

export function BillingPlaceholderPanel() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">Billing</h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
          Manage your subscription, invoices, and payment methods
        </p>
      </div>

      <EmptyState
        icon={CreditCard}
        title="Billing coming soon"
        description="Wallet top-up is available from the overview page. Full billing and subscription management will be added when payment integration is ready."
      />
    </div>
  );
}
