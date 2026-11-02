import * as React from "react";
import { Archive, Package } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface InventoryHeaderProps {
  onImport?: () => void;
  onExport?: () => void;
  isDataAvailable?: boolean;
}

export function InventoryHeader({
  onImport,
  onExport,
  isDataAvailable = true,
}: InventoryHeaderProps) {
  return (
    <AdminPageHeader
      title="Inventory"
      icon={Archive}
      secondaryActions={
        isDataAvailable
          ? [
              { label: "Import", onClick: onImport },
              { label: "Export", onClick: onExport },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "View products",
              href: "/admin/products",
              icon: Package,
            }
          : undefined
      }
    />
  );
}
