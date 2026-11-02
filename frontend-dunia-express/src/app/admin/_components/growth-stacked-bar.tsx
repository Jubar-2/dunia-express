"use client";

import * as React from "react";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { GrowthDataPoint } from "../_types/dashboard.types";

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export interface GrowthStackedBarProps {
  monthlyData: GrowthDataPoint[];
  weeklyData: GrowthDataPoint[];
}

export function GrowthStackedBar({
  monthlyData,
  weeklyData,
}: GrowthStackedBarProps) {
  const [period, setPeriod] = React.useState<"monthly" | "weekly">("monthly");
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = React.useRef<ChartJS<"bar"> | null>(null);

  const activeData = period === "monthly" ? monthlyData : weeklyData;

  const totalPeriodRevenue = React.useMemo(() => {
    return activeData.reduce((acc, curr) => acc + curr.total, 0);
  }, [activeData]);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chartData: ChartData<"bar"> = {
      labels: activeData.map((d) => d.label),
      datasets: [
        {
          label: "Online Store",
          data: activeData.map((d) => d.onlineStore),
          backgroundColor: "#171717", // neutral-900
          hoverBackgroundColor: "#262626",
          borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 4, bottomRight: 4 },
          barThickness: period === "monthly" ? 18 : 26,
        },
        {
          label: "POS Retail",
          data: activeData.map((d) => d.posStore),
          backgroundColor: "#a3a3a3", // neutral-400
          hoverBackgroundColor: "#737373",
          borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
          barThickness: period === "monthly" ? 18 : 26,
        },
      ],
    };

    const chartOptions: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#737373",
            font: {
              size: 11,
              weight: 500,
            },
          },
        },
        y: {
          stacked: true,
          border: {
            display: false,
          },
          grid: {
            color: "#f1f5f9",
          },
          ticks: {
            color: "#737373",
            font: {
              size: 11,
            },
            callback(value) {
              const num = Number(value);
              if (num >= 1000) {
                return `$${(num / 1000).toFixed(0)}k`;
              }
              return `$${num}`;
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // Custom legend in header for tighter design
        },
        tooltip: {
          backgroundColor: "rgba(24, 24, 27, 0.95)",
          titleColor: "#ffffff",
          bodyColor: "#e4e4e7",
          padding: 10,
          cornerRadius: 8,
          boxPadding: 4,
          callbacks: {
            label(context) {
              const val = Number(context.raw).toLocaleString();
              return ` ${context.dataset.label}: $${val}`;
            },
            afterBody(items) {
              const total = items.reduce(
                (sum, item) => sum + Number(item.raw),
                0
              );
              return ` Total: $${total.toLocaleString()}`;
            },
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [activeData, period]);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Header with Title, Period Pill, and Legend */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-neutral-900">
              Business Growth & Revenue
            </h2>
            <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-semibold text-neutral-700">
              ${totalPeriodRevenue.toLocaleString()}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-neutral-500">
            Channel breakdown across Online Store and POS locations
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Custom Mini Legend */}
          <div className="hidden items-center gap-3 text-xs sm:flex">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-neutral-900" />
              <span className="text-neutral-600">Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-neutral-400" />
              <span className="text-neutral-600">POS</span>
            </div>
          </div>

          {/* Period Toggle Pill */}
          <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setPeriod("monthly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                period === "monthly"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              12 Months
            </button>
            <button
              type="button"
              onClick={() => setPeriod("weekly")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                period === "weekly"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              7 Days
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
