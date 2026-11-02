"use client";

import * as React from "react";
import {
  Columns3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Eye,
  EyeOff,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ColumnSettingItem {
  /**
   * Unique identifier matching table column accessor / ID.
   */
  key: string;
  /**
   * Human-readable label displayed in the column picker.
   */
  label: string;
  /**
   * When true, column visibility cannot be toggled off (e.g. primary identifier or actions).
   */
  disableToggle?: boolean;
}

export interface SortOption {
  /**
   * Display text for the sort field (e.g. "Created date", "Supplier").
   */
  label: string;
  /**
   * Unique field identifier used for sorting.
   */
  value: string;
}

export type SortOrder = "asc" | "desc";

export interface ActiveSort {
  field: string;
  order: SortOrder;
}

export interface TableColumnSettingsProps {
  /**
   * Array of column definitions with key, label, and optional disableToggle.
   */
  columns: Array<{ key: string; label: string; disableToggle?: boolean }>;

  /**
   * Array of keys representing currently visible columns.
   */
  visibleColumns: string[];

  /**
   * Callback fired when a column's visibility is toggled.
   */
  onToggleColumn: (columnKey: string) => void;

  /**
   * Optional sort options to display in the "Sort by" sub-menu.
   */
  sortOptions?: Array<{ label: string; value: string }>;

  /**
   * Currently active sort field and direction.
   */
  activeSort?: { field: string; order: "asc" | "desc" };

  /**
   * Callback fired when the active sort field or direction changes.
   */
  onSortChange?: (sort: { field: string; order: "asc" | "desc" }) => void;

  /**
   * Optional custom trigger button. If not provided, a styled shadcn/ui Button is used.
   */
  trigger?: React.ReactNode;

  /**
   * Variant of the default trigger button (default: "outline").
   */
  triggerVariant?: "outline" | "ghost" | "default" | "secondary";

  /**
   * Size of the default trigger button (default: "sm").
   */
  triggerSize?: "default" | "sm" | "xs" | "icon" | "icon-sm" | "icon-xs";

  /**
   * Text label next to the icon on the default trigger button (default: "Columns").
   * Set to `null` or empty string for an icon-only button.
   */
  triggerLabel?: string | null;

  /**
   * Additional class names for the trigger button.
   */
  triggerClassName?: string;

  /**
   * Additional class names for the dropdown content container.
   */
  contentClassName?: string;

  /**
   * Alignment of the dropdown menu content (default: "end").
   */
  align?: "start" | "center" | "end";

  /**
   * Visual toggle variant: "eye" (Eye/EyeOff icons) or "checkbox".
   * Default is "eye" to match the prototype.
   */
  toggleVariant?: "eye" | "checkbox";

  /**
   * Optional callback to reset visible columns back to defaults.
   */
  onResetColumns?: () => void;

  /**
   * Optional callback to show all columns at once.
   */
  onShowAllColumns?: () => void;
}

/**
 * Production-ready table column visibility and sorting dropdown component.
 * Built with shadcn/ui DropdownMenu primitives for full keyboard navigation and accessibility.
 */
export function TableColumnSettings({
  columns,
  visibleColumns,
  onToggleColumn,
  sortOptions,
  activeSort,
  onSortChange,
  trigger,
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerLabel = "Columns",
  triggerClassName,
  contentClassName,
  align = "end",
  toggleVariant = "eye",
  onResetColumns,
  onShowAllColumns,
}: TableColumnSettingsProps) {
  // Find currently active sort option label
  const activeSortOption = React.useMemo(() => {
    if (!activeSort?.field || !sortOptions?.length) return null;
    return sortOptions.find((opt) => opt.value === activeSort.field);
  }, [activeSort?.field, sortOptions]);

  const hasSort = Boolean(sortOptions && sortOptions.length > 0);
  const visibleCount = visibleColumns.length;
  const totalCount = columns.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            type="button"
            variant={triggerVariant}
            size={triggerSize}
            aria-label="Table column and sort settings"
            className={cn(
              "h-8 gap-1.5 border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 shadow-none hover:bg-neutral-100/80 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900",
              !triggerLabel && "w-8 px-0",
              triggerClassName
            )}
          >
            <Columns3 className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
            {/* {triggerLabel && <span>{triggerLabel}</span>} */}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={6}
        className={cn(
          "w-64 rounded-lg border border-neutral-200/90 bg-white p-1.5 text-neutral-800 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200",
          contentClassName
        )}
      >
        {/* Sort by sub-menu */}
        {hasSort && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors focus:bg-neutral-100 hover:bg-neutral-50 dark:text-neutral-300 dark:focus:bg-neutral-900 dark:hover:bg-neutral-900">
                <span className="flex items-center gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Sort by</span>
                </span>
                <span className="flex items-center gap-1 text-[11px] font-normal text-neutral-500">
                  {activeSortOption ? (
                    <>
                      <span className="max-w-[80px] truncate">
                        {activeSortOption.label}
                      </span>
                      {activeSort?.order === "desc" ? (
                        <ArrowDown className="h-3 w-3 text-neutral-400" />
                      ) : (
                        <ArrowUp className="h-3 w-3 text-neutral-400" />
                      )}
                    </>
                  ) : (
                    <span className="text-neutral-400">Default</span>
                  )}
                </span>
              </DropdownMenuSubTrigger>

              <DropdownMenuSubContent
                sideOffset={4}
                alignOffset={-4}
                className="w-56 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-neutral-800 dark:bg-neutral-950"
              >
                {/* Sort Field Options */}
                <DropdownMenuRadioGroup
                  value={activeSort?.field}
                  onValueChange={(val) => {
                    if (val && onSortChange) {
                      onSortChange({
                        field: val,
                        order: activeSort?.order ?? "asc",
                      });
                    }
                  }}
                >
                  <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Sort by
                  </DropdownMenuLabel>
                  {sortOptions!.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value}
                      value={opt.value}
                      className="cursor-pointer px-2 py-1.5 text-xs text-neutral-700 focus:bg-neutral-100 dark:text-neutral-300 dark:focus:bg-neutral-900"
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator className="-mx-1.5 my-1.5 bg-neutral-200 dark:bg-neutral-800" />

                {/* Sort Direction */}
                <DropdownMenuRadioGroup
                  value={activeSort?.order ?? "asc"}
                  onValueChange={(val) => {
                    if ((val === "asc" || val === "desc") && onSortChange) {
                      onSortChange({
                        field: activeSort?.field ?? sortOptions![0]?.value ?? "",
                        order: val,
                      });
                    }
                  }}
                >
                  <DropdownMenuLabel className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Direction
                  </DropdownMenuLabel>
                  <DropdownMenuRadioItem
                    value="asc"
                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs text-neutral-700 focus:bg-neutral-100 dark:text-neutral-300 dark:focus:bg-neutral-900"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Ascending (A–Z, 0–9)</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="desc"
                    className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs text-neutral-700 focus:bg-neutral-100 dark:text-neutral-300 dark:focus:bg-neutral-900"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Descending (Z–A, 9–0)</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator className="-mx-1.5 my-1.5 bg-neutral-200 dark:bg-neutral-800" />
          </>
        )}

        {/* Columns Section */}
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-2.5 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <span>Columns</span>
            <span className="text-[10px] font-normal lowercase tracking-normal text-neutral-400">
              {visibleCount}/{totalCount} shown
            </span>
          </div>

          {/* Column items list */}
          <div className="max-h-64 space-y-0.5 overflow-y-auto pr-0.5">
            {columns.map((col) => {
              const isVisible = visibleColumns.includes(col.key);
              const isDisabled = Boolean(col.disableToggle);

              return (
                <DropdownMenuItem
                  key={col.key}
                  disabled={isDisabled}
                  closeOnClick={false}
                  onSelect={(e) => {
                    e.preventDefault();
                    if (!isDisabled) {
                      onToggleColumn(col.key);
                    }
                  }}
                  className={cn(
                    "group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-neutral-700 transition-colors focus:bg-neutral-100 hover:bg-neutral-50 dark:text-neutral-300 dark:focus:bg-neutral-900 dark:hover:bg-neutral-900 select-none",
                    isDisabled &&
                      "cursor-not-allowed opacity-50 text-neutral-400 hover:bg-transparent"
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <GripVertical
                      className={cn(
                        "h-3.5 w-3.5 shrink-0 transition-colors",
                        isDisabled
                          ? "text-neutral-300 dark:text-neutral-700"
                          : "text-neutral-300 group-hover:text-neutral-500 dark:text-neutral-600 cursor-grab"
                      )}
                    />
                    <span className="truncate font-normal">{col.label}</span>
                  </span>

                  {toggleVariant === "checkbox" ? (
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                        isVisible
                          ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                          : "border-neutral-300 bg-transparent text-transparent dark:border-neutral-700"
                      )}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "flex h-4 w-4 shrink-0 items-center justify-center transition-colors",
                        isVisible
                          ? "text-neutral-500 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                          : "text-neutral-300 group-hover:text-neutral-400 dark:text-neutral-600 dark:group-hover:text-neutral-500"
                      )}
                    >
                      {isVisible ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </span>
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        </DropdownMenuGroup>

        {/* Optional Action Footer */}
        {(onResetColumns || onShowAllColumns) && (
          <>
            <DropdownMenuSeparator className="-mx-1.5 my-1.5 bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex items-center justify-between px-1.5 py-0.5">
              {onShowAllColumns && (
                <button
                  type="button"
                  onClick={onShowAllColumns}
                  className="rounded px-1.5 py-0.5 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                >
                  Show all
                </button>
              )}
              {onResetColumns && (
                <button
                  type="button"
                  onClick={onResetColumns}
                  className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
