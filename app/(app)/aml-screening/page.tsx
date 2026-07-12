"use client";

import { ShieldCheck } from "lucide-react";
import { RoutePlaceholderPanel } from "@/components/placeholders/RoutePlaceholderPanel";

export default function AmlScreeningPage() {
  return (
    <RoutePlaceholderPanel
      title="AML Screening"
      subtitle="Anti-money laundering compliance screening"
      description="Standalone AML screening list and workflows will be added in the next M2 unit. KYC and KYB detail tabs already include AML screening panels."
      icon={ShieldCheck}
    />
  );
}
