import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { CollectionTableHeaderProps } from "../../_types";

export function CollectionTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: CollectionTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-neutral-200 text-[12px] font-medium text-neutral-500 bg-bg-admin">
        <th className="w-10 py-2.5 pl-4">
          <Checkbox
            checked={allChecked}
            onCheckedChange={onToggleAll}
            className={cn(someChecked && !allChecked && "opacity-70")}
          />
        </th>
        {showColumn("title") && (
          <th className="py-2.5 font-medium text-neutral-600 min-w-[260px] text-[12px]">
            Title
          </th>
        )}
        {showColumn("products") && (
          <th className="py-2.5 pr-8 text-right font-medium text-neutral-600 text-[12px]">
            Products
          </th>
        )}
        {showColumn("conditions") && (
          <th className="py-2.5 pr-4 font-medium text-neutral-600 text-[12px]">
            Conditions
          </th>
        )}
        {showColumn("status") && (
          <th className="py-2.5 pr-4 font-medium text-neutral-600 text-[12px]">
            Status
          </th>
        )}
        {showColumn("updatedAt") && (
          <th className="py-2.5 pr-6 font-medium text-neutral-600 text-[12px]">
            Updated at
          </th>
        )}
      </tr>
    </thead>
  );
}
