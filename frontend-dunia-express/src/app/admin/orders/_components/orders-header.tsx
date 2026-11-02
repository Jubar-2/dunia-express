import * as React from "react";
import { ShoppingBag, ArrowDownToLine, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface OrdersHeaderProps {
  onExport?: () => void;
  onCreateOrder?: () => void;
  isDataAvailable?: boolean;
}

export function OrdersHeader({
  onExport,
  onCreateOrder,
  isDataAvailable = true,
}: OrdersHeaderProps) {
  return (
    <AdminPageHeader
      title="Orders"
      icon={ShoppingBag}
      secondaryActions={
        isDataAvailable
          ? [
              {
                label: "Export",
                onClick: onExport,
                icon: ArrowDownToLine,
              },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "Create order",
              onClick: onCreateOrder,
              icon: Plus,
            }
          : undefined
      }
    />
  );
}
