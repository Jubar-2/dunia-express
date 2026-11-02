"use client";

import * as React from "react";
import { CategoryTableHeader } from "./category-table-header";
import { CategoryTableRow } from "./category-table-row";
import type { CategoryTableProps } from "../../_types/category.types";

export function CategoryTable({
  categories,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  showColumn = () => true,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[12px]">
        <CategoryTableHeader
          allChecked={allChecked}
          someChecked={someChecked}
          onToggleAll={onToggleAll}
          showColumn={showColumn}
        />
        <tbody className="divide-y divide-neutral-100">
          {categories.map((category, index) => (
            <CategoryTableRow
              key={category.id}
              category={category}
              index={index}
              isChecked={!!checked[index]}
              onToggle={onToggleOne}
              showColumn={showColumn}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
