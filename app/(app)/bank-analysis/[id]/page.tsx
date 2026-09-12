import { notFound } from "next/navigation";
import { BankAnalysisDetailPanel } from "@/components/bank-analysis/detail/BankAnalysisDetailPanel";
import { getBankAnalysisDetailById } from "@/lib/data/bank-analysis";

type BankAnalysisDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
};

export default async function BankAnalysisDetailPage({
  params,
  searchParams,
}: BankAnalysisDetailPageProps) {
  const { id } = await params;
  const { view } = await searchParams;
  const detail = getBankAnalysisDetailById(id, { highRisk: view === "high-risk" });

  if (!detail) {
    notFound();
  }

  return <BankAnalysisDetailPanel detail={detail} />;
}