import * as React from "react";
import { Truck } from "lucide-react";
import { FormBreadcrumb } from "@/components/common/form-breadcrumb";

export interface PurchaseOrderBreadcrumbProps {
  title?: string;
}

export function PurchaseOrderBreadcrumb({
  title = "Create purchase order",
}: PurchaseOrderBreadcrumbProps) {
  return (
    <FormBreadcrumb
      title={title}
      icon={Truck}
      parentLabel="Purchase orders"
      parentHref="/admin/purchase-orders"
    />
  );
}
