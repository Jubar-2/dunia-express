"use client";

import * as React from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DiscountCollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTargets: string[];
  onToggleTarget: (target: string) => void;
  appliesTo: "Specific collections" | "Specific products";
}

const SAMPLE_COLLECTIONS = [
  "Summer Collection 2026",
  "Winter Warmers",
  "Activewear Essentials",
  "Footwear & Sneakers",
  "New Arrivals",
  "Best Sellers",
  "Clearance Outlet",
];

const SAMPLE_PRODUCTS = [
  "Nike Air Max 90",
  "Adidas Ultraboost Light",
  "Puma RS-X Reinvent",
  "New Balance 574 Core",
  "Converse Chuck Taylor All Star",
];

export function DiscountCollectionsModal({
  isOpen,
  onClose,
  selectedTargets,
  onToggleTarget,
  appliesTo,
}: DiscountCollectionsModalProps) {
  const [search, setSearch] = React.useState("");

  if (!isOpen) return null;

  const items =
    appliesTo === "Specific collections" ? SAMPLE_COLLECTIONS : SAMPLE_PRODUCTS;

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[0.5px]"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-neutral-900">
            {appliesTo === "Specific collections"
              ? "Select collections"
              : "Select products"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-neutral-100">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter..."
              className="h-8 pl-8 text-xs border-neutral-300"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100 px-3 py-1">
          {filteredItems.map((item) => {
            const isSelected = selectedTargets.includes(item);
            return (
              <label
                key={item}
                className="flex items-center gap-3 px-3 py-2.5 text-xs text-neutral-800 hover:bg-neutral-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleTarget(item)}
                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-400"
                />
                <span className="font-medium">{item}</span>
              </label>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-neutral-100 bg-neutral-50/50 px-5 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-xs border-neutral-300"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
