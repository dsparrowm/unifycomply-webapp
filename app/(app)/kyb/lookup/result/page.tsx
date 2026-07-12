import Link from "next/link";
import { notFound } from "next/navigation";
import { KybLookupResultPanel } from "@/components/kyb/lookup/KybLookupResultPanel";
import { performKybLookup } from "@/lib/data/kyb-lookup";
import type { KybLookupType } from "@/types/kyb";

const lookupTypes: KybLookupType[] = ["cac-basic", "tin-basic", "rc-basic"];

function isLookupType(value: string): value is KybLookupType {
  return lookupTypes.includes(value as KybLookupType);
}

type KybLookupResultPageProps = {
  searchParams: Promise<{
    type?: string;
    country?: string;
    app?: string;
    identifier?: string;
    batch?: string;
    mode?: string;
  }>;
};

export default async function KybLookupResultPage({ searchParams }: KybLookupResultPageProps) {
  const params = await searchParams;
  const type = params.type ?? "";
  const identifier = params.identifier ?? "";

  if (!isLookupType(type)) {
    notFound();
  }

  const result = performKybLookup(type, identifier);

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
          href="/kyb/lookup"
          className="rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]"
        >
          Back to Perform Lookup
        </Link>
      </div>
    );
  }

  return <KybLookupResultPanel result={result} />;
}
