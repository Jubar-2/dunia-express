"use client";

import { useMemo, useState } from "react";
import { AdminFooterLink } from "@/components/common";
import { useTableSelection } from "@/hooks/use-table-selection";
import { INITIAL_INVENTORY_ITEMS } from "./_data/mock-inventory";
import { InventoryHeader, InventoryTable } from "./_components";
import type { InventoryItem } from "./_types";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(
    INITIAL_INVENTORY_ITEMS
  );
  const [searchValue, setSearchValue] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchValue.trim()) return items;
    const q = searchValue.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.variant.toLowerCase().includes(q)
    );
  }, [items, searchValue]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredItems.length);

  function handleUpdateAvailable(id: string, newVal: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: newVal } : item
      )
    );
  }

  return (
    <div className="w-full px-8 py-6">
      {/* Page Header */}
      <InventoryHeader isDataAvailable={filteredItems.length > 0} />

      {/* Main Inventory Data Table */}
      <InventoryTable
        items={filteredItems}
        checked={checked}
        allChecked={allChecked}
        someChecked={someChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onUpdateAvailable={handleUpdateAvailable}
      />

      <AdminFooterLink
        href="#"
        label="Learn more about managing inventory"
      />
    </div>
  );
}