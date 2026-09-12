import { CustomerStartVerificationPanel } from "@/components/customers/CustomerStartVerificationPanel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function KycStartVerificationPage({ params }: PageProps) {
  const { id } = await params;
  return <CustomerStartVerificationPanel kind="kyc" customerId={id} />;
}
