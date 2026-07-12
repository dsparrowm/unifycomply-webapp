"use client";

import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/feedback/EmptyState";

type RoutePlaceholderPanelProps = {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
};

export function RoutePlaceholderPanel({
  title,
  subtitle,
  description,
  icon,
}: RoutePlaceholderPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">{title}</h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">{subtitle}</p>
      </div>

      <EmptyState icon={icon} title={`${title} coming soon`} description={description} />
    </div>
  );
}
