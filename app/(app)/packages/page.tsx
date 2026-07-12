"use client";

import { Package } from "lucide-react";
import { RoutePlaceholderPanel } from "@/components/placeholders/RoutePlaceholderPanel";

export default function PackagesPage() {
  return (
    <RoutePlaceholderPanel
      title="Packages"
      subtitle="Background check packages"
      description="Package catalog and configuration will be added when the background check packages flow is implemented."
      icon={Package}
    />
  );
}
