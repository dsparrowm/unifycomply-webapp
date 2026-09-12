import Link from "next/link";
import { isLiveCustomerId } from "@/lib/customers/live-id";
import type { CustomerKind } from "@/types/account-purpose";

type CustomerIntakeLinksProps = {
  kind: CustomerKind;
  customerId: string;
};

export function CustomerIntakeLinks({ kind, customerId }: CustomerIntakeLinksProps) {
  if (!isLiveCustomerId(customerId)) {
    return null;
  }

  const purposeHref =
    kind === "kyc" ? `/kyc/${customerId}/account-purpose` : `/kyb/${customerId}/account-purpose`;
  const startHref =
    kind === "kyc"
      ? `/kyc/${customerId}/start-verification`
      : `/kyb/${customerId}/start-verification`;

  return (
    <p className="text-sm text-[color:var(--text-muted)]">
      <Link href={purposeHref} className="hover:text-[color:var(--accent-primary-hover)]">
        Account purpose
      </Link>
      <span className="px-2">·</span>
      <Link href={startHref} className="hover:text-[color:var(--accent-primary-hover)]">
        Start verification
      </Link>
    </p>
  );
}
