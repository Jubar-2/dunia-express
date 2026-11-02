import * as React from "react";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "../../_types";

export interface InventoryTableRowProps {
  item: InventoryItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAvailableChange?: (newVal: number) => void;
  showColumn?: (key: string) => boolean;
}

export function InventoryTableRow({
  item,
  isSelected,
  onToggleSelect,
  onAvailableChange,
  showColumn = () => true,
}: InventoryTableRowProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [availableVal, setAvailableVal] = React.useState(item.available.toString());

  function handleBlur() {
    setIsEditing(false);
    const parsed = parseInt(availableVal, 10);
    if (!isNaN(parsed) && parsed !== item.available) {
      onAvailableChange?.(parsed);
    } else {
      setAvailableVal(item.available.toString());
    }
  }

  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors">
      {/* Checkbox */}
      <td className="py-3 pl-4 align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          aria-label={`Select ${item.title}`}
          className="h-4 w-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
        />
      </td>

      {/* 1. Product (Thumbnail + Title + Variant) */}
      {showColumn("product") && (
        <td className="py-3 pr-4 align-middle text-[12px]">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-9 w-9 shrink-0 rounded-md border border-neutral-200 shadow-2xs",
                item.swatch
              )}
            />
            <div className="min-w-0">
              <span className="font-medium text-[12px] text-neutral-900 leading-snug hover:underline cursor-pointer block truncate">
                {item.title}
              </span>
              <span className="text-[12px] text-neutral-500 block">{item.variant}</span>
            </div>
          </div>
        </td>
      )}

      {/* 2. SKU */}
      {showColumn("sku") && (
        <td className="py-3 pr-4 align-middle text-[12px] font-mono text-neutral-600">
          {item.sku}
        </td>
      )}

      {/* 3. Unavailable */}
      {showColumn("unavailable") && (
        <td className="py-3 pr-4 align-middle text-[12px] text-right text-neutral-600 font-mono">
          {item.unavailable}
        </td>
      )}

      {/* 4. Committed */}
      {showColumn("committed") && (
        <td className="py-3 pr-4 align-middle text-[12px] text-right text-neutral-600 font-mono">
          {item.committed}
        </td>
      )}

      {/* 5. Available */}
      {showColumn("available") && (
        <td className="py-3 pr-4 align-middle text-right text-[12px]">
          {isEditing ? (
            <input
              type="number"
              autoFocus
              value={availableVal}
              onChange={(e) => setAvailableVal(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBlur();
                if (e.key === "Escape") {
                  setAvailableVal(item.available.toString());
                  setIsEditing(false);
                }
              }}
              className="h-7 w-20 rounded border border-neutral-400 bg-white px-2 text-right text-[12px] font-medium focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-[12px] font-semibold text-neutral-800 hover:bg-neutral-200 transition-colors"
              title="Click to edit available stock"
            >
              {item.available}
            </button>
          )}
        </td>
      )}

      {/* 6. On hand */}
      {showColumn("onHand") && (
        <td className="py-3 pr-4 align-middle text-[12px] text-right text-neutral-700 font-medium font-mono">
          {item.onHand}
        </td>
      )}

      {/* 7. Incoming */}
      {showColumn("incoming") && (
        <td className="py-3 pr-6 align-middle text-[12px] text-right font-mono">
          {item.incoming > 0 ? (
            <span className="text-blue-600 font-medium text-[12px]">+{item.incoming}</span>
          ) : (
            <span className="text-neutral-400 text-[12px]">0</span>
          )}
        </td>
      )}
    </tr>
  );
}
