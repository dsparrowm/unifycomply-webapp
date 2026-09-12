import { KycDetailContainer } from "@/components/kyc/KycDetailContainer";

type KycDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KycDetailPage({ params }: KycDetailPageProps) {
  const { id } = await params;
  return <KycDetailContainer customerId={id} />;
}
