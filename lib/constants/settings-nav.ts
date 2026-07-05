import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Building2,
  ClipboardCheck,
  FileText,
  Lock,
  Shield,
  User,
  UserCheck,
  Users,
} from "lucide-react";

export type SettingsNavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

export type SettingsNavGroup = {
  title: string;
  items: SettingsNavItem[];
};

export const settingsNavGroups: SettingsNavGroup[] = [
  {
    title: "Profile Management",
    items: [
      { id: "profile", label: "Profile Management", href: "/settings", icon: User },
      {
        id: "business-information",
        label: "Business Information",
        href: "/settings/business-information",
        icon: Building2,
      },
      { id: "teams", label: "Teams", href: "/settings/teams", icon: Users },
      {
        id: "roles-and-permission",
        label: "Roles and Permission",
        href: "/settings/roles-and-permission",
        icon: Shield,
      },
      { id: "security", label: "Security", href: "/settings/security", icon: Lock },
      { id: "audit-logs", label: "Audit Logs", href: "/settings/audit-logs", icon: FileText },
    ],
  },
  {
    title: "Compliance Configuration",
    items: [
      { id: "approvals", label: "Approvals", href: "/settings/approvals", icon: ClipboardCheck },
      { id: "pep-settings", label: "PEP Settings", href: "/settings/pep-settings", icon: UserCheck },
      { id: "notification", label: "Notification", href: "/settings/notification", icon: Bell },
      {
        id: "compliance-rules",
        label: "Compliance Rules",
        href: "/settings/compliance-rules",
        icon: Shield,
      },
    ],
  },
];

export const settingsSectionIds = settingsNavGroups.flatMap((group) =>
  group.items.map((item) => item.id),
);

export function getSettingsSectionTitle(sectionId: string): string {
  for (const group of settingsNavGroups) {
    const item = group.items.find((entry) => entry.id === sectionId);
    if (item) {
      return item.label;
    }
  }

  return "Settings";
}
