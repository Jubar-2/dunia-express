import * as React from "react";
import { TableSearchFilter } from "@/components/common/table-search-filter";
import type { CollectionTableFilterProps } from "../../_types";

export function CollectionTableFilter({
  searchValue,
  onSearchChange,
  onFilterClick,
  onColumnsClick,
  rightSlot,
}: CollectionTableFilterProps) {
  return (
    <TableSearchFilter
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onViewClick={onFilterClick}
      onColumnsClick={onColumnsClick}
      showColumnsButton={!rightSlot}
      rightSlot={rightSlot}
    />
  );
}
