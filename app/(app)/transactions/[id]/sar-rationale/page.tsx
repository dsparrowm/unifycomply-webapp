import { notFound } from "next/navigation";
import { SarRationaleWizardPanel } from "@/components/transaction-monitoring/SarRationaleWizardPanel";
import { getTmTransactionDetail } from "@/lib/data/transactions";

type SarRationalePageProps = {
  params: Promise<{ id: string }>;
};

export default async function SarRationalePage({ params }: SarRationalePageProps) {
  const { id } = await params;
  const detail = getTmTransactionDetail(id);

  if (!detail) {
    notFound();
  }

  return <SarRationaleWizardPanel detail={detail} />;
}
