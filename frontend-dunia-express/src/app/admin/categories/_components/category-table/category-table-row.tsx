"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import { CategoryRowActions } from "./category-row-actions";
import { cn } from "@/lib/utils";
import type { CategoryTableRowProps } from "../../_types/category.types";

export function CategoryTableRow({
  category,
  index,
  isChecked,
  onToggle,
  showColumn = () => true,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors text-[12px]">
      {/* Checkbox */}
      <td className="w-10 py-2.5 pl-4 pr-2 align-middle">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => onToggle(index)}
        />
      </td>

      {/* Category Name & Slug */}
      {showColumn("name") && (
        <td className="py-2.5 px-3 align-middle text-[12px]">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "h-8 w-8 shrink-0 rounded-md border border-neutral-200 shadow-2xs",
                category.swatch || "bg-gradient-to-br from-neutral-100 to-neutral-200"
              )}
            />
            <div className="min-w-0">
              <span
                onClick={() => onEdit(category)}
                className="font-medium text-[12px] text-neutral-900 hover:underline cursor-pointer block truncate"
              >
                {category.name}
              </span>
              <span className="text-[11px] font-mono text-neutral-400 block truncate">
                /{category.slug}
              </span>
            </div>
          </div>
        </td>
      )}

      {/* Parent Category */}
      {showColumn("parent") && (
        <td className="py-2.5 px-3 text-[12px] text-neutral-600 align-middle">
          {category.parentName ? (
            <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700">
              {category.parentName}
            </span>
          ) : (
            <span className="text-neutral-400 italic text-[12px]">— (Top level)</span>
          )}
        </td>
      )}

      {/* Products Count */}
      {showColumn("products") && (
        <td className="py-2.5 px-3 text-right text-[12px] font-mono font-medium text-neutral-800 align-middle">
          {category.productsCount}
        </td>
      )}

      {/* Status */}
      {showColumn("status") && (
        <td className="py-2.5 px-3 align-middle text-[12px]">
          <StatusBadge
            variant={category.status === "active" ? "active" : "archived"}
            status={category.status === "active" ? "Active" : "Archived"}
            size="sm"
            className="text-[11px]"
          />
        </td>
      )}

      {/* Position */}
      {showColumn("position") && (
        <td className="py-2.5 px-3 text-center font-mono text-[12px] text-neutral-600 align-middle">
          {category.position}
        </td>
      )}

      {/* Updated At */}
      {showColumn("updatedAt") && (
        <td className="py-2.5 px-3 text-[12px] text-neutral-500 align-middle hidden md:table-cell">
          {category.updatedAt ?? "—"}
        </td>
      )}

      {/* Row Actions */}
      {showColumn("actions") && (
        <td className="w-12 py-2.5 pr-4 pl-2 text-right align-middle">
          <CategoryRowActions
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </td>
      )}
    </tr>
  );
}
