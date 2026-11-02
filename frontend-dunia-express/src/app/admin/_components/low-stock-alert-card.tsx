"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Plus } from "lucide-react";
import type { LowStockProduct } from "../_types/dashboard.types";

export interface LowStockAlertCardProps {
  products: LowStockProduct[];
}

export function LowStockAlertCard({ products }: LowStockAlertCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              Low Stock Alerts
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Items reaching reorder thresholds that need attention
            </p>
          </div>
        </div>

        <Link
          href="/admin/inventory"
          className="flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-neutral-950 hover:underline"
        >
          <span>Manage inventory</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
        </Link>
      </div>

      {/* Grid of low stock alert items */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((item) => {
          const isCritical = item.currentStock <= 10;

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-neutral-200 bg-neutral-50/50 p-3.5 transition-colors hover:bg-neutral-50"
            >
              {/* Product header */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`h-8 w-8 shrink-0 rounded-md border border-neutral-200 shadow-2xs ${item.swatch}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-neutral-900 leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {item.sku} • {item.variant}
                  </div>
                </div>
              </div>

              {/* Stock status indicator */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-neutral-500">Available</span>
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${
                      isCritical
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.currentStock} left
                  </span>
                </div>

                {/* Progress bar visual */}
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCritical ? "bg-rose-500" : "bg-amber-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (item.currentStock / item.minThreshold) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Quick action: Create Purchase Order / Restock */}
              <div className="mt-3 border-t border-neutral-200/60 pt-2.5">
                <Link
                  href="/admin/purchase-orders/new"
                  className="flex items-center justify-center gap-1 rounded-md border border-neutral-300 bg-white py-1 text-[11px] font-medium text-neutral-700 shadow-2xs hover:bg-neutral-100 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Reorder ({item.reorderQuantity})</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
