import { notFound } from "next/navigation";
import { TransactionDetailPanel } from "@/components/transaction-monitoring/TransactionDetailPanel";
import { getTmTransactionDetail } from "@/lib/data/transactions";

type TransactionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransactionDetailPage({
  params,
}: TransactionDetailPageProps) {
  const { id } = await params;
  const detail = getTmTransactionDetail(id);

  if (!detail) {
    notFound();
  }

  return <TransactionDetailPanel detail={detail} />;
}
