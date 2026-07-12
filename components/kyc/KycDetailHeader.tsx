"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { KycStatusBadge } from "@/components/kyc/KycStatusBadge";
import type { KycDetail, KycVerificationStatus } from "@/types/kyc";

type KycDetailHeaderProps = {
  detail: KycDetail;
  status: KycVerificationStatus;
};

export function KycDetailHeader({ detail, status }: KycDetailHeaderProps) {
  const showExportReport = status === "approved" || status === "rejected";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-4">
        <Link
          href="/kyc"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium">
            <span className="text-[color:var(--text-muted)]">KYC / </span>
            <span className="text-[color:var(--accent-primary-hover)]">{detail.documentType} / </span>
            <span className="text-[color:var(--text-primary)]">
              {detail.customerName.toUpperCase()}
            </span>
          </p>
          <KycStatusBadge status={status} uppercase />
        </div>
      </div>

      {showExportReport ? (
        <button
          type="button"
          className="shrink-0 rounded-lg bg-[color:var(--accent-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
        >
          Export Report
        </button>
      ) : null}
    </div>
  );
}
