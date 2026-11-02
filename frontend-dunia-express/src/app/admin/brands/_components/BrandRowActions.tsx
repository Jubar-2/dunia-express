"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Eye, ExternalLink, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Brand } from "../_types/brand.types";

export interface BrandRowActionsProps {
  brand: Brand;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onViewProducts?: (brand: Brand) => void;
}

export function BrandRowActions({
  brand,
  onEdit,
  onDelete,
  onViewProducts,
}: BrandRowActionsProps) {
  const handleViewProducts = () => {
    if (onViewProducts) {
      onViewProducts(brand);
    } else {
      alert(`Viewing all ${brand.productsCount} products associated with ${brand.name}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus:outline-none"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 text-[12px]">
        <DropdownMenuItem
          onClick={() => onEdit(brand)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5 text-neutral-500" />
          <span>Edit</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleViewProducts}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-neutral-500" />
          <span>View products ({brand.productsCount})</span>
        </DropdownMenuItem>

        {brand.website && (
          <DropdownMenuItem
            onClick={() => window.open(brand.website, "_blank", "noopener,noreferrer")}
            className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
            <span>Visit website</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => onDelete(brand.id)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-rose-600 focus:text-rose-600 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
          <span>Delete brand</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
