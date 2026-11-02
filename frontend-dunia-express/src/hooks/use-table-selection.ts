"use client";

import * as React from "react";

export interface UseTableSelectionReturn {
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  toggleAll: () => void;
  toggleOne: (index: number) => void;
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export function useTableSelection(initialLength: number): UseTableSelectionReturn {
  const [checked, setChecked] = React.useState<boolean[]>(() =>
    Array.from({ length: initialLength }, () => false)
  );

  const allChecked = checked.length > 0 && checked.every(Boolean);
  const someChecked = checked.some(Boolean);

  const toggleAll = React.useCallback(() => {
    setChecked((prev) => {
      const isAll = prev.every(Boolean);
      return prev.map(() => !isAll);
    });
  }, []);

  const toggleOne = React.useCallback((i: number) => {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }, []);

  return {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
    setChecked,
  };
}
