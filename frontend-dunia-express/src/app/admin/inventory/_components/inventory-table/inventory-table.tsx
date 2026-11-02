"use client";

import * as React from "react";
import {
  AdminEmptyState,
  EmptyStateIllustration,
  TableColumnSettings,
  TableSearchFilter,
} from "@/components/common";
import { useTableSettings } from "@/hooks/use-table-settings";
import { InventoryTableHeader } from "./inventory-table-header";
import { InventoryTableRow } from "./inventory-table-row";
import type { InventoryItem } from "../../_types";

export interface InventoryTableProps {
  items: InventoryItem[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (index: number) => void;
  searchValue: string;
  onSearchChange: (val: string) => void;
  onUpdateAvailable?: (id: string, newVal: number) => void;
}

const INVENTORY_COLUMNS = [
  { key: "product", label: "Product", disableToggle: true },
  { key: "sku", label: "SKU" },
  { key: "unavailable", label: "Unavailable" },
  { key: "committed", label: "Committed" },
  { key: "available", label: "Available" },
  { key: "onHand", label: "On hand" },
  { key: "incoming", label: "Incoming" },
];

const INVENTORY_SORT_OPTIONS = [
  { label: "Product title", value: "title" },
  { label: "SKU", value: "sku" },
  { label: "Available quantity", value: "available" },
  { label: "On hand", value: "onHand" },
  { label: "Committed", value: "committed" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "product",
  "sku",
  "unavailable",
  "committed",
  "available",
  "onHand",
  "incoming",
];

export function InventoryTable({
  items,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  searchValue,
  onSearchChange,
  onUpdateAvailable,
}: InventoryTableProps) {
  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "inventory_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "title", order: "asc" },
  });

  // Apply sorting based on activeSort
  const sortedItems = React.useMemo(() => {
    if (!activeSort?.field) return items;
    return [...items].sort((a, b) => {
      const field = activeSort.field as keyof InventoryItem;
      const valA = a[field];
      const valB = b[field];

      if (typeof valA === "string" && typeof valB === "string") {
        return activeSort.order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return activeSort.order === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
  }, [items, activeSort]);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Table Search & Filter Toolbar with TableColumnSettings */}
      <TableSearchFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        placeholder="Filter inventory by product or SKU"
        showColumnsButton={false}
        rightSlot={
          <TableColumnSettings
            columns={INVENTORY_COLUMNS}
            visibleColumns={visibleColumns}
            onToggleColumn={toggleColumn}
            sortOptions={INVENTORY_SORT_OPTIONS}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            onResetColumns={resetColumns}
            onShowAllColumns={() =>
              showAllColumns(INVENTORY_COLUMNS.map((c) => c.key))
            }
            triggerVariant={sortedItems.length === 0 ? "ghost" : "outline"}
            triggerSize={sortedItems.length === 0 ? "icon-sm" : "sm"}
            triggerLabel={sortedItems.length === 0 ? null : "Columns"}
          />
        }
      />

      {/* Table Container or Empty State */}
      {sortedItems.length === 0 ? (
        <AdminEmptyState
          illustration={!searchValue ? <EmptyStateIllustration /> : undefined}
          title={searchValue ? "No inventory items found" : "Manage your inventory"}
          description={
            searchValue
              ? `No inventory items matching "${searchValue}". Try clearing filters.`
              : "Track and manage stock levels across all your product variants and locations."
          }
          primaryAction={
            !searchValue
              ? {
                  label: "View products",
                  href: "/admin/products",
                }
              : undefined
          }
          secondaryAction={
            !searchValue
              ? {
                  label: "Import",
                  onClick: () => alert("Import inventory"),
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <InventoryTableHeader
              allChecked={allChecked}
              someChecked={someChecked}
              onToggleAll={onToggleAll}
              showColumn={showColumn}
            />
            <tbody>
              {sortedItems.map((item, index) => (
                <InventoryTableRow
                  key={item.id}
                  item={item}
                  isSelected={Boolean(checked[index])}
                  onToggleSelect={() => onToggleOne(index)}
                  onAvailableChange={(newVal) =>
                    onUpdateAvailable?.(item.id, newVal)
                  }
                  showColumn={showColumn}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
