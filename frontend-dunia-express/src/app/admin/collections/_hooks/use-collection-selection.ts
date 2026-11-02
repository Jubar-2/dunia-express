"use client";

import { useTableSelection } from "@/hooks/use-table-selection";
import type { UseCollectionSelectionReturn } from "../_types";

export function useCollectionSelection(initialLength: number): UseCollectionSelectionReturn {
  return useTableSelection(initialLength);
}
