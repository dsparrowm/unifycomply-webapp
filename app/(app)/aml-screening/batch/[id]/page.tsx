import { AmlBatchResultPanel } from "@/components/aml/AmlBatchResultPanel";
import { getAmlBatchResult } from "@/lib/data/aml-batch-results";

type AmlBatchResultPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AmlBatchResultPage({ params }: AmlBatchResultPageProps) {
  const { id } = await params;

  return <AmlBatchResultPanel result={getAmlBatchResult(id)} />;
}
