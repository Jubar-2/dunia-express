"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import type { DashboardOrder } from "../_types/dashboard.types";

export interface RecentOrdersTableProps {
  orders: DashboardOrder[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">
            Recent Orders
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Latest sales transactions across channels
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-neutral-950 hover:underline"
        >
          <span>View all orders</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
        </Link>
      </div>

      {/* Table with strict text-[12px] typography and compact paddings */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 font-medium">
              <th className="py-2.5 px-3">Order</th>
              <th className="py-2.5 px-3">Customer</th>
              <th className="py-2.5 px-3 hidden sm:table-cell">Date</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((order) => {
              const statusVariant =
                order.status === "fulfilled"
                  ? "success"
                  : order.status === "pending"
                  ? "warning"
                  : "error";

              const statusLabel =
                order.status === "fulfilled"
                  ? "Fulfilled"
                  : order.status === "pending"
                  ? "Pending"
                  : "Cancelled";

              return (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-neutral-50/80"
                >
                  {/* Order Number */}
                  <td className="py-2.5 px-3 font-semibold text-neutral-900">
                    <Link
                      href={`/admin/orders`}
                      className="hover:underline hover:text-neutral-950"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>

                  {/* Customer */}
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-neutral-900">
                      {order.customerName}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {order.customerEmail}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-2.5 px-3 text-neutral-500 hidden sm:table-cell">
                    {order.date}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3">
                    <StatusBadge
                      variant={statusVariant}
                      status={statusLabel}
                      size="sm"
                    />
                  </td>

                  {/* Total Amount */}
                  <td className="py-2.5 px-3 text-right font-semibold text-neutral-900">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
