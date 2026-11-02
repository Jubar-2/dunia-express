import * as React from "react";
import { StatCardGroup } from "@/components/common/stat-card-group";
import { PRODUCT_STAT_ITEMS } from "../../_data/mock-products";

export function ProductStatsCards() {
  return <StatCardGroup items={PRODUCT_STAT_ITEMS} columns={4} />;
}
