import { KycDetailContainer } from "@/components/kyc/KycDetailContainer";

type KycDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ workflowId?: string }>;
};

export default async function KycDetailPage({ params, searchParams }: KycDetailPageProps) {
  const { id } = await params;
  const { workflowId } = await searchParams;
  return <KycDetailContainer routeId={id} workflowId={workflowId} />;
}
