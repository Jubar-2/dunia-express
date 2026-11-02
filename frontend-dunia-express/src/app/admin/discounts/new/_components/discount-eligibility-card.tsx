"use client";

import * as React from "react";

export interface DiscountEligibilityCardProps {
  eligibility: string;
  onEligibilityChange: (val: string) => void;
  applyOnPos: boolean;
  onApplyOnPosChange: (val: boolean) => void;
}

export function DiscountEligibilityCard({
  eligibility,
  onEligibilityChange,
  applyOnPos,
  onApplyOnPosChange,
}: DiscountEligibilityCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">Eligibility</h2>

      <div>
        <select
          value={eligibility}
          onChange={(e) => onEligibilityChange(e.target.value)}
          className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        >
          <option value="All customers">All customers</option>
          <option value="Specific customer segments">
            Specific customer segments
          </option>
          <option value="Specific customers">Specific customers</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="applyOnPos"
          checked={applyOnPos}
          onChange={(e) => onApplyOnPosChange(e.target.checked)}
          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
        />
        <label
          htmlFor="applyOnPos"
          className="text-xs text-neutral-700 cursor-pointer select-none"
        >
          Apply on POS Pro locations
        </label>
      </div>
    </div>
  );
}
