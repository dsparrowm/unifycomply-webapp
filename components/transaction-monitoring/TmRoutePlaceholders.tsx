"use client";

import { Ban, CircleSlash2, Layers3, ListOrdered, ShieldOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RoutePlaceholderPanel } from "@/components/placeholders/RoutePlaceholderPanel";

type TmPlaceholderPageProps = {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
};

function TmPlaceholderPage({ title, subtitle, description, icon }: TmPlaceholderPageProps) {
  return (
    <RoutePlaceholderPanel
      title={title}
      subtitle={subtitle}
      description={description}
      icon={icon}
    />
  );
}

export function TransactionsPlaceholder() {
  return (
    <TmPlaceholderPage
      title="Transactions"
      subtitle="Real-time transaction explorer"
      description="Replaced by live list UI at /transactions — this placeholder is unused."
      icon={ListOrdered}
    />
  );
}

export function TmNotBlockedPlaceholder() {
  return (
    <TmPlaceholderPage
      title="TM Not-Blocked"
      subtitle="Transactions cleared for processing"
      description="Queue UI for cleared transactions will follow the Overview quick-action path."
      icon={ShieldOff}
    />
  );
}

export function StopPaymentPlaceholder() {
  return (
    <TmPlaceholderPage
      title="Stop Payment"
      subtitle="Payments halted for review"
      description="Stop-payment queue and actions will be added in a following M3 unit."
      icon={CircleSlash2}
    />
  );
}

export function CumulativeFrequencyPlaceholder() {
  return (
    <TmPlaceholderPage
      title="Cumulative Frequency"
      subtitle="High-frequency transaction monitoring"
      description="Cumulative frequency analytics and alerts will be added next."
      icon={Layers3}
    />
  );
}

export function TmBlockedPlaceholder() {
  return (
    <TmPlaceholderPage
      title="TM Blocked"
      subtitle="Transactions halted"
      description="Blocked transaction queue and release/escalate flows will be added next."
      icon={Ban}
    />
  );
}
