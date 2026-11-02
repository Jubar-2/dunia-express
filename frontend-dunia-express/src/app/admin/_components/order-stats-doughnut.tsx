"use client";

import * as React from "react";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import type { OrderStatusBreakdown } from "../_types/dashboard.types";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

export interface OrderStatsDoughnutProps {
  data: OrderStatusBreakdown;
}

export function OrderStatsDoughnut({ data }: OrderStatsDoughnutProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = React.useRef<ChartJS<"doughnut"> | null>(null);

  const deliveredPct = ((data.delivered / data.total) * 100).toFixed(1);
  const inProcessPct = ((data.inProcess / data.total) * 100).toFixed(1);
  const cancelledPct = ((data.cancelled / data.total) * 100).toFixed(1);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chartData: ChartData<"doughnut"> = {
      labels: ["Delivered / Success", "In Process", "Cancelled"],
      datasets: [
        {
          data: [data.delivered, data.inProcess, data.cancelled],
          backgroundColor: [
            "#10b981", // emerald-500
            "#3b82f6", // blue-500
            "#f43f5e", // rose-500
          ],
          hoverBackgroundColor: [
            "#059669", // emerald-600
            "#2563eb", // blue-600
            "#e11d48", // rose-600
          ],
          borderColor: "#ffffff",
          borderWidth: 2,
          spacing: 1,
        },
      ],
    };

    const chartOptions: ChartOptions<"doughnut"> = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "74%",
      plugins: {
        legend: {
          display: false, // We render a custom high-fidelity legend below
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
              const value = context.parsed;
              const pct = ((value / data.total) * 100).toFixed(1);
              return ` ${context.label}: ${value} orders (${pct}%)`;
            },
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [data]);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Order Status Breakdown
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Fulfillment & cancellation distribution
          </p>
        </div>
      </div>

      {/* Donut Chart with Center Summary Metrics */}
      <div className="relative my-2 flex h-52 w-full items-center justify-center">
        <canvas ref={canvasRef} />

        {/* Center Summary Metrics Overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] font-bold tracking-tight text-neutral-900 leading-none">
            {data.total.toLocaleString()}
          </span>
          <span className="mt-1 text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            Total Orders
          </span>
        </div>
      </div>

      {/* Legend with Status Colors, Counts, and Percentages */}
      <div className="mt-4 flex flex-col gap-2 border-t border-neutral-100 pt-3">
        {/* Delivered */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-neutral-700">Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {data.delivered.toLocaleString()}
            </span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              {deliveredPct}%
            </span>
          </div>
        </div>

        {/* In Process */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="font-medium text-neutral-700">In Process</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {data.inProcess.toLocaleString()}
            </span>
            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
              {inProcessPct}%
            </span>
          </div>
        </div>

        {/* Cancelled */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="font-medium text-neutral-700">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">
              {data.cancelled.toLocaleString()}
            </span>
            <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700">
              {cancelledPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
