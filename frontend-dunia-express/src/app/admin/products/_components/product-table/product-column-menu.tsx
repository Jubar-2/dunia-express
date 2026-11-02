"use client";

import * as React from "react";
import { ColumnVisibilityDropdown } from "@/components/common/column-visibility-dropdown";
import { PRODUCT_COLUMN_DEFS } from "../../_data/mock-products";

export interface ProductColumnMenuProps {
  isOpen: boolean;
  onClose?: () => void;
  hiddenCols: Set<string>;
  onToggleCol: (key: string) => void;
  hideArchived: boolean;
  onToggleHideArchived: (val: boolean) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export function ProductColumnMenu({
  isOpen,
  onClose,
  hiddenCols,
  onToggleCol,
  hideArchived,
  onToggleHideArchived,
  menuRef,
}: ProductColumnMenuProps) {
  return (
    <ColumnVisibilityDropdown
      isOpen={isOpen}
      onClose={onClose}
      columns={PRODUCT_COLUMN_DEFS}
      hiddenColumns={hiddenCols}
      onToggleColumn={onToggleCol}
      hideArchived={hideArchived}
      onToggleHideArchived={onToggleHideArchived}
      sortByLabel="Created"
      dropdownRef={menuRef}
    />
  );
}
