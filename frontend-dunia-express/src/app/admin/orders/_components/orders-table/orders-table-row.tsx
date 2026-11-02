import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import type { Order } from "../../_types";

export interface OrdersTableRowProps {
  order: Order;
  checked: boolean;
  onToggle: () => void;
  showColumn?: (key: string) => boolean;
}

export function OrdersTableRow({
  order,
  checked,
  onToggle,
  showColumn = () => true,
}: OrdersTableRowProps) {
  const getPaymentVariant = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "refunded":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getFulfillmentVariant = (status: Order["fulfillmentStatus"]) => {
    switch (status) {
      case "fulfilled":
        return "success";
      case "unfulfilled":
        return "warning";
      case "partial":
        return "warning";
      case "restocked":
        return "neutral";
      default:
        return "neutral";
    }
  };

  return (
    <tr
      className={`border-b border-neutral-100 text-[12px] text-[#303030] hover:bg-neutral-50/70 transition-colors ${
        checked ? "bg-neutral-50" : ""
      }`}
    >
      <td className="w-10 px-3.5 py-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          aria-label={`Select order ${order.orderNumber}`}
        />
      </td>

      {showColumn("orderNumber") && (
        <td className="px-3.5 py-3 font-semibold text-neutral-900">
          <span className="cursor-pointer hover:underline">
            {order.orderNumber}
          </span>
        </td>
      )}

      {showColumn("date") && (
        <td className="px-3.5 py-3 text-neutral-500 whitespace-nowrap">
          {order.date}
        </td>
      )}

      {showColumn("customer") && (
        <td className="px-3.5 py-3">
          <div className="font-medium text-neutral-900">
            {order.customer.name}
          </div>
          <div className="text-[11px] text-neutral-500">
            {order.customer.email}
          </div>
        </td>
      )}

      {showColumn("channel") && (
        <td className="px-3.5 py-3 text-neutral-600 whitespace-nowrap">
          {order.channel}
        </td>
      )}

      {showColumn("total") && (
        <td className="px-3.5 py-3 text-right font-medium text-neutral-900 whitespace-nowrap">
          ${order.total.toFixed(2)}
        </td>
      )}

      {showColumn("paymentStatus") && (
        <td className="px-3.5 py-3 whitespace-nowrap">
          <StatusBadge
            variant={getPaymentVariant(order.paymentStatus)}
            size="sm"
            className="capitalize text-[11px]"
          >
            {order.paymentStatus}
          </StatusBadge>
        </td>
      )}

      {showColumn("fulfillmentStatus") && (
        <td className="px-3.5 py-3 whitespace-nowrap">
          <StatusBadge
            variant={getFulfillmentVariant(order.fulfillmentStatus)}
            size="sm"
            className="capitalize text-[11px]"
          >
            {order.fulfillmentStatus}
          </StatusBadge>
        </td>
      )}

      {showColumn("items") && (
        <td className="px-3.5 py-3 text-center text-neutral-600">
          {order.itemsCount} {order.itemsCount === 1 ? "item" : "items"}
        </td>
      )}

      {showColumn("deliveryMethod") && (
        <td className="px-3.5 py-3 text-neutral-500 whitespace-nowrap">
          {order.deliveryMethod}
        </td>
      )}
    </tr>
  );
}
