import { CustomerAccountPurposePanel } from "@/components/customers/CustomerAccountPurposePanel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function KycAccountPurposePage({ params }: PageProps) {
  const { id } = await params;
  return <CustomerAccountPurposePanel kind="kyc" customerId={id} />;
}
