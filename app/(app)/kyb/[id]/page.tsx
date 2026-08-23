import { notFound } from "next/navigation";
import { KybDetailPanel } from "@/components/kyb/detail/KybDetailPanel";
import { getKybDetailById } from "@/lib/data/kyb-detail";

type KybDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KybDetailPage({ params }: KybDetailPageProps) {
  const { id } = await params;
  const detail = getKybDetailById(id);

  if (!detail) {
    notFound();
  }

  return <KybDetailPanel detail={detail} />;
}
