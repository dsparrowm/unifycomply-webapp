import { TeamManagementPanel } from "@/components/settings/TeamManagementPanel";
import { settingsTeamMembersData } from "@/lib/data/settings";

export default function TeamsPage() {
  return <TeamManagementPanel members={settingsTeamMembersData} />;
}
