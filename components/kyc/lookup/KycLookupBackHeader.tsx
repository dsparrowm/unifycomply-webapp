"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type KycLookupBackHeaderProps = {
  backHref?: string;
  breadcrumb: string;
  breadcrumbClassName?: string;
  action?: React.ReactNode;
};

export function KycLookupBackHeader({
  backHref = "/kyc",
  breadcrumb,
  breadcrumbClassName = "text-sm font-medium text-[color:var(--accent-primary-hover)]",
  action,
}: KycLookupBackHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <p className={breadcrumbClassName}>{breadcrumb}</p>
      </div>
      {action}
    </div>
  );
}
