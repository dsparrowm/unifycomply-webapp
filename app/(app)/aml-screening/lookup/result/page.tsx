import { AmlSearchResultPanel } from "@/components/aml/lookup/AmlSearchResultPanel";
import { amlSearchResultMulti, amlSearchResultSingle } from "@/lib/data/aml-search-result";

type AmlSearchResultPageProps = {
  searchParams: Promise<{ name?: string; view?: string }>;
};

export default async function AmlSearchResultPage({ searchParams }: AmlSearchResultPageProps) {
  const { name, view } = await searchParams;
  const fixture = view === "single" ? amlSearchResultSingle : amlSearchResultMulti;
  const caseName = name?.trim() ? name.trim() : fixture.caseName;

  return <AmlSearchResultPanel data={{ ...fixture, caseName }} />;
}
