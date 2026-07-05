import type { Milestone } from "@/lib/constants/milestones";
import type { SidebarIconKey } from "@/lib/constants/sidebar-icons";

export type NavItem = {
  label: string;
  href?: string;
  milestone: Milestone;
  icon: SidebarIconKey;
};

export type NavSection = {
  title?: string;
  items: NavItem[];
};

export const appNavigation: NavSection[] = [
  {
    items: [{ label: "Overview", href: "/overview", milestone: 1, icon: "overview" }],
  },
  {
    title: "CUSTOMER",
    items: [
      { label: "KYC", href: "/kyc", milestone: 2, icon: "kyc" },
      { label: "KYB", href: "/kyb", milestone: 2, icon: "kyb" },
    ],
  },
  {
    title: "BACKGROUND CHECK",
    items: [
      { label: "Bank Analysis", href: "/bank-analysis", milestone: 2, icon: "bank-analysis" },
      { label: "Packages", href: "/packages", milestone: 2, icon: "packages" },
      { label: "Request", href: "/request", milestone: 2, icon: "request" },
    ],
  },
  {
    title: "FRAUD MONITORING",
    items: [{ label: "AML Screening", href: "/aml-screening", milestone: 2, icon: "aml-screening" }],
  },
  {
    title: "TRANSACTION MONITORING",
    items: [
      {
        label: "Overview",
        href: "/transaction-monitoring",
        milestone: 3,
        icon: "tm-overview",
      },
      { label: "Transactions", href: "/transactions", milestone: 3, icon: "transactions" },
      { label: "TM Not-Blocked", href: "/tm-not-blocked", milestone: 3, icon: "tm-not-blocked" },
      { label: "Stop Payment", href: "/stop-payment", milestone: 3, icon: "stop-payment" },
      {
        label: "Cumulative Frequency",
        href: "/cumulative-frequency",
        milestone: 3,
        icon: "cumulative-frequency",
      },
      { label: "TM Blocked", href: "/tm-blocked", milestone: 3, icon: "tm-blocked" },
    ],
  },
  {
    title: "COMPLIANCE",
    items: [
      { label: "SAR Report", href: "/sar", milestone: 4, icon: "sar-report" },
      { label: "PND Watchlist", href: "/pnd-watchlist", milestone: 4, icon: "pnd-watchlist" },
      { label: "Rules", href: "/rules", milestone: 4, icon: "rules" },
      { label: "Risk Score", href: "/risk-score", milestone: 4, icon: "risk-score" },
    ],
  },
  {
    title: "SETTINGS",
    items: [{ label: "Settings", href: "/settings", milestone: 1, icon: "organization" }],
  },
  {
    title: "CHECKER WIDGET",
    items: [],
  },
  {
    title: "BILLING",
    items: [],
  },
];

export const m1Routes = appNavigation
  .flatMap((section) => section.items)
  .filter((item) => item.milestone === 1 && item.href)
  .map((item) => item.href as string);
