import { AmlSearchResultsPanel } from "@/components/aml-screening/search-results/AmlSearchResultsPanel";
import { amlSearchResultsData } from "@/lib/data/aml-search-results";

export default function AmlSearchResultsPage() {
  return <AmlSearchResultsPanel data={amlSearchResultsData} />;
}
