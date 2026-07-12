"use client";

import { useState } from "react";
import { EditPepTierModal } from "@/components/settings/EditPepTierModal";
import { PepTierCard } from "@/components/settings/PepTierCard";
import type { SettingsPepSettings, SettingsPepTier } from "@/types/settings";
import { cn } from "@/lib/utils";

type PepSettingsPanelProps = {
  pepSettings: SettingsPepSettings;
};

export function PepSettingsPanel({ pepSettings }: PepSettingsPanelProps) {
  const [tiers, setTiers] = useState<SettingsPepTier[]>(pepSettings.tiers);
  const [editingTierId, setEditingTierId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editingTier = tiers.find((tier) => tier.id === editingTierId) ?? null;

  const handleTierSave = (updatedTier: SettingsPepTier) => {
    setTiers((current) =>
      current.map((tier) => (tier.id === updatedTier.id ? updatedTier : tier)),
    );
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setIsDirty(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              PEP Tier Configuration
            </h2>
            <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
              Configure PEP classification tiers, risk scores, and approval requirements
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

        <div className="space-y-8">
          {tiers.map((tier) => (
            <PepTierCard key={tier.id} tier={tier} onEdit={() => setEditingTierId(tier.id)} />
          ))}
        </div>
      </div>

      <EditPepTierModal
        tier={editingTier}
        open={editingTier !== null}
        onClose={() => setEditingTierId(null)}
        onSave={handleTierSave}
      />
    </>
  );
}
