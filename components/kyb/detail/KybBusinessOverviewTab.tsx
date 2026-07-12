import { KybDetailSidebar } from "@/components/kyb/detail/KybDetailSidebar";
import type { KybDetail, KybVerificationStatus } from "@/types/kyb";

type KybBusinessOverviewTabProps = {
  detail: KybDetail;
  status: KybVerificationStatus;
};

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm text-[color:var(--text-muted)]">{label}</p>
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}

export function KybBusinessOverviewTab({ detail, status }: KybBusinessOverviewTabProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,800px)_minmax(320px,503px)]">
      <div className="space-y-6">
        <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
          <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-6 py-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
              Business Information
            </h2>
            <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
              {detail.registryStatus}
            </span>
          </div>

          <div className="space-y-8 px-6 py-6">
            <div className="grid gap-8 md:grid-cols-3">
              <InfoField label="Legal Business Name" value={detail.legalBusinessName} />
              <InfoField label="Registration Number" value={detail.registrationNumber} />
              <InfoField label="Date Registered" value={detail.dateRegistered} />
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <InfoField label="Tax Identification Number (TIN)" value={detail.tin} />
              <InfoField label="Business Type" value={detail.businessType} />
              <InfoField label="Country" value={detail.country} />
            </div>

            <div className="grid gap-8 md:grid-cols-[minmax(0,175px)_1fr]">
              <div className="space-y-1.5">
                <p className="text-sm text-[color:var(--text-muted)]">Status</p>
                <span className="inline-flex items-center rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
                  {detail.registryStatus}
                </span>
              </div>
              <InfoField label="Industry" value={detail.industry} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[color:var(--text-primary)]">
            Business Address &amp; Contact
          </h3>
          <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <InfoField label="Registered Address" value={detail.registeredAddress} />
              <InfoField label="Phone Number" value={detail.phoneNumber} />
              <InfoField label="Email Address" value={detail.email} />
              <InfoField label="Website" value={detail.website} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Business Activities
          </h3>
          <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-muted)] px-6 py-4">
            <div className="flex flex-wrap gap-3">
              {detail.businessActivities.map((activity) => (
                <span
                  key={activity}
                  className="inline-flex items-center rounded-md bg-[color:var(--bg-surface)] px-3 py-1.5 text-sm text-[color:var(--text-primary)] shadow-sm"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <KybDetailSidebar detail={detail} status={status} />
    </div>
  );
}
