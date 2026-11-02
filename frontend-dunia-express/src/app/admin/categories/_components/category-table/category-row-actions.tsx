"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Eye, Copy, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Category } from "../../_types/category.types";

export interface CategoryRowActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoryRowActions({
  category,
  onEdit,
  onDelete,
}: CategoryRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 text-[12px]">
        <DropdownMenuItem
          onClick={() => onEdit(category)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5 text-neutral-500" />
          <span>Quick edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => alert(`View products in ${category.name}`)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-neutral-500" />
          <span>View products ({category.productsCount})</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => alert(`Duplicate ${category.name}`)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5 text-neutral-500" />
          <span>Duplicate</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => onDelete(category.id)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-rose-600 focus:text-rose-600 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
          <span>Delete category</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
