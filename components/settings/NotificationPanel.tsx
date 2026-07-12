"use client";

import { useState } from "react";
import { SettingsField } from "@/components/settings/SettingsField";
import { SettingsToggle } from "@/components/settings/SettingsToggle";
import type { SettingsNotifications } from "@/types/settings";
import { cn } from "@/lib/utils";

type NotificationPanelProps = {
  notifications: SettingsNotifications;
};

export function NotificationPanel({ notifications }: NotificationPanelProps) {
  const [webhookEnabled, setWebhookEnabled] = useState(notifications.webhookEnabled);
  const [webhookUrl, setWebhookUrl] = useState(notifications.webhookUrl);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const markDirty = () => setIsDirty(true);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setIsDirty(false);
  };

  const handleTestWebhook = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsTesting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Notification Preferences
          </h2>
          <p className="mt-0.5 text-xs text-[color:var(--text-light)]">
            Configure email, in-app, and webhook notifications for different events
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

      <section className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                Webhook Notifications
              </p>
              <p className="mt-1 text-xs text-[color:var(--text-light)]">
                Send real-time event data to your application
              </p>
            </div>
            <SettingsToggle
              checked={webhookEnabled}
              onChange={(checked) => {
                setWebhookEnabled(checked);
                markDirty();
              }}
              label="Webhook notifications"
            />
          </div>

          {webhookEnabled ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <SettingsField
                  label="Webhook URL"
                  value={webhookUrl}
                  onChange={(event) => {
                    setWebhookUrl(event.target.value);
                    markDirty();
                  }}
                  placeholder="https://api.example.com/webhooks/unifycomply"
                />
              </div>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={!webhookUrl.trim() || isTesting}
                className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-6 text-sm font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-muted)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isTesting ? "Testing…" : "Test"}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
