import { notFound } from "next/navigation";
import { AmlScreeningDetailPanel } from "@/components/aml-screening/detail/AmlScreeningDetailPanel";
import { getAmlScreeningDetailById } from "@/lib/data/aml-screening";

type AmlScreeningDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AmlScreeningDetailPage({
  params,
}: AmlScreeningDetailPageProps) {
  const { id } = await params;
  const detail = getAmlScreeningDetailById(id);

  if (!detail) {
    notFound();
  }

  return <AmlScreeningDetailPanel detail={detail} />;
}
