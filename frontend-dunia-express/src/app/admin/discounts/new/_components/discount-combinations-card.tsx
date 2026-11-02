"use client";

import * as React from "react";
import { Info } from "lucide-react";

export interface DiscountCombinationsCardProps {
  combineProductDiscounts: boolean;
  onCombineProductChange: (val: boolean) => void;
  combineOrderDiscounts: boolean;
  onCombineOrderChange: (val: boolean) => void;
  combineShippingDiscounts: boolean;
  onCombineShippingChange: (val: boolean) => void;
}

export function DiscountCombinationsCard({
  combineProductDiscounts,
  onCombineProductChange,
  combineOrderDiscounts,
  onCombineOrderChange,
  combineShippingDiscounts,
  onCombineShippingChange,
}: DiscountCombinationsCardProps) {
  const hasCombinations =
    combineProductDiscounts ||
    combineOrderDiscounts ||
    combineShippingDiscounts;

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Combinations</h2>
        <Info className="h-4 w-4 text-neutral-400" />
      </div>

      {!hasCombinations ? (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50/70 p-3.5 text-xs text-neutral-600 leading-relaxed">
          This discount won&apos;t combine with other product, order, or shipping
          discounts in the customer&apos;s cart.
        </div>
      ) : null}

      <div className="space-y-2.5 pt-1">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-800">
          <input
            type="checkbox"
            checked={combineProductDiscounts}
            onChange={(e) => onCombineProductChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
          />
          <span>Product discounts</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-800">
          <input
            type="checkbox"
            checked={combineOrderDiscounts}
            onChange={(e) => onCombineOrderChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
          />
          <span>Order discounts</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-800">
          <input
            type="checkbox"
            checked={combineShippingDiscounts}
            onChange={(e) => onCombineShippingChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
          />
          <span>Shipping discounts</span>
        </label>
      </div>
    </div>
  );
}
