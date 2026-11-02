"use client";

import * as React from "react";
import { Award, Plus, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface BrandHeaderProps {
  onAddBrand?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isDataAvailable?: boolean;
}

export function BrandHeader({
  onAddBrand,
  onExport,
  onImport,
  isDataAvailable = true,
}: BrandHeaderProps) {
  return (
    <AdminPageHeader
      title="Brands"
      icon={Award}
      subtitle="Manage brand identities, partner logos, website links, and storefront features"
      secondaryActions={
        isDataAvailable
          ? [
              {
                label: "Export",
                onClick: onExport ?? (() => alert("Exporting brands list...")),
                icon: ArrowDownToLine,
              },
              {
                label: "Import",
                onClick: onImport ?? (() => alert("Importing brands...")),
                icon: ArrowUpFromLine,
              },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "Add brand",
              onClick: onAddBrand,
              icon: Plus,
            }
          : undefined
      }
    />
  );
}
