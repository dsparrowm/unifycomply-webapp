import { notFound } from "next/navigation";
import { BankAnalysisDetailPanel } from "@/components/bank-analysis/detail/BankAnalysisDetailPanel";
import { getBankAnalysisDetailById } from "@/lib/data/bank-analysis";

type BankAnalysisDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BankAnalysisDetailPage({
  params,
}: BankAnalysisDetailPageProps) {
  const { id } = await params;
  const detail = getBankAnalysisDetailById(id);

  if (!detail) {
    notFound();
  }

  return <BankAnalysisDetailPanel detail={detail} />;
}
