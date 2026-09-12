import { notFound } from "next/navigation";
import { AccountStatementPanel } from "@/components/transaction-monitoring/AccountStatementPanel";
import { getAccountStatementForTransaction } from "@/lib/data/account-statement";

type AccountStatementPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountStatementPage({
  params,
}: AccountStatementPageProps) {
  const { id } = await params;
  const data = getAccountStatementForTransaction(id);

  if (!data) {
    notFound();
  }

  return <AccountStatementPanel transactionId={id} data={data} />;
}
