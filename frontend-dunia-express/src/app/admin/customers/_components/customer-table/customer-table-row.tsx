"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import { CustomerRowActions } from "./customer-row-actions";
import { cn } from "@/lib/utils";
import type { CustomerTableRowProps } from "../../_types/customer.types";

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function CustomerTableRow({
  customer,
  index,
  isChecked,
  onToggle,
  showColumn = () => true,
  onEdit,
  onDelete,
}: CustomerTableRowProps) {
  return (
    <tr className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors text-[12px]">
      {/* Checkbox */}
      <td className="w-10 py-2.5 pl-4 pr-2 align-middle">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => onToggle(index)}
        />
      </td>

      {/* Customer Name, Initials Avatar, and Email */}
      {showColumn("customer") && (
        <td className="py-2.5 px-3 align-middle text-[12px]">
          <div className="flex items-center gap-2.5">
            {/* Avatar / Initials */}
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-2xs",
                customer.avatarColor || "bg-neutral-100 text-neutral-700"
              )}
            >
              {getInitials(customer.name)}
            </div>

            <div className="min-w-0">
              <span
                onClick={() => onEdit(customer)}
                className="font-semibold text-[12px] text-neutral-900 hover:underline cursor-pointer block truncate"
              >
                {customer.name}
              </span>
              <span className="text-[11px] text-neutral-400 block truncate">
                {customer.email}
              </span>
            </div>
          </div>
        </td>
      )}

      {/* Location */}
      {showColumn("location") && (
        <td className="py-2.5 px-3 text-[12px] text-neutral-600 align-middle">
          <div className="flex items-center gap-1.5">
            {customer.location.flag && (
              <span className="text-sm">{customer.location.flag}</span>
            )}
            <span className="truncate">
              {customer.location.city}, {customer.location.country}
            </span>
          </div>
        </td>
      )}

      {/* Orders Count */}
      {showColumn("orders") && (
        <td className="py-2.5 px-3 text-right text-[12px] font-mono font-medium text-neutral-800 align-middle">
          {customer.ordersCount === 0 ? (
            <span className="text-neutral-400 font-sans">0 orders</span>
          ) : (
            `${customer.ordersCount} ${customer.ordersCount === 1 ? "order" : "orders"}`
          )}
        </td>
      )}

      {/* Total Spent */}
      {showColumn("spent") && (
        <td className="py-2.5 px-3 text-right text-[12px] font-mono font-semibold text-neutral-900 align-middle">
          ${customer.totalSpent.toFixed(2)}
        </td>
      )}

      {/* Marketing Status */}
      {showColumn("marketing") && (
        <td className="py-2.5 px-3 align-middle text-[12px]">
          <StatusBadge
            variant={
              customer.marketingStatus === "subscribed"
                ? "success"
                : customer.marketingStatus === "pending"
                ? "warning"
                : "neutral"
            }
            status={
              customer.marketingStatus === "subscribed"
                ? "Subscribed"
                : customer.marketingStatus === "pending"
                ? "Pending"
                : "Unsubscribed"
            }
            size="sm"
            className="text-[11px]"
          />
        </td>
      )}

      {/* Last Order Date */}
      {showColumn("lastOrder") && (
        <td className="py-2.5 px-3 text-[12px] text-neutral-500 align-middle hidden md:table-cell">
          {customer.lastOrderDate}
        </td>
      )}

      {/* Actions */}
      {showColumn("actions") && (
        <td className="w-12 py-2.5 pr-4 pl-2 text-right align-middle">
          <CustomerRowActions
            customer={customer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </td>
      )}
    </tr>
  );
}
