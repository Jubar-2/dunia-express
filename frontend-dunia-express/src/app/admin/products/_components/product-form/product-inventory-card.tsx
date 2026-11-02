import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

export interface ProductInventoryCardProps {
  inventoryTracked: boolean;
  sellOutOfStock: boolean;
  sku: string;
  barcode: string;
  quantity: string;
  onInventoryTrackedChange: (tracked: boolean) => void;
  onSellOutOfStockChange: (sell: boolean) => void;
  onSkuChange: (sku: string) => void;
  onBarcodeChange: (barcode: string) => void;
  onQuantityChange: (qty: string) => void;
}

export function ProductInventoryCard({
  inventoryTracked,
  sellOutOfStock,
  sku,
  barcode,
  quantity,
  onInventoryTrackedChange,
  onSellOutOfStockChange,
  onSkuChange,
  onBarcodeChange,
  onQuantityChange,
}: ProductInventoryCardProps) {
  return (
    <AdminCard
      title="Inventory"
      headerAction={
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Track quantity</span>
          <Switch
            checked={inventoryTracked}
            onCheckedChange={onInventoryTrackedChange}
            aria-label="Track quantity"
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="SKU (Stock Keeping Unit)">
          <Input
            value={sku}
            onChange={(e) => onSkuChange(e.target.value)}
            placeholder="SKU-1002"
            className="border-neutral-300"
          />
        </FormField>

        <FormField label="Barcode (ISBN, UPC, GTIN, etc.)">
          <Input
            value={barcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            placeholder="e.g. 123456789"
            className="border-neutral-300"
          />
        </FormField>
      </div>

      <div className="mt-4 pt-3 border-t border-neutral-100">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-neutral-800">
          <Checkbox
            checked={sellOutOfStock}
            onCheckedChange={(checked) => onSellOutOfStockChange(Boolean(checked))}
          />
          <span>Continue selling when out of stock</span>
        </label>
      </div>

      {/* Quantity table */}
      <div className="mt-4">
        <h3 className="mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Quantity
        </h3>
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-500">
            <span>Location</span>
            <span>Available</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2.5 bg-white">
            <span className="text-sm text-neutral-700 font-medium">Shop location</span>
            <Input
              value={quantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              className="h-8 w-24 border-neutral-300 text-right font-medium"
            />
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
