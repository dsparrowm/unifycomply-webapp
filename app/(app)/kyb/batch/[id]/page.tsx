import { notFound } from "next/navigation";
import { KybBatchResultPanel } from "@/components/kyb/KybBatchResultPanel";
import { getKybBatchResult } from "@/lib/data/kyb-batch-results";

type KybBatchResultPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KybBatchResultPage({ params }: KybBatchResultPageProps) {
  const { id } = await params;
  const result = getKybBatchResult(id);

  if (!result) {
    notFound();
  }

  return <KybBatchResultPanel result={result} />;
}
