"use client";

import { Send } from "lucide-react";
import { RoutePlaceholderPanel } from "@/components/placeholders/RoutePlaceholderPanel";

export default function RequestPage() {
  return (
    <RoutePlaceholderPanel
      title="Request"
      subtitle="Background check requests"
      description="Request submission and tracking will be added when the background check request flow is implemented."
      icon={Send}
    />
  );
}
