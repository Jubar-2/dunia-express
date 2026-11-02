"use client";

import * as React from "react";
import { Users, Plus, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface CustomerHeaderProps {
  onAddCustomer?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isDataAvailable?: boolean;
}

export function CustomerHeader({
  onAddCustomer,
  onExport,
  onImport,
  isDataAvailable = true,
}: CustomerHeaderProps) {
  return (
    <AdminPageHeader
      title="Customers"
      icon={Users}
      subtitle="View, segment, and manage your store customers and subscribers"
      secondaryActions={
        isDataAvailable
          ? [
              {
                label: "Export",
                onClick: onExport ?? (() => alert("Export customers list...")),
                icon: ArrowDownToLine,
              },
              {
                label: "Import",
                onClick: onImport ?? (() => alert("Import customers CSV...")),
                icon: ArrowUpFromLine,
              },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "Add customer",
              onClick: onAddCustomer,
              icon: Plus,
            }
          : undefined
      }
    />
  );
}
