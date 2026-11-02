"use client";

import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface PurchaseOrderItem {
  id: string;
  title: string;
  sku: string;
  quantity: number;
  cost: number;
}

export interface PurchaseOrderItemsCardProps {
  items?: PurchaseOrderItem[];
  onItemsChange?: (items: PurchaseOrderItem[]) => void;
}

const DEFAULT_ITEMS: PurchaseOrderItem[] = [
  {
    id: "item-1",
    title: "Organic Cotton T-Shirt - M / Vintage Black",
    sku: "TSH-BLK-M",
    quantity: 50,
    cost: 12.5,
  },
  {
    id: "item-2",
    title: "Heavyweight Pullover Hoodie - L / Charcoal",
    sku: "HOD-CHR-L",
    quantity: 30,
    cost: 28.0,
  },
];

export function PurchaseOrderItemsCard({
  items: propItems,
  onItemsChange,
}: PurchaseOrderItemsCardProps) {
  const [items, setItems] = React.useState<PurchaseOrderItem[]>(
    propItems || DEFAULT_ITEMS
  );

  const updateQuantity = (id: string, qty: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    );
    setItems(updated);
    onItemsChange?.(updated);
  };

  const updateCost = (id: string, cost: number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, cost: Math.max(0, cost) } : item
    );
    setItems(updated);
    onItemsChange?.(updated);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    onItemsChange?.(updated);
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: `item-${Date.now()}`,
      title: "Canvas Weekender Duffle - Olive",
      sku: "DUF-OLV-01",
      quantity: 20,
      cost: 45.0,
    };
    const updated = [...items, newItem];
    setItems(updated);
    onItemsChange?.(updated);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.cost,
    0
  );

  return (
    <AdminCard
      title="Ordered items"
      subtitle="Products and variants to order from this supplier"
      headerAction={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8 gap-1.5 text-xs text-neutral-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add products
        </Button>
      }
    >
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-200 bg-bg-admin text-[12px] font-medium text-[#616161]">
            <tr>
              <th className="px-3.5 py-2.5">Product</th>
              <th className="px-3.5 py-2.5">SKU</th>
              <th className="px-3.5 py-2.5 text-right w-24">Quantity</th>
              <th className="px-3.5 py-2.5 text-right w-28">Cost ($)</th>
              <th className="px-3.5 py-2.5 text-right w-28">Total ($)</th>
              <th className="px-2 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-[12px] text-[#303030]">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                <td className="px-3.5 py-2.5 font-medium">{item.title}</td>
                <td className="px-3.5 py-2.5 text-neutral-500 font-mono text-[11px]">
                  {item.sku}
                </td>
                <td className="px-3.5 py-2.5 text-right">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 rounded border border-neutral-200 px-2 py-1 text-right text-[12px] focus:border-neutral-900 focus:outline-none"
                  />
                </td>
                <td className="px-3.5 py-2.5 text-right">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.cost}
                    onChange={(e) =>
                      updateCost(item.id, parseFloat(e.target.value) || 0)
                    }
                    className="w-20 rounded border border-neutral-200 px-2 py-1 text-right text-[12px] focus:border-neutral-900 focus:outline-none"
                  />
                </td>
                <td className="px-3.5 py-2.5 text-right font-medium">
                  ${(item.quantity * item.cost).toFixed(2)}
                </td>
                <td className="px-2 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3.5 flex justify-end gap-6 text-[13px] text-neutral-600 pr-2">
        <span>Items: {items.reduce((acc, it) => acc + it.quantity, 0)}</span>
        <span className="font-semibold text-neutral-900">
          Estimated Subtotal: ${subtotal.toFixed(2)}
        </span>
      </div>
    </AdminCard>
  );
}
