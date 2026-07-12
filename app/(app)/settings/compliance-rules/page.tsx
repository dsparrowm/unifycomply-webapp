import { ComplianceRulesPanel } from "@/components/settings/ComplianceRulesPanel";
import { settingsComplianceRulesData } from "@/lib/data/settings";

export default function ComplianceRulesPage() {
  return <ComplianceRulesPanel complianceRules={settingsComplianceRulesData} />;
}
