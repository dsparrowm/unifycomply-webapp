"use client";

import { Archive } from "lucide-react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/api/errors";
import { useOffboardCustomer } from "@/lib/hooks/use-customer-compliance";

type CustomerOffboardButtonProps = {
  kind: "kyc" | "kyb";
  customerId: string;
};

export function CustomerOffboardButton({ kind, customerId }: CustomerOffboardButtonProps) {
  const router = useRouter();
  const offboard = useOffboardCustomer(kind, customerId);

  async function handleOffboard() {
    const confirmed = window.confirm(
      "Offboard this customer? The record will be retained but removed from active customer lists.",
    );
    if (!confirmed) return;

    try {
      await offboard.mutateAsync("Offboarded by tenant officer");
      router.push(`/${kind}`);
    } catch (error) {
      window.alert(getErrorMessage(error, "Could not offboard this customer"));
    }
  }

  return (
    <button
      type="button"
      onClick={handleOffboard}
      disabled={offboard.isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--state-error)] px-4 py-2.5 text-sm font-medium text-[color:var(--state-error)] hover:bg-[color:var(--state-error-soft)] disabled:cursor-wait disabled:opacity-60"
    >
      <Archive className="h-4 w-4" />
      {offboard.isPending ? "Offboarding..." : "Offboard"}
    </button>
  );
}