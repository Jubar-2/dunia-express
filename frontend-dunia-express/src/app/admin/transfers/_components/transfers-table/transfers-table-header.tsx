import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface TransfersTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export function TransfersTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: TransfersTableHeaderProps) {
  return (
    <thead className="border-b border-neutral-200 bg-bg-admin text-[12px] font-medium text-[#616161]">
      <tr>
        <th className="w-10 px-3.5 py-2.5">
          <Checkbox
            checked={allChecked}
            onCheckedChange={onToggleAll}
            className={cn(someChecked && !allChecked && "opacity-70")}
            aria-label="Select all transfers"
          />
        </th>
        {showColumn("transferNumber") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Transfer</th>
        )}
        {showColumn("origin") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Origin</th>
        )}
        {showColumn("destination") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Destination</th>
        )}
        {showColumn("status") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Status</th>
        )}
        {showColumn("itemsCount") && (
          <th className="px-3.5 py-2.5 text-center font-medium">Items</th>
        )}
        {showColumn("expectedDate") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Expected arrival</th>
        )}
      </tr>
    </thead>
  );
}
