"use client";

import * as React from "react";
import { Search, ChevronDown, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TableSearchFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  viewLabel?: string;
  onViewClick?: () => void;
  showColumnsButton?: boolean;
  onColumnsClick?: () => void;
  isColumnsActive?: boolean;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function TableSearchFilter({
  searchValue = "",
  onSearchChange,
  placeholder = "Search and filter",
  viewLabel = "All",
  onViewClick,
  showColumnsButton = true,
  onColumnsClick,
  isColumnsActive = false,
  rightSlot,
  children,
  className,
}: TableSearchFilterProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 border-b border-neutral-200 px-4 py-2.5",
        className
      )}
    >
      <button
        type="button"
        onClick={onViewClick}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        <span>{viewLabel}</span>
        <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
      </button>

      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={placeholder}
          className="h-8 w-full rounded-md border-none bg-transparent pl-8 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
        />
      </div>

      {rightSlot}

      {showColumnsButton && (
        <button
          type="button"
          onClick={onColumnsClick}
          aria-label="Toggle columns"
          className={cn(
            "rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 transition-colors",
            isColumnsActive && "bg-neutral-100 text-neutral-900"
          )}
        >
          <Columns3 className="h-4 w-4" />
        </button>
      )}

      {children}
    </div>
  );
}
