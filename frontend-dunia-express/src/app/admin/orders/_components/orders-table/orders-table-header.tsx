import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface OrdersTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export function OrdersTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: OrdersTableHeaderProps) {
  return (
    <thead className="border-b border-neutral-200 bg-bg-admin text-[12px] font-medium text-[#616161]">
      <tr>
        <th className="w-10 px-3.5 py-2.5">
          <Checkbox
            checked={allChecked}
            onCheckedChange={onToggleAll}
            className={cn(someChecked && !allChecked && "opacity-70")}
            aria-label="Select all orders"
          />
        </th>
        {showColumn("orderNumber") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Order</th>
        )}
        {showColumn("date") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Date</th>
        )}
        {showColumn("customer") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Customer</th>
        )}
        {showColumn("channel") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Sales channel</th>
        )}
        {showColumn("total") && (
          <th className="px-3.5 py-2.5 text-right font-medium">Total</th>
        )}
        {showColumn("paymentStatus") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Payment status</th>
        )}
        {showColumn("fulfillmentStatus") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Fulfillment status</th>
        )}
        {showColumn("items") && (
          <th className="px-3.5 py-2.5 text-center font-medium">Items</th>
        )}
        {showColumn("deliveryMethod") && (
          <th className="px-3.5 py-2.5 text-left font-medium">Delivery</th>
        )}
      </tr>
    </thead>
  );
}
