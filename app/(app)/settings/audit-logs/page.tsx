import { AuditLogsPanel } from "@/components/settings/AuditLogsPanel";
import { settingsAuditLogsData } from "@/lib/data/settings";

export default function AuditLogsPage() {
  return <AuditLogsPanel entries={settingsAuditLogsData} />;
}
