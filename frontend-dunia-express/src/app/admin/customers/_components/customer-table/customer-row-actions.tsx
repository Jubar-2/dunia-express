"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Eye, Mail, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Customer } from "../../_types/customer.types";

export interface CustomerRowActionsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export function CustomerRowActions({
  customer,
  onEdit,
  onDelete,
}: CustomerRowActionsProps) {
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
          onClick={() => onEdit(customer)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5 text-neutral-500" />
          <span>Edit customer</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => alert(`Viewing details for ${customer.name}`)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-neutral-500" />
          <span>View profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => (window.location.href = `mailto:${customer.email}`)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] cursor-pointer"
        >
          <Mail className="h-3.5 w-3.5 text-neutral-500" />
          <span>Send email</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          onClick={() => onDelete(customer.id)}
          className="flex items-center gap-2 px-2.5 py-1.5 text-[12px] text-rose-600 focus:text-rose-600 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5 text-rose-600" />
          <span>Delete customer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
