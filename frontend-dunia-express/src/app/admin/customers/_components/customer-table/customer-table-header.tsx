"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface CustomerTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export function CustomerTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: CustomerTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[12px] font-medium text-neutral-500">
        <th className="w-10 py-2.5 pl-4 pr-2 text-left align-middle">
          <Checkbox
            checked={allChecked}
            onCheckedChange={onToggleAll}
            className={someChecked && !allChecked ? "opacity-70" : undefined}
          />
        </th>

        {showColumn("customer") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px]">
            Customer
          </th>
        )}

        {showColumn("location") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px]">
            Location
          </th>
        )}

        {showColumn("orders") && (
          <th className="py-2.5 px-3 text-right font-medium text-[12px]">
            Orders
          </th>
        )}

        {showColumn("spent") && (
          <th className="py-2.5 px-3 text-right font-medium text-[12px]">
            Total Spent
          </th>
        )}

        {showColumn("marketing") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px]">
            Marketing
          </th>
        )}

        {showColumn("lastOrder") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px] hidden md:table-cell">
            Last Order
          </th>
        )}

        {showColumn("actions") && (
          <th className="w-12 py-2.5 pr-4 pl-2 text-right font-medium text-[12px]">
            <span className="sr-only">Actions</span>
          </th>
        )}
      </tr>
    </thead>
  );
}
