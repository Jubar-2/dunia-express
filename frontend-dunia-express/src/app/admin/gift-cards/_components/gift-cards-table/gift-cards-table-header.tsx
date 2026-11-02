import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface GiftCardsTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export function GiftCardsTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: GiftCardsTableHeaderProps) {
  return (
    <thead className="border-b border-neutral-200 bg-bg-admin text-[12px] font-medium text-[#616161]">
      <tr>
        <th className="w-10 px-3.5 py-2.5">
          <Checkbox
            checked={allChecked}
            onCheckedChange={onToggleAll}
            className={cn(someChecked && !allChecked && "opacity-70")}
            aria-label="Select all gift cards"
          />
        </th>
        {showColumn("code") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Card code</th>
        )}
        {showColumn("customer") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Customer</th>
        )}
        {showColumn("status") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Status</th>
        )}
        {showColumn("balance") && (
          <th className="px-3.5 py-2.5 text-right font-medium">Balance</th>
        )}
        {showColumn("initialValue") && (
          <th className="px-3.5 py-2.5 text-right font-medium">Initial value</th>
        )}
        {showColumn("issueDate") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Issue date</th>
        )}
        {showColumn("expirationDate") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Expiration</th>
        )}
      </tr>
    </thead>
  );
}
