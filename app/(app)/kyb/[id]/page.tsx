import { KybDetailContainer } from "@/components/kyb/KybDetailContainer";

type KybDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ workflowId?: string }>;
};

export default async function KybDetailPage({ params, searchParams }: KybDetailPageProps) {
  const { id } = await params;
  const { workflowId } = await searchParams;
  return <KybDetailContainer routeId={id} workflowId={workflowId} />;
}
