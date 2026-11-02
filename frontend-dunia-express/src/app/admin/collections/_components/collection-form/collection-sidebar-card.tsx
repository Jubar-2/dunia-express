import * as React from "react";
import { Tag, ChevronDown, Plus, Search as SearchIcon } from "lucide-react";
import { CollectionAttributePopover } from "../collection-modals/collection-attribute-popover";
import type { CollectionSidebarCardProps } from "../../_types";

export function CollectionSidebarCard({
  attributes,
  isConditionOpen,
  conditionRef,
  onToggleCondition,
  onAddProducts,
  onExcludeClick,
}: CollectionSidebarCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-1.5 font-medium text-neutral-900">
          <Tag className="h-4 w-4 text-neutral-500" />
          Products
          <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
        </div>

        <div className="relative flex flex-col gap-2" ref={conditionRef}>
          <button
            type="button"
            onClick={onToggleCondition}
            className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add condition
          </button>
          <button
            type="button"
            onClick={onAddProducts}
            className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            Add products
          </button>

          {isConditionOpen && (
            <CollectionAttributePopover attributes={attributes} />
          )}
        </div>

        <button
          type="button"
          onClick={onExcludeClick}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900"
        >
          <Plus className="h-3.5 w-3.5" />
          Exclude
        </button>
      </div>

      <button
        type="button"
        className="flex items-center justify-center rounded-xl border border-neutral-200 bg-white py-2.5 text-neutral-400 shadow-sm hover:bg-neutral-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
