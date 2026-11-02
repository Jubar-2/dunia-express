"use client";

import * as React from "react";
import {
  ArrowUpDown,
  Archive as ArchiveIcon,
  ChevronDown,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface ColumnItem {
  key: string;
  label: string;
  hideable: boolean;
}

export interface ColumnVisibilityDropdownProps {
  isOpen: boolean;
  onClose?: () => void;
  columns: readonly ColumnItem[];
  hiddenColumns: Set<string>;
  onToggleColumn: (key: string) => void;
  hideArchived?: boolean;
  onToggleHideArchived?: (val: boolean) => void;
  sortByLabel?: string;
  onSortClick?: () => void;
  className?: string;
  dropdownRef?: React.RefObject<HTMLDivElement | null>;
}

export function ColumnVisibilityDropdown({
  isOpen,
  columns,
  hiddenColumns,
  onToggleColumn,
  hideArchived = false,
  onToggleHideArchived,
  sortByLabel = "Created",
  onSortClick,
  className,
  dropdownRef,
}: ColumnVisibilityDropdownProps) {
  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        "absolute right-4 top-11 z-20 w-64 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xl",
        className
      )}
    >
      {/* Sort row */}
      <button
        type="button"
        onClick={onSortClick}
        className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-neutral-500" />
          Sort by
        </span>
        <span className="flex items-center gap-1 text-neutral-500 text-xs">
          {sortByLabel}
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* Hide archived toggle */}
      {onToggleHideArchived && (
        <div className="flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-neutral-700">
          <span className="flex items-center gap-2">
            <ArchiveIcon className="h-4 w-4 text-neutral-500" />
            Hide archived
          </span>
          <Switch
            checked={hideArchived}
            onCheckedChange={onToggleHideArchived}
            aria-label="Hide archived items"
          />
        </div>
      )}

      <div className="my-1.5 h-px bg-neutral-200" />
      <div className="px-2.5 pb-1 pt-0.5 text-xs font-medium text-neutral-400">
        Columns
      </div>

      {columns.map((col) => {
        const isVisible = !hiddenColumns.has(col.key);
        return (
          <div
            key={col.key}
            className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <GripVertical className="h-3.5 w-3.5 cursor-grab text-neutral-300" />
              <span className={cn(!col.hideable && "text-neutral-400")}>
                {col.label}
              </span>
            </span>

            {col.hideable ? (
              <button
                type="button"
                onClick={() => onToggleColumn(col.key)}
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                aria-label={isVisible ? `Hide ${col.label}` : `Show ${col.label}`}
              >
                {isVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            ) : (
              <EyeOff className="h-4 w-4 text-neutral-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
