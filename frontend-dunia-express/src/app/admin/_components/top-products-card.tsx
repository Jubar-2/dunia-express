"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import type { TopProduct } from "../_types/dashboard.types";

export interface TopProductsCardProps {
  products: TopProduct[];
}

export function TopProductsCard({ products }: TopProductsCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Best-Selling Products
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Top items by units sold & revenue
          </p>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-neutral-950 hover:underline"
        >
          <span>All products</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
        </Link>
      </div>

      {/* Items list */}
      <div className="flex flex-col divide-y divide-neutral-100">
        {products.map((product, idx) => {
          const isPositive = product.growth >= 0;

          return (
            <div
              key={product.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              {/* Product Info with Swatch */}
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <span className="text-xs font-semibold text-neutral-400 w-4">
                  #{idx + 1}
                </span>

                <div
                  className={`h-9 w-9 shrink-0 rounded-lg border border-neutral-200 shadow-2xs ${product.swatch}`}
                />

                <div className="min-w-0">
                  <div className="truncate text-xs font-medium text-neutral-900">
                    {product.title}
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {product.category}
                  </div>
                </div>
              </div>

              {/* Units Sold & Revenue */}
              <div className="text-right shrink-0">
                <div className="text-xs font-semibold text-neutral-900">
                  ${product.revenue.toLocaleString()}
                </div>
                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                  <span className="text-[11px] text-neutral-500">
                    {product.unitsSold.toLocaleString()} sold
                  </span>
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold ${
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
                    )}
                    {isPositive ? `+${product.growth}%` : `${product.growth}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
