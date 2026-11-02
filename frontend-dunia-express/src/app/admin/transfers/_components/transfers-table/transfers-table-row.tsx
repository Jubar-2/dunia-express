import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import type { Transfer } from "../../_types";

export interface TransfersTableRowProps {
  transfer: Transfer;
  checked: boolean;
  onToggle: () => void;
  showColumn?: (key: string) => boolean;
}

export function TransfersTableRow({
  transfer,
  checked,
  onToggle,
  showColumn = () => true,
}: TransfersTableRowProps) {
  const getStatusVariant = (status: Transfer["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in_transit":
        return "active";
      case "pending":
        return "warning";
      case "draft":
        return "draft";
      case "cancelled":
        return "error";
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
          aria-label={`Select transfer ${transfer.transferNumber}`}
        />
      </td>

      {showColumn("transferNumber") && (
        <td className="px-3.5 py-3 font-semibold text-neutral-900">
          <span className="cursor-pointer hover:underline">
            {transfer.transferNumber}
          </span>
          {transfer.trackingNumber && (
            <div className="text-[11px] font-normal text-neutral-500 font-mono">
              {transfer.trackingNumber}
            </div>
          )}
        </td>
      )}

      {showColumn("origin") && (
        <td className="px-3.5 py-3 text-neutral-700">
          {transfer.origin}
        </td>
      )}

      {showColumn("destination") && (
        <td className="px-3.5 py-3 text-neutral-700">
          {transfer.destination}
        </td>
      )}

      {showColumn("status") && (
        <td className="px-3.5 py-3 whitespace-nowrap">
          <StatusBadge
            variant={getStatusVariant(transfer.status)}
            size="sm"
            className="capitalize text-[11px]"
          >
            {transfer.status.replace("_", " ")}
          </StatusBadge>
        </td>
      )}

      {showColumn("itemsCount") && (
        <td className="px-3.5 py-3 text-center text-neutral-600">
          {transfer.itemsCount} items
        </td>
      )}

      {showColumn("expectedDate") && (
        <td className="px-3.5 py-3 text-neutral-500 whitespace-nowrap">
          {transfer.expectedDate}
        </td>
      )}
    </tr>
  );
}
