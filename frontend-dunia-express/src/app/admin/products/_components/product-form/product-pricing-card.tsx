import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export interface ProductPricingCardProps {
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  chargeTax: boolean;
  onPriceChange: (price: string) => void;
  onCompareAtPriceChange: (val: string) => void;
  onCostPerItemChange: (val: string) => void;
  onChargeTaxChange: (checked: boolean) => void;
}

export function ProductPricingCard({
  price,
  compareAtPrice,
  costPerItem,
  chargeTax,
  onPriceChange,
  onCompareAtPriceChange,
  onCostPerItemChange,
  onChargeTaxChange,
}: ProductPricingCardProps) {
  // Compute profit and margin
  const numPrice = parseFloat(price) || 0;
  const numCost = parseFloat(costPerItem) || 0;
  const profit = numPrice > 0 && numCost > 0 ? (numPrice - numCost).toFixed(2) : "--";
  const margin =
    numPrice > 0 && numCost > 0
      ? `${Math.round(((numPrice - numCost) / numPrice) * 100)}%`
      : "--";

  return (
    <AdminCard title="Pricing">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Price">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
              ৳
            </span>
            <Input
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="0.00"
              className="border-neutral-300 pl-7"
            />
          </div>
        </FormField>

        <FormField label="Compare-at price" helpText="To display a markdown, enter a value higher than your price.">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
              ৳
            </span>
            <Input
              value={compareAtPrice}
              onChange={(e) => onCompareAtPriceChange(e.target.value)}
              placeholder="0.00"
              className="border-neutral-300 pl-7"
            />
          </div>
        </FormField>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800">
          <Checkbox
            checked={chargeTax}
            onCheckedChange={(checked) => onChargeTaxChange(Boolean(checked))}
          />
          <span>Charge tax on this product</span>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-neutral-100">
        <FormField label="Cost per item" helpText="Customers won't see this">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
              ৳
            </span>
            <Input
              value={costPerItem}
              onChange={(e) => onCostPerItemChange(e.target.value)}
              placeholder="0.00"
              className="border-neutral-300 pl-7"
            />
          </div>
        </FormField>

        <div className="flex flex-col justify-center">
          <span className="text-xs text-neutral-500 font-medium">Profit</span>
          <span className="mt-1 text-sm font-semibold text-neutral-800">
            {profit !== "--" ? `৳${profit}` : "--"}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-xs text-neutral-500 font-medium">Margin</span>
          <span className="mt-1 text-sm font-semibold text-neutral-800">
            {margin}
          </span>
        </div>
      </div>
    </AdminCard>
  );
}
