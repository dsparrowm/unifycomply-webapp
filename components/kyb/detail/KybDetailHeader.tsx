"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KycStatusBadge } from "@/components/kyc/KycStatusBadge";
import type { KybDetail, KybVerificationStatus } from "@/types/kyb";

type KybDetailHeaderProps = {
  detail: KybDetail;
  status: KybVerificationStatus;
};

export function KybDetailHeader({ detail, status }: KybDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-4">
        <Link
          href="/kyb"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium">
            <span className="text-[color:var(--text-muted)]">KYB / </span>
            <span className="text-[color:var(--text-primary)]">{detail.businessName}</span>
          </p>
          <KycStatusBadge status={status} uppercase />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-[color:var(--state-success)]">
          Risk Score: {detail.riskScore}
        </span>
        <button
          type="button"
          className="shrink-0 rounded-lg bg-[color:var(--accent-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
        >
          Export Report
        </button>
      </div>
    </div>
  );
}
