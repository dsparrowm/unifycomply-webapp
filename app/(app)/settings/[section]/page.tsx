import { redirect } from "next/navigation";
import { SettingsSectionPlaceholder } from "@/components/settings/SettingsSectionPlaceholder";
import { getSettingsSectionTitle, settingsSectionIds } from "@/lib/constants/settings-nav";

type SettingsSectionPageProps = {
  params: Promise<{ section: string }>;
};

export default async function SettingsSectionPage({ params }: SettingsSectionPageProps) {
  const { section } = await params;

  if (!settingsSectionIds.includes(section) || section === "profile") {
    redirect("/settings");
  }

  const title = getSettingsSectionTitle(section);

  return <SettingsSectionPlaceholder title={title} />;
}
