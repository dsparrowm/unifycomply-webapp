"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Camera,
  CreditCard,
  FileText,
  Globe,
  MapPin,
  Plus,
  Receipt,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddComplianceItemModal } from "@/components/settings/AddComplianceItemModal";
import { ComplianceListRow } from "@/components/settings/ComplianceListRow";
import { RemoveComplianceItemModal } from "@/components/settings/RemoveComplianceItemModal";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import type { ComplianceRuleOption } from "@/lib/constants/compliance-rule-options";
import { verificationExpiryOptions } from "@/lib/data/settings";
import { useComplianceRuleOptions } from "@/lib/hooks/use-compliance-rule-options";
import type { SettingsComplianceListItem, SettingsComplianceRules } from "@/types/settings";
import { useRbac } from "@/lib/hooks/use-rbac";
import { cn } from "@/lib/utils";

type ComplianceRulesPanelProps = {
  complianceRules: SettingsComplianceRules;
  onSave?: (input: {
    kycExpiryMonths: number;
    kybExpiryMonths: number;
    kycDocuments: string[];
    kybDocuments: string[];
    flaggedCountryCodes: string[];
  }) => Promise<void>;
};

type ComplianceListKey = "kycDocuments" | "kybDocuments" | "flaggedCountries";

type PendingRemoval = {
  item: SettingsComplianceListItem;
  list: ComplianceListKey;
  itemType: "document" | "country";
};

type PendingAdd = {
  list: ComplianceListKey;
  itemType: "document" | "country";
};

const kycDocumentIcons: Record<string, LucideIcon> = {
  "id-document": CreditCard,
  "kyc-id-document": CreditCard,
  "proof-of-address": MapPin,
  "kyc-proof-of-address": MapPin,
  "liveness-check": Camera,
  "kyc-selfie": Camera,
};

const kybDocumentIcons: Record<string, LucideIcon> = {
  "certificate-of-incorporation": FileText,
  "kyb-certificate": FileText,
  "tax-identity": Receipt,
  "kyb-tax-id": Receipt,
  "proof-of-business-address": Building2,
  "kyb-business-address": Building2,
  "directors-id": Users,
  "kyb-directors-id": Users,
};

function getDocumentIcon(item: SettingsComplianceListItem, list: "kyc" | "kyb"): LucideIcon {
  if (list === "kyc") {
    return kycDocumentIcons[item.id] ?? FileText;
  }

  return kybDocumentIcons[item.id] ?? FileText;
}

type ComplianceSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function ComplianceSection({ title, subtitle, children }: ComplianceSectionProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)]">
      <div className="border-b border-[color:var(--border-default)] px-5 py-4">
        <h3 className="text-sm font-medium text-[color:var(--text-primary)]">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-xs text-[color:var(--text-light)]">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function AddItemButton({
  label,
  disabled,
  title,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  title?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-sm font-medium text-[color:var(--text-light)] transition-colors hover:bg-[color:var(--bg-muted)] disabled:cursor-not-allowed disabled:hover:bg-[color:var(--bg-surface)]"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

function remainingOptions(catalog: ComplianceRuleOption[], selected: SettingsComplianceListItem[]) {
  const taken = new Set(selected.map((item) => item.id));
  return catalog.filter((option) => !taken.has(option.value));
}

function labelFromCatalog(item: SettingsComplianceListItem, catalog: ComplianceRuleOption[]) {
  return catalog.find((option) => option.value === item.id)?.label ?? item.label;
}

export function ComplianceRulesPanel({ complianceRules, onSave }: ComplianceRulesPanelProps) {
  const { canPerform } = useRbac();
  const settingsLocked = !canPerform("tenant-settings:update");
  const [kycExpiryMonths, setKycExpiryMonths] = useState(
    complianceRules.verificationExpiry.kycExpiryMonths,
  );
  const [kybExpiryMonths, setKybExpiryMonths] = useState(
    complianceRules.verificationExpiry.kybExpiryMonths,
  );
  const [kycDocuments, setKycDocuments] = useState(complianceRules.kycDocuments);
  const [kybDocuments, setKybDocuments] = useState(complianceRules.kybDocuments);
  const [flaggedCountries, setFlaggedCountries] = useState(complianceRules.flaggedCountries);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const catalog = useComplianceRuleOptions();

  const markDirty = () => setIsDirty(true);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (onSave) {
        await onSave({
          kycExpiryMonths: Number(kycExpiryMonths),
          kybExpiryMonths: Number(kybExpiryMonths),
          kycDocuments: kycDocuments.map((item) => item.id),
          kybDocuments: kybDocuments.map((item) => item.id),
          flaggedCountryCodes: flaggedCountries.map((item) => item.id),
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      setIsDirty(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmRemoval = () => {
    if (!pendingRemoval) {
      return;
    }

    const removeFromList = (items: SettingsComplianceListItem[]) =>
      items.filter((item) => item.id !== pendingRemoval.item.id);

    if (pendingRemoval.list === "kycDocuments") {
      setKycDocuments(removeFromList);
    } else if (pendingRemoval.list === "kybDocuments") {
      setKybDocuments(removeFromList);
    } else {
      setFlaggedCountries(removeFromList);
    }

    markDirty();
    setPendingRemoval(null);
  };

  const handleConfirmAdd = (option: ComplianceRuleOption) => {
    if (!pendingAdd) {
      return;
    }

    const item = { id: option.value, label: option.label };
    const append = (items: SettingsComplianceListItem[]) =>
      items.some((existing) => existing.id === item.id) ? items : [...items, item];

    if (pendingAdd.list === "kycDocuments") {
      setKycDocuments(append);
    } else if (pendingAdd.list === "kybDocuments") {
      setKybDocuments(append);
    } else {
      setFlaggedCountries(append);
    }

    markDirty();
    setPendingAdd(null);
  };

  const availableKycDocuments = useMemo(
    () => remainingOptions(catalog.kycDocuments, kycDocuments),
    [catalog.kycDocuments, kycDocuments],
  );
  const availableKybDocuments = useMemo(
    () => remainingOptions(catalog.kybDocuments, kybDocuments),
    [catalog.kybDocuments, kybDocuments],
  );
  const availableCountries = useMemo(
    () => remainingOptions(catalog.countries, flaggedCountries),
    [catalog.countries, flaggedCountries],
  );

  const addCatalog =
    pendingAdd?.list === "kycDocuments"
      ? availableKycDocuments
      : pendingAdd?.list === "kybDocuments"
        ? availableKybDocuments
        : availableCountries;

  const addCopy =
    pendingAdd?.itemType === "country"
      ? {
          title: "Add Flagged Country",
          description: "Customers from this country will receive enhanced scrutiny.",
          fieldLabel: "Country",
          emptyMessage: "Every country is already flagged.",
          error: catalog.countriesError ? "Could not load countries." : null,
          isLoading: catalog.countriesLoading,
        }
      : {
          title: "Add Document Requirement",
          description: "Choose a document customers must provide.",
          fieldLabel: "Document",
          emptyMessage: "Every document requirement is already on this list.",
          error: null,
          isLoading: false,
        };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              Compliance Rules
            </h2>
            <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
              Configure regional compliance settings, document requirements, and verification
              timeframes
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSubmitting || settingsLocked}
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2.5 text-xs font-medium transition-colors",
              isDirty
                ? "bg-[color:var(--accent-primary-hover)] text-white hover:bg-[color:var(--accent-primary)]"
                : "cursor-not-allowed bg-[color:var(--border-subtle)] text-[color:var(--text-light)]",
            )}
          >
            Save Changes
          </button>
        </div>

        <ComplianceSection title="Verification Expiry Rules">
          <div className="grid gap-4 sm:grid-cols-2">
            <SettingsSelect
              label="KYC Verification Expiry"
              options={verificationExpiryOptions}
              value={kycExpiryMonths}
              onChange={(event) => {
                setKycExpiryMonths(event.target.value);
                markDirty();
              }}
            />
            <SettingsSelect
              label="KYB Verification Expiry"
              options={verificationExpiryOptions}
              value={kybExpiryMonths}
              onChange={(event) => {
                setKybExpiryMonths(event.target.value);
                markDirty();
              }}
            />
          </div>
        </ComplianceSection>

        <ComplianceSection title="Required Documents">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                Individual (KYC)
              </p>
              <div className="mt-3 space-y-3">
                {kycDocuments.map((document) => {
                  const item = {
                    ...document,
                    label: labelFromCatalog(document, catalog.kycDocuments),
                  };
                  return (
                    <ComplianceListRow
                      key={document.id}
                      item={item}
                      icon={getDocumentIcon(document, "kyc")}
                      onRemove={() =>
                        setPendingRemoval({
                          item,
                          list: "kycDocuments",
                          itemType: "document",
                        })
                      }
                    />
                  );
                })}
                <AddItemButton
                  label="Add document requirement"
                  disabled={settingsLocked || availableKycDocuments.length === 0}
                  title={
                    settingsLocked
                      ? "You do not have permission to update compliance rules"
                      : availableKycDocuments.length === 0
                        ? "Every document requirement is already on this list"
                        : undefined
                  }
                  onClick={() => setPendingAdd({ list: "kycDocuments", itemType: "document" })}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">Business (KYB)</p>
              <div className="mt-3 space-y-3">
                {kybDocuments.map((document) => {
                  const item = {
                    ...document,
                    label: labelFromCatalog(document, catalog.kybDocuments),
                  };
                  return (
                    <ComplianceListRow
                      key={document.id}
                      item={item}
                      icon={getDocumentIcon(document, "kyb")}
                      onRemove={() =>
                        setPendingRemoval({
                          item,
                          list: "kybDocuments",
                          itemType: "document",
                        })
                      }
                    />
                  );
                })}
                <AddItemButton
                  label="Add document requirement"
                  disabled={settingsLocked || availableKybDocuments.length === 0}
                  title={
                    settingsLocked
                      ? "You do not have permission to update compliance rules"
                      : availableKybDocuments.length === 0
                        ? "Every document requirement is already on this list"
                        : undefined
                  }
                  onClick={() => setPendingAdd({ list: "kybDocuments", itemType: "document" })}
                />
              </div>
            </div>
          </div>
        </ComplianceSection>

        <ComplianceSection
          title="Flagged countries"
          subtitle="Customers from these countries will receive enhanced scrutiny"
        >
          <div className="space-y-3">
            {flaggedCountries.map((country) => {
              const item = {
                ...country,
                label: labelFromCatalog(country, catalog.countries),
              };
              return (
                <ComplianceListRow
                  key={country.id}
                  item={item}
                  icon={Globe}
                  onRemove={() =>
                    setPendingRemoval({
                      item,
                      list: "flaggedCountries",
                      itemType: "country",
                    })
                  }
                />
              );
            })}
            <AddItemButton
              label="Add country"
              disabled={
                settingsLocked ||
                catalog.countriesLoading ||
                catalog.countriesError ||
                availableCountries.length === 0
              }
              title={
                settingsLocked
                  ? "You do not have permission to update compliance rules"
                  : catalog.countriesError
                    ? "Could not load countries"
                    : availableCountries.length === 0 && !catalog.countriesLoading
                      ? "Every country is already flagged"
                      : undefined
              }
              onClick={() => setPendingAdd({ list: "flaggedCountries", itemType: "country" })}
            />
          </div>
        </ComplianceSection>
      </div>

      <RemoveComplianceItemModal
        open={pendingRemoval !== null}
        itemLabel={pendingRemoval?.item.label ?? ""}
        itemType={pendingRemoval?.itemType ?? "document"}
        onClose={() => setPendingRemoval(null)}
        onConfirm={handleConfirmRemoval}
      />
      <AddComplianceItemModal
        open={pendingAdd !== null}
        title={addCopy.title}
        description={addCopy.description}
        fieldLabel={addCopy.fieldLabel}
        options={addCatalog}
        emptyMessage={addCopy.emptyMessage}
        isLoading={addCopy.isLoading}
        error={addCopy.error}
        onClose={() => setPendingAdd(null)}
        onConfirm={handleConfirmAdd}
      />
    </>
  );
}
