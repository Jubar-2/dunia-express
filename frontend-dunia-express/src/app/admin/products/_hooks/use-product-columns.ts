"use client";

import * as React from "react";
import type { UseProductColumnsReturn } from "../_types";

export function useProductColumns(): UseProductColumnsReturn {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [hideArchived, setHideArchived] = React.useState(false);
  const [hiddenCols, setHiddenCols] = React.useState<Set<string>>(new Set());
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggleCol = React.useCallback((key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const showCol = React.useCallback(
    (key: string) => !hiddenCols.has(key),
    [hiddenCols]
  );

  return {
    menuOpen,
    setMenuOpen,
    hideArchived,
    setHideArchived,
    hiddenCols,
    toggleCol,
    showCol,
    menuRef,
  };
}
