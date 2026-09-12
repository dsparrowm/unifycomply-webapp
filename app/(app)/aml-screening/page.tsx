import { AmlListPanel } from "@/components/aml/AmlListPanel";
import { amlListDataEmpty, amlListDataPopulated } from "@/lib/data/aml-screening";

type AmlScreeningPageProps = {
  searchParams: Promise<{ empty?: string }>;
};

export default async function AmlScreeningPage({ searchParams }: AmlScreeningPageProps) {
  const { empty } = await searchParams;

  return (
    <AmlListPanel data={empty === "1" ? amlListDataEmpty : amlListDataPopulated} />
  );
}
