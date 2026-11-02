"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export interface CategoryTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export function CategoryTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: CategoryTableHeaderProps) {
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

        {showColumn("name") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px]">
            Category
          </th>
        )}

        {showColumn("parent") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px]">
            Parent Category
          </th>
        )}

        {showColumn("products") && (
          <th className="py-2.5 px-3 text-right font-medium text-[12px]">
            Products
          </th>
        )}

        {showColumn("status") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px]">
            Status
          </th>
        )}

        {showColumn("position") && (
          <th className="py-2.5 px-3 text-center font-medium text-[12px]">
            Position
          </th>
        )}

        {showColumn("updatedAt") && (
          <th className="py-2.5 px-3 text-left font-medium text-[12px] hidden md:table-cell">
            Updated
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
