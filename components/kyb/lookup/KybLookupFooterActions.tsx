"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KycRequestResubmissionModal } from "@/components/kyc/detail/KycRequestResubmissionModal";

export function KybLookupFooterActions() {
  const router = useRouter();
  const [resubmissionOpen, setResubmissionOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setResubmissionOpen(true)}
          className="h-11 min-w-[190px] rounded-lg border border-[color:var(--border-default)] bg-white px-5 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)]"
        >
          Request Resubmission
        </button>
        <button
          type="button"
          onClick={() => router.push("/kyb")}
          className="h-11 min-w-[135px] rounded-lg border border-[color:var(--state-error)] bg-white px-5 text-sm font-medium text-[color:var(--state-error)] transition-colors hover:bg-[color:var(--state-error-soft)]"
        >
          Cancel
        </button>
        <button
          type="button"
          className="h-11 min-w-[135px] rounded-lg bg-[color:var(--accent-primary-hover)] px-5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
        >
          Approve
        </button>
      </div>

      <KycRequestResubmissionModal
        open={resubmissionOpen}
        onClose={() => setResubmissionOpen(false)}
        onConfirm={() => setResubmissionOpen(false)}
      />
    </>
  );
}
