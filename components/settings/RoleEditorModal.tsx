"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import { getErrorMessage } from "@/lib/api/errors";
import type { ApiPermissionOption } from "@/lib/api/types";
import type { SettingsRole } from "@/types/settings";
import { cn } from "@/lib/utils";

export type RoleEditorValues = {
  name: string;
  riskLevelMinimum: number;
  riskLevelMaximum: number;
  permissions: string[];
  department?: string;
  description?: string;
};

type RoleEditorModalProps = {
  open: boolean;
  mode: "create" | "edit";
  role: SettingsRole | null;
  permissionOptions: ApiPermissionOption[];
  onClose: () => void;
  onSubmit: (values: RoleEditorValues) => Promise<void>;
};

export function RoleEditorModal({
  open,
  mode,
  role,
  permissionOptions,
  onClose,
  onSubmit,
}: RoleEditorModalProps) {
  const [name, setName] = useState("");
  const [riskLevelMinimum, setRiskLevelMinimum] = useState(0);
  const [riskLevelMaximum, setRiskLevelMaximum] = useState(1);
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && role) {
      setName(role.name);
      setRiskLevelMinimum(role.riskLevelMinimum);
      setRiskLevelMaximum(role.riskLevelMaximum);
      setDepartment(role.department ?? "");
      setDescription(role.description ?? "");
      setSelectedPermissions(
        role.permissions.filter((permission) => permission.enabled).map((permission) => permission.id),
      );
    } else {
      setName("");
      setRiskLevelMinimum(0);
      setRiskLevelMaximum(1);
      setDepartment("");
      setDescription("");
      setSelectedPermissions([]);
    }
    setFormError(null);
  }, [open, mode, role]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const title = mode === "edit" ? "Edit Role" : "Create a Role";
  const submitLabel = mode === "edit" ? "Save Changes" : "Create Role";

  const riskError = useMemo(() => {
    if (riskLevelMinimum > riskLevelMaximum) {
      return "Minimum risk level cannot exceed maximum";
    }
    return null;
  }, [riskLevelMinimum, riskLevelMaximum]);

  const togglePermission = (value: string, checked: boolean) => {
    setSelectedPermissions((current) =>
      checked ? [...new Set([...current, value])] : current.filter((item) => item !== value),
    );
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError("Role name is required");
      return;
    }
    if (riskError) {
      setFormError(riskError);
      return;
    }
    if (selectedPermissions.length === 0) {
      setFormError("Select at least one permission");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        riskLevelMinimum,
        riskLevelMaximum,
        permissions: selectedPermissions,
        department: department.trim() || undefined,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not save role"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-[color:var(--text-primary)]/20 backdrop-blur-[2px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-editor-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-5 py-5">
          <h2
            id="role-editor-title"
            className="text-xl font-medium text-[color:var(--text-primary)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-[color:var(--text-light)] hover:bg-[color:var(--bg-muted)] hover:text-[color:var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto px-5 py-6">
          <SettingsField
            label="Role name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Compliance Officer"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="risk-min"
                className="text-sm font-medium text-[color:var(--text-primary)]"
              >
                Risk level minimum
              </label>
              <input
                id="risk-min"
                type="number"
                min={0}
                max={4}
                value={riskLevelMinimum}
                onChange={(event) => setRiskLevelMinimum(Number(event.target.value))}
                className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="risk-max"
                className="text-sm font-medium text-[color:var(--text-primary)]"
              >
                Risk level maximum
              </label>
              <input
                id="risk-max"
                type="number"
                min={0}
                max={4}
                value={riskLevelMaximum}
                onChange={(event) => setRiskLevelMaximum(Number(event.target.value))}
                className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
              />
            </div>
          </div>

          <SettingsField
            label="Department (optional)"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            placeholder="e.g. Risk & Compliance"
          />

          <div className="space-y-1.5">
            <label
              htmlFor="role-description"
              className="text-sm font-medium text-[color:var(--text-primary)]"
            >
              Description (optional)
            </label>
            <textarea
              id="role-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this role can do"
              className="w-full rounded-lg border border-[color:var(--border-default)] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[color:var(--accent-primary-hover)] focus:ring-2 focus:ring-[color:var(--accent-primary-soft)]"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[color:var(--text-primary)]">Permissions</p>
            <div className="space-y-3">
              {permissionOptions.map((option) => {
                const checked = selectedPermissions.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className="rounded-lg border border-[color:var(--border-default)] px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[color:var(--text-primary)]">
                          {option.label}
                        </p>
                        <p className="mt-1 text-xs text-[color:var(--text-light)]">
                          {option.description}
                        </p>
                      </div>
                      <SettingsToggle
                        checked={checked}
                        onChange={(next) => togglePermission(option.value, next)}
                        label={option.label}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {formError || riskError ? (
            <p className="text-sm text-[color:var(--state-error)]" role="alert">
              {formError ?? riskError}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 border-t border-[color:var(--border-default)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[color:var(--border-default)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-muted)]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
            className={cn(
              "rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[color:var(--accent-primary)] disabled:opacity-60",
            )}
          >
            {isSubmitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
