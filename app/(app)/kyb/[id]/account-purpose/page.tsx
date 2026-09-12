import { CustomerAccountPurposePanel } from "@/components/customers/CustomerAccountPurposePanel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function KybAccountPurposePage({ params }: PageProps) {
  const { id } = await params;
  return <CustomerAccountPurposePanel kind="kyb" customerId={id} />;
}
