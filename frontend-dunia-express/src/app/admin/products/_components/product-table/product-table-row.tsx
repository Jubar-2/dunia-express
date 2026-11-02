import * as React from "react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/common/status-badge";
import type { Product } from "../../_types";

export interface ProductTableRowProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: () => void;
  showCol: (key: string) => boolean;
}

export function ProductTableRow({
  product,
  isSelected,
  onToggleSelect,
  showCol,
}: ProductTableRowProps) {
  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
      <td className="py-3 pl-4 align-top">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          aria-label={`Select ${product.title}`}
          className="mt-1 h-4 w-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
        />
      </td>

      <td className="max-w-[340px] py-3 pr-4 align-top">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "h-9 w-9 shrink-0 rounded-md border border-neutral-200",
              product.swatch
            )}
          />
          <span className="font-medium leading-snug text-neutral-900 hover:underline cursor-pointer">
            {product.title}
          </span>
        </div>
      </td>

      {showCol("status") && (
        <td className="py-3 pr-4 align-top">
          <StatusBadge status={product.status} />
        </td>
      )}

      {showCol("inventory") && (
        <td className="py-3 pr-4 align-top text-neutral-700 text-sm">
          {product.inventory}
        </td>
      )}

      {showCol("category") && (
        <td className="py-3 pr-4 align-top text-neutral-700 text-sm">
          {product.category}
        </td>
      )}

      {showCol("channels") && (
        <td className="py-3 pr-4 align-top text-neutral-700 text-sm">
          {product.channels}
        </td>
      )}

      {showCol("productType") && (
        <td className="py-3 pr-4 align-top text-neutral-700 text-sm">
          {product.productType}
        </td>
      )}

      {showCol("vendor") && (
        <td className="py-3 pr-4 align-top text-neutral-700 text-sm">
          {product.vendor}
        </td>
      )}
    </tr>
  );
}
