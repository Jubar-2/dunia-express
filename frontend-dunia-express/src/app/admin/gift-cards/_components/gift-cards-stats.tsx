import * as React from "react";
import { StatCardGroup, StatItem } from "@/components/common/stat-card-group";

export interface GiftCardsStatsProps {
  totalIssued?: number;
  activeBalance?: number;
  redeemedValue?: number;
}

export function GiftCardsStats({
  totalIssued = 5,
  activeBalance = 360.5,
  redeemedValue = 214.5,
}: GiftCardsStatsProps) {
  const items: StatItem[] = [
    {
      id: "issued",
      label: "Gift cards issued",
      value: `${totalIssued} cards`,
    },
    {
      id: "balance",
      label: "Outstanding balance",
      value: `$${activeBalance.toFixed(2)}`,
    },
    {
      id: "redeemed",
      label: "Redeemed value",
      value: `$${redeemedValue.toFixed(2)}`,
    },
  ];

  return <StatCardGroup items={items} columns={3} />;
}
