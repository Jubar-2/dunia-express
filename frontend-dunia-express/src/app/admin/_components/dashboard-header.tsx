"use client";

import * as React from "react";
import { Calendar, Download, RefreshCw } from "lucide-react";

export interface DashboardHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  periodLabel?: string;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  onRefresh,
  onExport,
  periodLabel = "Last 30 days",
  isRefreshing = false,
}: DashboardHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-[18px] font-semibold text-[#303030] tracking-tight">
          Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-neutral-500">
          Real-time summary of sales, orders, and fulfillment operations.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Period Selector Display */}
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs">
          <Calendar className="h-3.5 w-3.5 text-neutral-400" />
          <span>{periodLabel}</span>
        </div>

        {/* Refresh Action */}
        <button
          type="button"
          onClick={onRefresh}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          title="Refresh dashboard data"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-neutral-900" : ""}`}
          />
        </button>

        {/* Export Action */}
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-xs hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-neutral-500" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
