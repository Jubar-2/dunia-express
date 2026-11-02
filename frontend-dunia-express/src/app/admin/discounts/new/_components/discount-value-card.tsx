"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DiscountValueCardProps {
  valueType: "Percentage" | "Fixed amount";
  onValueTypeChange: (val: "Percentage" | "Fixed amount") => void;
  value: string;
  onValueChange: (val: string) => void;
  appliesTo: "Specific collections" | "Specific products";
  onAppliesToChange: (val: "Specific collections" | "Specific products") => void;
  selectedTargets: string[];
  onRemoveTarget: (target: string) => void;
  onOpenBrowse: () => void;
}

export function DiscountValueCard({
  valueType,
  onValueTypeChange,
  value,
  onValueChange,
  appliesTo,
  onAppliesToChange,
  selectedTargets,
  onRemoveTarget,
  onOpenBrowse,
}: DiscountValueCardProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">Discount value</h2>

      {/* Value type + amount input row */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
        <div>
          <select
            value={valueType}
            onChange={(e) =>
              onValueTypeChange(e.target.value as "Percentage" | "Fixed amount")
            }
            className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <option value="Percentage">Percentage</option>
            <option value="Fixed amount">Fixed amount</option>
          </select>
        </div>

        <div>
          <div className="relative">
            <Input
              type="number"
              min="0"
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder=""
              className="h-9 pr-8 text-xs border-neutral-300"
            />
            <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-medium pointer-events-none">
              {valueType === "Percentage" ? "%" : "$"}
            </span>
          </div>
        </div>
      </div>

      {/* Applies to selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-neutral-700 block">
          Applies to
        </label>
        <select
          value={appliesTo}
          onChange={(e) =>
            onAppliesToChange(
              e.target.value as "Specific collections" | "Specific products"
            )
          }
          className="w-full h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        >
          <option value="Specific collections">Specific collections</option>
          <option value="Specific products">Specific products</option>
        </select>

        {/* Search & Browse row */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                appliesTo === "Specific collections"
                  ? "Search collections"
                  : "Search products"
              }
              className="h-9 pl-8 text-xs border-neutral-300"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenBrowse}
            className="h-9 border-neutral-300 text-xs font-medium px-4 text-neutral-700 bg-white hover:bg-neutral-50 shadow-none"
          >
            Browse
          </Button>
        </div>

        {/* Selected target items chips */}
        {selectedTargets.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {selectedTargets.map((target) => (
              <span
                key={target}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-800"
              >
                <span>{target}</span>
                <button
                  type="button"
                  onClick={() => onRemoveTarget(target)}
                  className="text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
