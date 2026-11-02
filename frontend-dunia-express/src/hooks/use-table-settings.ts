"use client";

import * as React from "react";

export interface TableSort {
  field: string;
  order: "asc" | "desc";
}

export interface UseTableSettingsOptions {
  /**
   * Unique key for persisting settings in localStorage.
   * If omitted, settings are kept in memory only.
   */
  storageKey?: string;
  /**
   * Default list of visible column keys.
   */
  defaultVisibleColumns: string[];
  /**
   * Default active sorting configuration.
   */
  defaultSort?: TableSort;
}

export interface UseTableSettingsReturn {
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  toggleColumn: (key: string) => void;
  showColumn: (key: string) => boolean;
  resetColumns: () => void;
  showAllColumns: (allKeys: string[]) => void;
  activeSort?: TableSort;
  setActiveSort: (sort: TableSort | undefined) => void;
}

/**
 * Reusable hook to manage table column visibility, sorting, and optional localStorage persistence.
 * Safe for SSR with deferred hydration to avoid hydration mismatch warnings.
 */
export function useTableSettings({
  storageKey,
  defaultVisibleColumns,
  defaultSort,
}: UseTableSettingsOptions): UseTableSettingsReturn {
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(
    defaultVisibleColumns
  );
  const [activeSort, setActiveSortState] = React.useState<
    TableSort | undefined
  >(defaultSort);
  const [isHydrated, setIsHydrated] = React.useState(false);

  const setActiveSort = React.useCallback(
    (sort: TableSort | undefined) => {
      setActiveSortState(sort);
    },
    []
  );

  // Rehydrate saved preferences from localStorage on client-side mount
  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      setIsHydrated(true);
      return;
    }

    try {
      const savedData = localStorage.getItem(`table_settings_${storageKey}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed.visibleColumns)) {
          setVisibleColumns(parsed.visibleColumns);
        }
        if (
          parsed.activeSort &&
          typeof parsed.activeSort === "object" &&
          "field" in parsed.activeSort &&
          "order" in parsed.activeSort
        ) {
          setActiveSort(parsed.activeSort);
        }
      }
    } catch {
      // Storage unavailable or corrupted; fallback to defaults silently
    } finally {
      setIsHydrated(true);
    }
  }, [storageKey]);

  // Persist preferences to localStorage whenever state updates
  React.useEffect(() => {
    if (!storageKey || !isHydrated || typeof window === "undefined") return;

    try {
      localStorage.setItem(
        `table_settings_${storageKey}`,
        JSON.stringify({ visibleColumns, activeSort })
      );
    } catch {
      // Storage quota or private browsing errors handled gracefully
    }
  }, [storageKey, visibleColumns, activeSort, isHydrated]);

  const toggleColumn = React.useCallback((key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const showColumn = React.useCallback(
    (key: string) => visibleColumns.includes(key),
    [visibleColumns]
  );

  const resetColumns = React.useCallback(() => {
    setVisibleColumns(defaultVisibleColumns);
  }, [defaultVisibleColumns]);

  const showAllColumns = React.useCallback((allKeys: string[]) => {
    setVisibleColumns(allKeys);
  }, []);

  return {
    visibleColumns,
    setVisibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  };
}
