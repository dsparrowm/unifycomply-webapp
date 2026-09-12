import { CustomerStartVerificationPanel } from "@/components/customers/CustomerStartVerificationPanel";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function KybStartVerificationPage({ params }: PageProps) {
  const { id } = await params;
  return <CustomerStartVerificationPanel kind="kyb" customerId={id} />;
}
