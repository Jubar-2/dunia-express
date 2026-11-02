"use client";

import * as React from "react";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
} from "lucide-react";
import type { KpiMetric } from "../_types/dashboard.types";

export interface DashboardMetricsProps {
  metrics: KpiMetric[];
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const isPositive = metric.change >= 0;

        return (
          <div
            key={metric.id}
            className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4.5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">
                {metric.title}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                {renderMetricIcon(metric.iconName)}
              </div>
            </div>

            {/* Value */}
            <div className="mt-3">
              <div className="text-[24px] font-bold tracking-tight text-neutral-900">
                {metric.value}
              </div>
            </div>

            {/* Bottom row: Trend badge & period */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? `+${metric.change}%` : `${metric.change}%`}
              </span>
              <span className="text-[11px] text-neutral-400">
                {metric.periodLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderMetricIcon(iconName: KpiMetric["iconName"]) {
  switch (iconName) {
    case "revenue":
      return <DollarSign className="h-4 w-4 text-emerald-600" />;
    case "orders":
      return <ShoppingBag className="h-4 w-4 text-neutral-700" />;
    case "aov":
      return <CreditCard className="h-4 w-4 text-blue-600" />;
    case "sessions":
      return <Users className="h-4 w-4 text-violet-600" />;
  }
}
