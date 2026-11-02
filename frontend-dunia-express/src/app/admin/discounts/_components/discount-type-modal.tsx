"use client";

import * as React from "react";
import { X, Tag, ChevronRight, Truck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DiscountType, DiscountTypeOption } from "../_types/discount.types";

export interface DiscountTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: DiscountType) => void;
}

const DISCOUNT_OPTIONS: DiscountTypeOption[] = [
  {
    id: "amount-off-products",
    title: "Amount off products",
    description: "Discount specific products or collections of products",
    iconType: "tag",
  },
  {
    id: "buy-x-get-y",
    title: "Buy X get Y",
    description: "Discount specific products or collections of products",
    iconType: "bogo",
  },
  {
    id: "amount-off-order",
    title: "Amount off order",
    description: "Discount the total order amount",
    iconType: "order",
  },
  {
    id: "free-shipping",
    title: "Free shipping",
    description: "Offer free shipping on an order",
    iconType: "shipping",
  },
];

function OptionIcon({ type }: { type: DiscountTypeOption["iconType"] }) {
  if (type === "tag" || type === "bogo") {
    return (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-neutral-800"
      >
        <path
          d="M3.75 10.833V4.583a.833.833 0 0 1 .833-.833h6.25c.22 0 .433.088.59.244l6.25 6.25a.833.833 0 0 1 0 1.178l-6.25 6.25a.833.833 0 0 1-1.178 0l-6.25-6.25a.833.833 0 0 1-.245-.59z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.083" cy="7.083" r="1.25" fill="currentColor" />
      </svg>
    );
  }

  if (type === "order") {
    return (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-neutral-800"
      >
        {/* Cash drawer / register / receipt icon */}
        <rect
          x="3.333"
          y="4.167"
          width="13.333"
          height="11.667"
          rx="1.667"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M3.333 9.167h13.334M8.333 12.5h3.334"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Shipping
  return <Truck className="h-5 w-5 text-neutral-800" strokeWidth={1.5} />;
}

export function DiscountTypeModal({
  isOpen,
  onClose,
  onSelectType,
}: DiscountTypeModalProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[0.5px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2
            id="modal-title"
            className="text-[15px] font-semibold text-neutral-900"
          >
            Select discount type
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="divide-y divide-neutral-100">
          {DISCOUNT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectType(option.id)}
              className="group flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-neutral-50/80"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <OptionIcon type={option.iconType} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-950">
                    {option.title}
                  </div>
                  <div className="text-xs text-neutral-500 mt-0.5">
                    {option.description}
                  </div>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-neutral-100 bg-white px-6 py-3.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 rounded-lg border-neutral-300 px-4 text-xs font-medium text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
