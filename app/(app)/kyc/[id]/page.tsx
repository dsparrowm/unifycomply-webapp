import { notFound } from "next/navigation";
import { KycDetailPanel } from "@/components/kyc/KycDetailPanel";
import { getKycDetailById } from "@/lib/data/kyc-detail";

type KycDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KycDetailPage({ params }: KycDetailPageProps) {
  const { id } = await params;
  const detail = getKycDetailById(id);

  if (!detail) {
    notFound();
  }

  return <KycDetailPanel detail={detail} />;
}
