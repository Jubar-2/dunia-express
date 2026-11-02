import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import type { GiftCard } from "../../_types";

export interface GiftCardsTableRowProps {
  giftCard: GiftCard;
  checked: boolean;
  onToggle: () => void;
  showColumn?: (key: string) => boolean;
}

export function GiftCardsTableRow({
  giftCard,
  checked,
  onToggle,
  showColumn = () => true,
}: GiftCardsTableRowProps) {
  const getStatusVariant = (status: GiftCard["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "disabled":
        return "neutral";
      case "expired":
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
          aria-label={`Select gift card ${giftCard.code}`}
        />
      </td>

      {showColumn("code") && (
        <td className="px-3.5 py-3 font-mono font-medium tracking-wider text-neutral-900">
          <span className="cursor-pointer hover:underline">
            {giftCard.code}
          </span>
        </td>
      )}

      {showColumn("customer") && (
        <td className="px-3.5 py-3">
          {giftCard.customer ? (
            <div>
              <div className="font-medium text-neutral-900">
                {giftCard.customer.name}
              </div>
              <div className="text-[11px] text-neutral-500">
                {giftCard.customer.email}
              </div>
            </div>
          ) : (
            <span className="text-neutral-400 italic">No customer</span>
          )}
        </td>
      )}

      {showColumn("status") && (
        <td className="px-3.5 py-3 whitespace-nowrap">
          <StatusBadge
            variant={getStatusVariant(giftCard.status)}
            size="sm"
            className="capitalize text-[11px]"
          >
            {giftCard.status}
          </StatusBadge>
        </td>
      )}

      {showColumn("balance") && (
        <td className="px-3.5 py-3 text-right font-medium text-neutral-900 whitespace-nowrap">
          ${giftCard.balance.toFixed(2)}
        </td>
      )}

      {showColumn("initialValue") && (
        <td className="px-3.5 py-3 text-right text-neutral-500 whitespace-nowrap">
          ${giftCard.initialValue.toFixed(2)}
        </td>
      )}

      {showColumn("issueDate") && (
        <td className="px-3.5 py-3 text-neutral-500 whitespace-nowrap">
          {giftCard.issueDate}
        </td>
      )}

      {showColumn("expirationDate") && (
        <td className="px-3.5 py-3 text-neutral-500 whitespace-nowrap">
          {giftCard.expirationDate}
        </td>
      )}
    </tr>
  );
}
