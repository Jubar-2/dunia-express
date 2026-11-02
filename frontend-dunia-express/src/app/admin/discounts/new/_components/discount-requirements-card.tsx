"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

export type RequirementType = "none" | "amount" | "quantity";

export interface DiscountRequirementsCardProps {
  requirementType: RequirementType;
  onRequirementTypeChange: (type: RequirementType) => void;
  minAmount: string;
  onMinAmountChange: (amount: string) => void;
  minQuantity: string;
  onMinQuantityChange: (qty: string) => void;
}

export function DiscountRequirementsCard({
  requirementType,
  onRequirementTypeChange,
  minAmount,
  onMinAmountChange,
  minQuantity,
  onMinQuantityChange,
}: DiscountRequirementsCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">
        Minimum purchase requirements
      </h2>

      <div className="space-y-3">
        {/* Option 1: None */}
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-800">
          <input
            type="radio"
            name="minRequirement"
            checked={requirementType === "none"}
            onChange={() => onRequirementTypeChange("none")}
            className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-400"
          />
          <span>No minimum requirements</span>
        </label>

        {/* Option 2: Minimum purchase amount */}
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-800">
            <input
              type="radio"
              name="minRequirement"
              checked={requirementType === "amount"}
              onChange={() => onRequirementTypeChange("amount")}
              className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-400"
            />
            <span>Minimum purchase amount ($)</span>
          </label>
          {requirementType === "amount" && (
            <div className="pl-6.5 max-w-[200px]">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-neutral-400 pointer-events-none">
                  $
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minAmount}
                  onChange={(e) => onMinAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="h-9 pl-7 text-xs border-neutral-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Option 3: Minimum quantity of items */}
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-neutral-800">
            <input
              type="radio"
              name="minRequirement"
              checked={requirementType === "quantity"}
              onChange={() => onRequirementTypeChange("quantity")}
              className="h-4 w-4 border-neutral-300 text-neutral-900 focus:ring-neutral-400"
            />
            <span>Minimum quantity of items</span>
          </label>
          {requirementType === "quantity" && (
            <div className="pl-6.5 max-w-[200px]">
              <Input
                type="number"
                min="1"
                step="1"
                value={minQuantity}
                onChange={(e) => onMinQuantityChange(e.target.value)}
                placeholder="1"
                className="h-9 text-xs border-neutral-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
