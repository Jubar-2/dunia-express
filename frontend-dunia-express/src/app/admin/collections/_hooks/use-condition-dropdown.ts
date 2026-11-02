"use client";

import * as React from "react";
import type { UseConditionDropdownReturn } from "../_types";

export function useConditionDropdown(): UseConditionDropdownReturn {
  const [conditionOpen, setConditionOpen] = React.useState(false);
  const conditionRef = React.useRef<HTMLDivElement>(null);

  const toggleCondition = React.useCallback(() => {
    setConditionOpen((prev) => !prev);
  }, []);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        conditionRef.current &&
        !conditionRef.current.contains(e.target as Node)
      ) {
        setConditionOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return {
    conditionOpen,
    setConditionOpen,
    toggleCondition,
    conditionRef,
  };
}
