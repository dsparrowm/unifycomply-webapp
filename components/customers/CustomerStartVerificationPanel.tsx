"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import { defaultProviderForCheck } from "@/lib/api/mappers/verifications";
import {
  customerCountryCode,
  useAvailableChecks,
  useCustomerForIntake,
  useStartVerification,
} from "@/lib/hooks/use-customer-intake";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { CustomerKind } from "@/types/account-purpose";
import type { StartVerificationSelection } from "@/types/verification";

type CustomerStartVerificationPanelProps = {
  kind: CustomerKind;
  customerId: string;
};

export function CustomerStartVerificationPanel({
  kind,
  customerId,
}: CustomerStartVerificationPanelProps) {
  const router = useRouter();
  const customerQuery = useCustomerForIntake(kind, customerId);
  const countryCode = customerCountryCode(customerQuery.data);
  const checksQuery = useAvailableChecks(kind, customerQuery.data ? countryCode : undefined);
  const start = useStartVerification(kind, customerId);
  const prefix = kind === "kyc" ? "KYC" : "KYB";
  const detailHref = kind === "kyc" ? `/kyc/${customerId}` : `/kyb/${customerId}`;
  const purposeHref =
    kind === "kyc" ? `/kyc/${customerId}/account-purpose` : `/kyb/${customerId}/account-purpose`;

  const [selections, setSelections] = useState<Record<string, StartVerificationSelection>>({});

  const checks = useMemo(() => checksQuery.data ?? [], [checksQuery.data]);

  useEffect(() => {
    if (checks.length === 0) {
      return;
    }
    setSelections((current) => {
      if (Object.keys(current).length > 0) {
        return current;
      }
      const next: Record<string, StartVerificationSelection> = {};
      for (const check of checks) {
        next[check.type] = {
          type: check.type,
          providerKey: defaultProviderForCheck(check),
        };
      }
      return next;
    });
  }, [checks]);

  const selectedTypes = Object.keys(selections);

  const toggleCheck = (type: string, providerKey: string) => {
    setSelections((current) => {
      if (current[type]) {
        const next = { ...current };
        delete next[type];
        return next;
      }
      return { ...current, [type]: { type, providerKey } };
    });
  };

  const onSubmit = async () => {
    const chosen = Object.values(selections);
    if (chosen.length === 0) {
      toastError(new Error("Select at least one check"), "Select at least one check");
      return;
    }
    try {
      await start.mutateAsync({ selections: chosen, customer: customerQuery.data });
      toastSuccess("Verification started");
      router.push(detailHref);
    } catch (error) {
      toastError(error, "Could not start verification");
    }
  };

  if (customerQuery.isLoading || checksQuery.isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (customerQuery.isError || checksQuery.isError) {
    return (
      <PageErrorState
        title="Could not load available checks"
        description={getErrorMessage(customerQuery.error ?? checksQuery.error, "Please try again.")}
        onRetry={() => {
          void customerQuery.refetch();
          void checksQuery.refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <KycLookupBackHeader backHref={purposeHref} breadcrumb={`${prefix} / Start verification`} />

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Start verification</h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Choose the checks to run for this {kind === "kyc" ? "customer" : "business"} in{" "}
            {countryCode}. This picker is not in Figma — it uses Core Platform available-checks.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {checks.map((check) => {
            const selected = Boolean(selections[check.type]);
            const providerValue = selections[check.type]?.providerKey ?? defaultProviderForCheck(check);
            return (
              <label
                key={check.type}
                className="flex flex-col gap-3 rounded-xl border border-[color:var(--border-default)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleCheck(check.type, providerValue)}
                    className="mt-1 rounded border-[color:var(--border-default)]"
                  />
                  <span>
                    <span className="block text-sm font-medium text-[color:var(--text-primary)]">
                      {check.label}
                    </span>
                    {check.authority ? (
                      <span className="mt-0.5 block text-xs text-[color:var(--text-muted)]">
                        {check.authority}
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="sm:w-56">
                  <SettingsSelect
                    label="Provider"
                    options={check.providers}
                    value={providerValue}
                    disabled={!selected}
                    onChange={(event) => {
                      setSelections((current) => ({
                        ...current,
                        [check.type]: { type: check.type, providerKey: event.target.value },
                      }));
                    }}
                  />
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(detailHref)}
          className="rounded-lg border border-[color:var(--border-default)] px-4 py-2 text-sm font-medium text-[color:var(--text-muted)] hover:bg-[color:var(--bg-muted)]"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={() => {
            void onSubmit();
          }}
          disabled={start.isPending || selectedTypes.length === 0}
          className={cn(
            "rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]",
            (start.isPending || selectedTypes.length === 0) && "opacity-60",
          )}
        >
          {start.isPending ? "Starting..." : "Start verification"}
        </button>
      </div>
    </div>
  );
}
