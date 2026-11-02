import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import { cn } from "@/lib/utils";
import type { CollectionTableRowProps } from "../../_types";

export function CollectionTableRow({
  collection,
  index,
  isChecked,
  onToggle,
  showColumn = () => true,
}: CollectionTableRowProps) {
  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors">
      <td className="py-3 pl-4 align-middle">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => onToggle(index)}
        />
      </td>

      {showColumn("title") && (
        <td className="py-3 pr-4 align-middle text-[12px]">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-9 w-9 shrink-0 rounded-md border border-neutral-200",
                collection.swatch
              )}
            />
            <span className="font-medium text-[12px] text-neutral-900 underline-offset-2 hover:underline cursor-pointer">
              {collection.title}
            </span>
          </div>
        </td>
      )}

      {showColumn("products") && (
        <td className="py-3 pr-8 text-right text-[12px] text-neutral-800 font-mono align-middle">
          {collection.products}
        </td>
      )}

      {showColumn("conditions") && (
        <td className="py-3 pr-4 text-[12px] text-neutral-600 align-middle">
          {collection.conditions || (
            <span className="text-neutral-400 italic text-[12px]">No conditions</span>
          )}
        </td>
      )}

      {showColumn("status") && (
        <td className="py-3 pr-4 align-middle text-[12px]">
          <StatusBadge status={collection.status ?? "Active"} className="text-[12px]" />
        </td>
      )}

      {showColumn("updatedAt") && (
        <td className="py-3 pr-6 text-[12px] text-neutral-500 align-middle">
          {collection.updatedAt ?? "—"}
        </td>
      )}
    </tr>
  );
}
