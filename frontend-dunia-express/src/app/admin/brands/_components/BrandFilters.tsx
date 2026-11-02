"use client";

import * as React from "react";
import { TableColumnSettings, TableSearchFilter } from "@/components/common";
import type { TableSort } from "@/hooks/use-table-settings";

export interface FilterTab {
  id: string;
  label: string;
}

export const BRAND_STATUS_TABS: FilterTab[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

export interface BrandFiltersProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs?: FilterTab[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  isCompletelyEmpty?: boolean;
  columns: Array<{ key: string; label: string; disableToggle?: boolean }>;
  visibleColumns: string[];
  onToggleColumn: (columnKey: string) => void;
  sortOptions: Array<{ label: string; value: string }>;
  activeSort?: TableSort;
  onSortChange: (sort?: TableSort) => void;
  onResetColumns: () => void;
  onShowAllColumns: () => void;
  filteredCount?: number;
}

export function BrandFilters({
  activeTab,
  onTabChange,
  tabs = BRAND_STATUS_TABS,
  searchValue,
  onSearchChange,
  isCompletelyEmpty = false,
  columns,
  visibleColumns,
  onToggleColumn,
  sortOptions,
  activeSort,
  onSortChange,
  onResetColumns,
  onShowAllColumns,
  filteredCount = 0,
}: BrandFiltersProps) {
  return (
    <>
      {/* Segmented Status Filter Tabs Row */}
      {!isCompletelyEmpty && (
        <div className="flex items-center gap-1 border-b border-neutral-200 px-4 pt-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3 py-2 text-[13px] font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-t" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Search & Filter Toolbar with TableColumnSettings */}
      <TableSearchFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        placeholder={
          isCompletelyEmpty
            ? "Search and filter"
            : "Search brands by name or website..."
        }
        showColumnsButton={false}
        rightSlot={
          <TableColumnSettings
            columns={columns}
            visibleColumns={visibleColumns}
            onToggleColumn={onToggleColumn}
            sortOptions={sortOptions}
            activeSort={activeSort}
            onSortChange={onSortChange}
            onResetColumns={onResetColumns}
            onShowAllColumns={onShowAllColumns}
            triggerVariant={filteredCount === 0 ? "ghost" : "outline"}
            triggerSize={filteredCount === 0 ? "icon-sm" : "sm"}
            triggerLabel={filteredCount === 0 ? null : "Columns"}
          />
        }
      />
    </>
  );
}
