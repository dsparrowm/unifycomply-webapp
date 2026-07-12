import { Check } from "lucide-react";
import type { KycIpDeviceData } from "@/types/kyc";

type KycIpDevicePanelProps = {
  ipDevice: KycIpDeviceData;
};

function SummaryCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{title}</p>
      <p className="mt-4 text-4xl font-semibold leading-none text-[color:var(--accent-primary-hover)]">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium text-[color:var(--accent-primary-hover)]">{note}</p>
    </div>
  );
}

function SectionContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[color:var(--text-muted)]">
        {title}
      </h3>
      <div className="mt-4 rounded-xl bg-[color:var(--bg-muted)] px-5 py-4">{children}</div>
    </div>
  );
}

function NoMatchBadge() {
  return (
    <span className="rounded-full bg-[color:var(--state-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-success)]">
      No Match
    </span>
  );
}

function PassIcon() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--state-success)] text-white">
      <Check className="h-4 w-4" />
    </span>
  );
}

function SecurityCheckRow({ check }: { check: { label: string; detected: boolean; statusLabel: string } }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className="text-sm font-medium text-[color:var(--text-primary)]">{check.label}</p>
      {check.detected ? (
        <span className="rounded-full bg-[color:var(--state-error-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--state-error)]">
          {check.statusLabel}
        </span>
      ) : (
        <NoMatchBadge />
      )}
    </div>
  );
}

export function KycIpDevicePanel({ ipDevice }: KycIpDevicePanelProps) {
  return (
    <div className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-default)] px-6 py-5">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-primary)]">
            Ip Address and Device Information
          </h2>
          <p className="mt-1 text-sm text-[color:var(--text-muted)]">
            Anti Money Laundering compliance screening
          </p>
        </div>
        <span className="text-sm font-medium text-[color:var(--state-success)]">
          {ipDevice.clearanceStatus}
        </span>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        <SummaryCard
          title="Ip Address"
          value={ipDevice.ipAddress}
          note={ipDevice.ipAddressNote}
        />
        <SummaryCard title="Location" value={ipDevice.location} note={ipDevice.countryLabel} />
      </div>

      <div className="space-y-6 px-6 pb-6">
        <SectionContainer title="Security Checks">
          <div className="divide-y divide-[color:var(--border-default)]">
            <SecurityCheckRow check={ipDevice.vpnDetection} />
            <SecurityCheckRow check={ipDevice.proxyDetection} />
          </div>
        </SectionContainer>

        <SectionContainer title="Device Information">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                Device: {ipDevice.device.label}
              </p>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">{ipDevice.device.version}</p>
            </div>
            {ipDevice.device.status === "pass" ? <PassIcon /> : null}
          </div>
        </SectionContainer>

        <SectionContainer title="Usage Statistics">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                {ipDevice.usageStats.count}
              </p>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                {ipDevice.usageStats.deviceType}
              </p>
            </div>
            {ipDevice.usageStats.status === "pass" ? <PassIcon /> : null}
          </div>
        </SectionContainer>
      </div>
    </div>
  );
}
