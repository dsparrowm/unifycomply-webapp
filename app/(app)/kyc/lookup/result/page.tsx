import Link from "next/link";
import { notFound } from "next/navigation";
import { KycLookupResultPanel } from "@/components/kyc/lookup/KycLookupResultPanel";
import { performKycLookup } from "@/lib/data/kyc-lookup";
import type { KycLookupType } from "@/types/kyc";

const lookupTypes: KycLookupType[] = [
  "bvn-basic",
  "nin-basic",
  "drivers-license-basic",
  "voters-card-basic",
  "passport-basic",
];

function isLookupType(value: string): value is KycLookupType {
  return lookupTypes.includes(value as KycLookupType);
}

type KycLookupResultPageProps = {
  searchParams: Promise<{
    type?: string;
    country?: string;
    app?: string;
    identifier?: string;
    environment?: string;
    mode?: string;
  }>;
};

export default async function KycLookupResultPage({ searchParams }: KycLookupResultPageProps) {
  const params = await searchParams;
  const type = params.type ?? "";
  const identifier = params.identifier ?? "";

  if (!isLookupType(type)) {
    notFound();
  }

  const result = performKycLookup(type, identifier);

  if (!result) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-lg font-semibold text-[color:var(--text-primary)]">
          Lookup could not be completed
        </h1>
        <p className="text-sm text-[color:var(--text-muted)]">
          Enter a valid identifier and try again.
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

  return <KycLookupResultPanel result={result} />;
}
