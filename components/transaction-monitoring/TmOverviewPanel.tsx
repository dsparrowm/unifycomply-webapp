"use client";

import Link from "next/link";
import {
  Ban,
  CircleSlash2,
  Layers3,
  Settings2,
  ShieldOff,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type {
  TmActivityPoint,
  TmCategoryItem,
  TmMetric,
  TmOverviewData,
  TmQuickAction,
  TmQuickActionId,
  TmRiskDistribution,
  TmVolumePoint,
} from "@/types/transaction-monitoring";
import { cn } from "@/lib/utils";

const quickActionIcons: Record<TmQuickActionId, LucideIcon> = {
  "tm-not-blocked": ShieldOff,
  "cumulative-frequency": Layers3,
  "stop-payment": CircleSlash2,
  "tm-blocked": Ban,
};

const quickActionIconTones: Record<TmQuickActionId, string> = {
  "tm-not-blocked": "bg-[color:var(--state-success-soft)] text-[color:var(--state-success)]",
  "cumulative-frequency": "bg-[color:var(--state-info-soft)] text-[color:var(--state-info)]",
  "stop-payment": "bg-[color:var(--state-warning-soft)] text-[color:var(--state-warning)]",
  "tm-blocked": "bg-[color:var(--state-error-soft)] text-[color:var(--state-error)]",
};

type TmOverviewPanelProps = {
  data: TmOverviewData;
};

export function TmOverviewPanel({ data }: TmOverviewPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <TmOverviewHeader />
      <TmQuickActions actions={data.quickActions} />
      <TmMetricCards metrics={data.metrics} />
      <div className="grid gap-4 xl:grid-cols-2">
        <TmActivityChart points={data.activity24h} />
        <TmCategoryCard categories={data.categories} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <TmVolumeChart points={data.volumeSeries} />
        <TmRiskDistributionCard distribution={data.riskDistribution} />
      </div>
    </div>
  );
}

function TmOverviewHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">
          Transaction Monitoring
        </h1>
        <p className="mt-0.5 text-sm text-[color:var(--text-muted)]">
          Real-time fraud detection and risk analysis dashboard.
        </p>
      </div>
      <button
        type="button"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[color:var(--accent-primary-hover)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--accent-primary)]"
      >
        <Settings2 className="h-4 w-4" />
        Configure
      </button>
    </div>
  );
}

function TmQuickActions({ actions }: { actions: TmQuickAction[] }) {
  return (
    <section className="rounded-xl bg-[color:var(--accent-primary)] p-5 shadow-sm">
      <div className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-sm font-medium uppercase tracking-wide text-white">Quick Actions</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = quickActionIcons[action.id];
          return (
            <Link
              key={action.id}
              href={action.href}
              className="rounded-xl bg-[color:var(--bg-surface)] p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    quickActionIconTones[action.id],
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase text-[color:var(--text-primary)]">
                    {action.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-5 text-[color:var(--text-muted)]">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function TmMetricCards({ metrics }: { metrics: TmMetric[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--text-muted)]">
            {metric.label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-[color:var(--text-primary)]">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function TmActivityChart({ points }: { points: TmActivityPoint[] }) {
  const width = 640;
  const height = 220;
  const max = Math.max(1000, ...points.map((point) => point.count));
  const lastIndex = Math.max(points.length - 1, 1);
  const path = points
    .map((point, index) => {
      const x = (index / lastIndex) * width;
      const y = height - (point.count / max) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  const yTicks = [1000, 750, 500, 250, 0];

  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">
        24-HOUR ACTIVITY PATTERN
      </h2>
      <div className="mt-4 flex gap-3">
        <div className="flex flex-col justify-between py-1 text-[10px] text-[color:var(--text-light)]">
          {yTicks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full" role="img" aria-label="24-hour activity">
            {yTicks.map((tick) => {
              const y = height - (tick / max) * height;
              return (
                <line
                  key={tick}
                  x1={0}
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth={1}
                />
              );
            })}
            <path d={path} fill="none" stroke="var(--accent-primary-hover)" strokeWidth={2.5} />
          </svg>
          <div className="mt-2 flex justify-between text-[10px] text-[color:var(--text-light)]">
            {points.map((point) => (
              <span key={point.hour}>{point.hour}</span>
            ))}
          </div>
          <p className="mt-1 text-center text-[10px] uppercase tracking-wide text-[color:var(--text-muted)]">
            Time
          </p>
        </div>
      </div>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-[color:var(--text-muted)]">
        Transaction count
      </p>
    </section>
  );
}

function TmCategoryCard({ categories }: { categories: TmCategoryItem[] }) {
  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">TM CATEGORY</h2>
        <Link
          href="/transactions"
          className="text-sm font-medium text-[color:var(--accent-primary-hover)] hover:underline"
        >
          View Logs
        </Link>
      </div>
      <ul className="mt-5 space-y-5">
        {categories.map((category) => (
          <li key={category.id}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-[color:var(--text-primary)]">{category.label}</span>
              <span className="font-medium text-[color:var(--text-muted)]">{category.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--bg-muted)]">
              <div
                className="h-full rounded-full bg-[color:var(--accent-primary-hover)]"
                style={{ width: `${Math.min(100, Math.max(0, category.progress))}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TmVolumeChart({ points }: { points: TmVolumePoint[] }) {
  const width = 720;
  const height = 200;
  const max = Math.max(1, ...points.map((point) => point.volume));
  const lastIndex = Math.max(points.length - 1, 1);
  const path = points
    .map((point, index) => {
      const x = (index / lastIndex) * width;
      const y = height - (point.volume / max) * height;
      return `${index === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">TOTAL VOLUME</h2>
        <label className="inline-flex items-center gap-2 text-sm text-[color:var(--text-muted)]">
          <span className="sr-only">Volume timeframe</span>
          <select
            defaultValue="30d"
            className="rounded-lg border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] px-3 py-1.5 text-sm text-[color:var(--text-primary)]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </label>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-6 h-44 w-full"
        role="img"
        aria-label="Total volume over time"
      >
        <line x1={0} y1={height} x2={width} y2={height} stroke="var(--border-subtle)" />
        <path d={path} fill="none" stroke="var(--accent-primary-hover)" strokeWidth={2.5} />
      </svg>
    </section>
  );
}

function TmRiskDistributionCard({ distribution }: { distribution: TmRiskDistribution }) {
  const rows = [
    { id: "low", label: "Low", value: distribution.low, tone: "bg-[color:var(--state-success)]" },
    {
      id: "medium",
      label: "Medium",
      value: distribution.medium,
      tone: "bg-[color:var(--state-warning)]",
    },
    { id: "high", label: "High", value: distribution.high, tone: "bg-[color:var(--state-error)]" },
  ] as const;

  return (
    <section className="rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[color:var(--text-primary)]">RISK DISTRIBUTION</h2>
      <p className="mt-1 text-sm text-[color:var(--text-muted)]">Transaction by risk level</p>
      <ul className="mt-8 space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-[color:var(--text-primary)]">
              <span className={cn("h-2.5 w-2.5 rounded-full", row.tone)} />
              {row.label}
            </span>
            <span className="font-medium text-[color:var(--text-muted)]">
              {row.value.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
