import { AmlSearchInfoSidebar } from "@/components/aml/lookup/AmlSearchInfoSidebar";
import type { AmlSearchInformation } from "@/types/aml";

type AmlCaseSearchSidebarProps = {
  information: AmlSearchInformation;
};

export function AmlCaseSearchSidebar({ information }: AmlCaseSearchSidebarProps) {
  return (
    <aside className="w-full shrink-0 overflow-hidden rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] xl:w-[320px]">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
          Search Information
        </h2>
        {!information.photoSrc && information.matchSuccessful ? (
          <span className="rounded-md bg-[color:var(--accent-primary)] px-2 py-1 text-[11px] font-medium text-white">
            Match Successful
          </span>
        ) : null}
      </div>
      <AmlSearchInfoSidebar information={information} />
    </aside>
  );
}
