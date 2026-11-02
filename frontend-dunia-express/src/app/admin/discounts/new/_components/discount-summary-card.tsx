"use client";

import * as React from "react";
import { Tag } from "lucide-react";
import type { DiscountMethod } from "../../_types/discount.types";
import type { RequirementType } from "./discount-requirements-card";

export interface DiscountSummaryCardProps {
  title: string;
  code: string;
  method: DiscountMethod;
  typeLabel: string;
  eligibility: string;
  applyOnPos: boolean;
  requirementType: RequirementType;
  minAmount: string;
  minQuantity: string;
  combineProductDiscounts: boolean;
  combineOrderDiscounts: boolean;
  combineShippingDiscounts: boolean;
  startDate: string;
}

export function DiscountSummaryCard({
  title,
  code,
  method,
  typeLabel,
  eligibility,
  applyOnPos,
  requirementType,
  minAmount,
  minQuantity,
  combineProductDiscounts,
  combineOrderDiscounts,
  combineShippingDiscounts,
  startDate,
}: DiscountSummaryCardProps) {
  const displayTitle =
    method === "Code"
      ? code.trim() || "No code yet"
      : title.trim() || "No title yet";

  const hasCombinations =
    combineProductDiscounts ||
    combineOrderDiscounts ||
    combineShippingDiscounts;

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      {/* Title & Method */}
      <div>
        <h3 className="text-sm font-semibold text-neutral-900 truncate">
          {displayTitle}
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">{method}</p>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Type */}
      <div>
        <span className="text-xs font-semibold text-neutral-700 block mb-1">
          Type
        </span>
        <div className="text-xs text-neutral-900 font-medium">{typeLabel}</div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-1">
          <Tag className="h-3 w-3" />
          <span>Product discount</span>
        </div>
      </div>

      <div className="h-px bg-neutral-100" />

      {/* Details List */}
      <div>
        <span className="text-xs font-semibold text-neutral-700 block mb-2">
          Details
        </span>
        <ul className="space-y-1.5 text-xs text-neutral-600">
          <li className="flex items-start gap-2">
            <span className="text-neutral-400 select-none">•</span>
            <span>{eligibility}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neutral-400 select-none">•</span>
            <span>{applyOnPos ? "POS included" : "POS excluded"}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neutral-400 select-none">•</span>
            <span>
              {requirementType === "none" && "No minimum purchase requirement"}
              {requirementType === "amount" &&
                `Minimum purchase of $${minAmount || "0"}`}
              {requirementType === "quantity" &&
                `Minimum quantity of ${minQuantity || "0"} items`}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neutral-400 select-none">•</span>
            <span>
              {hasCombinations
                ? "Can combine with other discounts"
                : "Can't combine with other discounts"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neutral-400 select-none">•</span>
            <span>Active from today</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
