"use client";

import { useState } from "react";
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
import { ComplianceListRow } from "@/components/settings/ComplianceListRow";
import { RemoveComplianceItemModal } from "@/components/settings/RemoveComplianceItemModal";
import { SettingsSelect } from "@/components/settings/SettingsSelect";
import { verificationExpiryOptions } from "@/lib/data/settings";
import type { SettingsComplianceListItem, SettingsComplianceRules } from "@/types/settings";
import { cn } from "@/lib/utils";

type ComplianceRulesPanelProps = {
  complianceRules: SettingsComplianceRules;
};

type PendingRemoval = {
  item: SettingsComplianceListItem;
  list: "kycDocuments" | "kybDocuments" | "flaggedCountries";
  itemType: "document" | "country";
};

const kycDocumentIcons: Record<string, LucideIcon> = {
  "kyc-id-document": CreditCard,
  "kyc-proof-of-address": MapPin,
  "kyc-selfie": Camera,
};

const kybDocumentIcons: Record<string, LucideIcon> = {
  "kyb-certificate": FileText,
  "kyb-tax-id": Receipt,
  "kyb-business-address": Building2,
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

function AddItemButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Add flow not defined in M1"
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-sm font-medium text-[color:var(--text-light)]"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ComplianceRulesPanel({ complianceRules }: ComplianceRulesPanelProps) {
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
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const markDirty = () => setIsDirty(true);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setIsDirty(false);
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
            disabled={!isDirty || isSubmitting}
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
                {kycDocuments.map((document) => (
                  <ComplianceListRow
                    key={document.id}
                    item={document}
                    icon={getDocumentIcon(document, "kyc")}
                    onRemove={() =>
                      setPendingRemoval({
                        item: document,
                        list: "kycDocuments",
                        itemType: "document",
                      })
                    }
                  />
                ))}
                <AddItemButton label="Add document requirement" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">Business (KYB)</p>
              <div className="mt-3 space-y-3">
                {kybDocuments.map((document) => (
                  <ComplianceListRow
                    key={document.id}
                    item={document}
                    icon={getDocumentIcon(document, "kyb")}
                    onRemove={() =>
                      setPendingRemoval({
                        item: document,
                        list: "kybDocuments",
                        itemType: "document",
                      })
                    }
                  />
                ))}
                <AddItemButton label="Add document requirement" />
              </div>
            </div>
          </div>
        </ComplianceSection>

        <ComplianceSection
          title="Flagged countries"
          subtitle="Customers from these countries will receive enhanced scrutiny"
        >
          <div className="space-y-3">
            {flaggedCountries.map((country) => (
              <ComplianceListRow
                key={country.id}
                item={country}
                icon={Globe}
                onRemove={() =>
                  setPendingRemoval({
                    item: country,
                    list: "flaggedCountries",
                    itemType: "country",
                  })
                }
              />
            ))}
            <AddItemButton label="Add country" />
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
    </>
  );
}
