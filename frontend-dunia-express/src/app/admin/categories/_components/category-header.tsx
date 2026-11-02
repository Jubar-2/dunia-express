"use client";

import * as React from "react";
import { FolderTree, Plus, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface CategoryHeaderProps {
  onAddCategory?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  isDataAvailable?: boolean;
}

export function CategoryHeader({
  onAddCategory,
  onExport,
  onImport,
  isDataAvailable = true,
}: CategoryHeaderProps) {
  return (
    <AdminPageHeader
      title="Categories"
      icon={FolderTree}
      subtitle="Organize products into hierarchical departments and categories"
      secondaryActions={
        isDataAvailable
          ? [
              {
                label: "Export",
                onClick: onExport ?? (() => alert("Exporting categories...")),
                icon: ArrowDownToLine,
              },
              {
                label: "Import",
                onClick: onImport ?? (() => alert("Import categories...")),
                icon: ArrowUpFromLine,
              },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "Add category",
              onClick: onAddCategory,
              icon: Plus,
            }
          : undefined
      }
    />
  );
}
