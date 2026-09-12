import { notFound } from "next/navigation";
import { AmlCaseDetailPanel } from "@/components/aml/detail/AmlCaseDetailPanel";
import { getAmlCaseDetail } from "@/lib/data/aml-detail";

type AmlCaseDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ kind?: string }>;
};

export default async function AmlCaseDetailPage({
  params,
  searchParams,
}: AmlCaseDetailPageProps) {
  const { id } = await params;
  const { kind } = await searchParams;
  const detail = getAmlCaseDetail(
    id,
    kind === "corporate" ? "corporate" : kind === "person" ? "person" : undefined,
  );

  if (!detail) {
    notFound();
  }

  return <AmlCaseDetailPanel detail={detail} />;
}
