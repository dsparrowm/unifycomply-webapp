"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QueryGate } from "@/components/feedback/QueryGate";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { KycLookupResultPanel } from "@/components/kyc/lookup/KycLookupResultPanel";
import { mapVerificationView } from "@/lib/api/mappers/verification";
import { isKycLookupType, lookupCountryCode } from "@/lib/compliance/lookup-checks";
import { useKycCustomer, useVerification } from "@/lib/hooks/use-compliance";

function KycLookupResultContent() {
  const params = useSearchParams();
  const workflowId = params.get("workflowId") ?? "";
  const identifier = params.get("identifier") ?? "";
  const type = params.get("type") ?? "";
  const country = params.get("country") ?? "";
  const lookupType = isKycLookupType(type) ? type : undefined;
  const verificationQuery = useVerification(workflowId);
  const customerId = verificationQuery.data?.run?.run.customerId ?? "";
  const customerQuery = useKycCustomer(customerId);

  if (!workflowId) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">Lookup could not be completed</h1>
        <p className="text-sm text-[color:var(--text-muted)]">
          Start a verification from Perform Lookup. Mock identifiers are no longer used for this screen.
        </p>
        <Link
          href="/kyc/lookup"
          className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
        >
          Back to Perform Lookup
        </Link>
      </div>
    );
  }

  const view = verificationQuery.data
    ? mapVerificationView(verificationQuery.data, {
        customer: customerQuery.data,
        identifier,
        lookupType,
        countryCode: country ? lookupCountryCode(country) : undefined,
      })
    : null;

  return (
    <QueryGate
      isLoading={verificationQuery.isLoading || (Boolean(customerId) && customerQuery.isLoading)}
      isError={verificationQuery.isError}
      error={verificationQuery.error}
      title="Could not load this verification"
      onRetry={() => void verificationQuery.refetch()}
    >
      {view ? (
        <KycLookupResultPanel view={view} />
      ) : (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
          <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">Verification not found</h1>
          <Link
            href="/kyc/lookup"
            className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
          >
            Back to Perform Lookup
          </Link>
        </div>
      )}
    </QueryGate>
  );
}

export default function KycLookupResultPage() {
  return (
    <Suspense fallback={<PageLoadingSkeleton variant="generic" />}>
      <KycLookupResultContent />
    </Suspense>
  );
}
