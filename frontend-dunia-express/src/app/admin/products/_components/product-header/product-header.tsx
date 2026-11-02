import * as React from "react";
import { Package, ChevronDown } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface ProductHeaderProps {
  onImport?: () => void;
  onExport?: () => void;
  onMoreActions?: () => void;
  onAddProduct?: () => void;
  isDataAvailable?: boolean;
}

export function ProductHeader({
  onImport,
  onExport,
  onMoreActions,
  onAddProduct,
  isDataAvailable = true,
}: ProductHeaderProps) {
  return (
    <AdminPageHeader
      title="Products"
      icon={Package}
      secondaryActions={
        isDataAvailable
          ? [
              { label: "Import", onClick: onImport },
              { label: "Export", onClick: onExport },
              {
                label: "More actions",
                onClick: onMoreActions,
                icon: ChevronDown,
                className: "gap-1",
              },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "Add product",
              onClick: onAddProduct,
              href: onAddProduct ? undefined : "/admin/products/new",
            }
          : undefined
      }
    />
  );
}
