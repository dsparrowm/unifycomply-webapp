import { ApprovalsPanel } from "@/components/settings/ApprovalsPanel";
import { settingsApprovalsData } from "@/lib/data/settings";

export default function ApprovalsPage() {
  return <ApprovalsPanel approvals={settingsApprovalsData} />;
}
