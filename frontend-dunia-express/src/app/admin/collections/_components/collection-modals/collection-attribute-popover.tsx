import * as React from "react";
import { Search as SearchIcon, ChevronRight } from "lucide-react";
import type { CollectionAttributePopoverProps } from "../../_types";

export function CollectionAttributePopover({
  attributes,
  searchQuery,
  onSearchChange,
  onSelectAttribute,
}: CollectionAttributePopoverProps) {
  return (
    <div className="absolute left-0 top-9 z-10 w-64 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-lg">
      <div className="relative mb-1">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
        <input
          autoFocus
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search attributes"
          className="h-8 w-full rounded-md border border-neutral-200 pl-8 text-xs text-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-300"
        />
      </div>
      <div className="max-h-64 overflow-y-auto">
        {attributes.map((attr) => (
          <button
            key={attr}
            type="button"
            onClick={() => onSelectAttribute?.(attr)}
            className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
          >
            {attr}
            {attr === "Metafield" && (
              <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
