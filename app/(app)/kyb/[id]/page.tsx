import { KybDetailContainer } from "@/components/kyb/KybDetailContainer";

type KybDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KybDetailPage({ params }: KybDetailPageProps) {
  const { id } = await params;
  return <KybDetailContainer customerId={id} />;
}
