import { AmlCreateCasePanel } from "@/components/aml/lookup/AmlCreateCasePanel";

type AmlLookupPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function AmlLookupPage({ searchParams }: AmlLookupPageProps) {
  const { mode } = await searchParams;

  return <AmlCreateCasePanel mode={mode === "batch" ? "batch" : "single"} />;
}
