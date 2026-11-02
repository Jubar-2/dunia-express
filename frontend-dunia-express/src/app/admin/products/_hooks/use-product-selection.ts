"use client";

import { useTableSelection } from "@/hooks/use-table-selection";

export function useProductSelection(count: number) {
  return useTableSelection(count);
}
