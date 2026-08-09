import { AmlScreeningLookupPanel } from "@/components/aml-screening/AmlScreeningLookupPanel";
import type { AmlLookupMode } from "@/types/aml-screening";

type AmlScreeningLookupPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function AmlScreeningLookupPage({
  searchParams,
}: AmlScreeningLookupPageProps) {
  const { mode } = await searchParams;
  const initialMode: AmlLookupMode = mode === "batch" ? "batch" : "single";

  return <AmlScreeningLookupPanel initialMode={initialMode} />;
}
