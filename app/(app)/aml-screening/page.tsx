import { AmlScreeningListPanel } from "@/components/aml-screening/AmlScreeningListPanel";
import {
  amlScreeningListDataEmpty,
  amlScreeningListDataPopulated,
} from "@/lib/data/aml-screening";

type AmlScreeningPageProps = {
  searchParams: Promise<{ state?: string }>;
};

export default async function AmlScreeningPage({ searchParams }: AmlScreeningPageProps) {
  const { state } = await searchParams;
  const data =
    state === "empty" ? amlScreeningListDataEmpty : amlScreeningListDataPopulated;

  return <AmlScreeningListPanel data={data} />;
}
