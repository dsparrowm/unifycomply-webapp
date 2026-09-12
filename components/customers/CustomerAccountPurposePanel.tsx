"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { KycLookupBackHeader } from "@/components/kyc/lookup/KycLookupBackHeader";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { PageErrorState } from "@/components/feedback/PageErrorState";
import { PageLoadingSkeleton } from "@/components/feedback/PageLoadingSkeleton";
import { getErrorMessage } from "@/lib/api/errors";
import {
  accountPurposeOptions,
  expectedChannelOptions,
  sourceOfFundsOptions,
} from "@/lib/data/account-purpose";
import { useAccountPurpose, useSaveAccountPurpose } from "@/lib/hooks/use-customer-intake";
import { toastError, toastSuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { AccountPurposeFormValues, CustomerKind } from "@/types/account-purpose";

type CustomerAccountPurposePanelProps = {
  kind: CustomerKind;
  customerId: string;
};

export function CustomerAccountPurposePanel({ kind, customerId }: CustomerAccountPurposePanelProps) {
  const router = useRouter();
  const query = useAccountPurpose(kind, customerId);
  const save = useSaveAccountPurpose(kind, customerId);
  const prefix = kind === "kyc" ? "KYC" : "KYB";
  const detailHref = kind === "kyc" ? `/kyc/${customerId}` : `/kyb/${customerId}`;
  const nextHref =
    kind === "kyc" ? `/kyc/${customerId}/start-verification` : `/kyb/${customerId}/start-verification`;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AccountPurposeFormValues>({
    defaultValues: query.data,
  });

  useEffect(() => {
    if (query.data) {
      reset(query.data);
    }
  }, [query.data, reset]);

  const selectedChannels = watch("expectedChannels") ?? [];

  const onSubmit = async (values: AccountPurposeFormValues) => {
    try {
      await save.mutateAsync(values);
      toastSuccess("Account purpose saved");
      router.push(nextHref);
    } catch (error) {
      toastError(error, "Could not save account purpose");
    }
  };

  if (query.isLoading) {
    return <PageLoadingSkeleton variant="generic" />;
  }

  if (query.isError) {
    return (
      <PageErrorState
        title="Could not load account purpose"
        description={getErrorMessage(query.error, "Please try again.")}
        onRetry={() => {
          void query.refetch();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <KycLookupBackHeader
        backHref={detailHref}
        breadcrumb={`${prefix} / Account purpose`}
      />

      <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-6 shadow-sm">
        <form id="account-purpose-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">Account purpose</h2>
            <p className="mt-1 text-sm text-[color:var(--text-muted)]">
              Declare why this account will be used and where funds come from. This step is not in
              Figma — it matches the Core Platform account-purpose contract.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SettingsSelect
              label="Account purpose"
              options={accountPurposeOptions}
              error={errors.purpose?.message}
              {...register("purpose", { required: "Account purpose is required" })}
            />
            <SettingsSelect
              label="Source of funds"
              options={sourceOfFundsOptions}
              error={errors.sourceOfFunds?.message}
              {...register("sourceOfFunds", { required: "Source of funds is required" })}
            />
            <SettingsField
              label="Purpose detail"
              error={errors.purposeDetail?.message}
              {...register("purposeDetail")}
            />
            <SettingsField
              label="Source of wealth"
              error={errors.sourceOfWealth?.message}
              {...register("sourceOfWealth")}
            />
            <SettingsField
              label="Expected monthly transactions"
              type="number"
              error={errors.expectedMonthlyTransactions?.message}
              {...register("expectedMonthlyTransactions")}
            />
            <SettingsField
              label="Expected monthly value"
              type="number"
              error={errors.expectedMonthlyValue?.message}
              {...register("expectedMonthlyValue")}
            />
            <SettingsField
              label="Expected single transaction value"
              type="number"
              error={errors.expectedSingleTransactionValue?.message}
              {...register("expectedSingleTransactionValue")}
            />
            <SettingsField
              label="Currency"
              placeholder="NGN"
              error={errors.currency?.message}
              {...register("currency")}
            />
            <SettingsField
              label="Expected corridors"
              placeholder="NG, GB"
              error={errors.expectedCorridors?.message}
              {...register("expectedCorridors")}
            />
            <SettingsField
              label="Anticipated counterparties"
              error={errors.anticipatedCounterparties?.message}
              {...register("anticipatedCounterparties")}
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-[color:var(--text-primary)]">
              Expected channels
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {expectedChannelOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[color:var(--border-default)] px-4 py-3 text-sm text-[color:var(--text-primary)]"
                >
                  <input
                    type="checkbox"
                    checked={selectedChannels.includes(option.value)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selectedChannels, option.value]
                        : selectedChannels.filter((channel) => channel !== option.value);
                      setValue("expectedChannels", next);
                    }}
                    className="rounded border-[color:var(--border-default)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        </form>
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
          type="submit"
          form="account-purpose-form"
          disabled={save.isPending}
          className={cn(
            "rounded-lg bg-[color:var(--accent-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[color:var(--accent-primary-hover)]",
            save.isPending && "opacity-60",
          )}
        >
          {save.isPending ? "Saving..." : "Save and continue"}
        </button>
      </div>
    </div>
  );
}
