"use client";

import * as React from "react";
import { AdminFooterLink, TableColumnSettings } from "@/components/common";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useTableSettings } from "@/hooks/use-table-settings";
import { TransfersHeader, TransfersTable } from "./_components";
import { INITIAL_TRANSFERS } from "./_data/mock-transfers";

const TRANSFER_COLUMNS = [
  { key: "transferNumber", label: "Transfer", disableToggle: true },
  { key: "origin", label: "Origin" },
  { key: "destination", label: "Destination" },
  { key: "status", label: "Status" },
  { key: "itemsCount", label: "Items" },
  { key: "expectedDate", label: "Expected arrival" },
];

const TRANSFER_SORT_OPTIONS = [
  { label: "Transfer number", value: "transferNumber" },
  { label: "Origin", value: "origin" },
  { label: "Destination", value: "destination" },
  { label: "Status", value: "status" },
  { label: "Items count", value: "itemsCount" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "transferNumber",
  "origin",
  "destination",
  "status",
  "itemsCount",
  "expectedDate",
];

export default function TransfersPage() {
  const [searchValue, setSearchValue] = React.useState("");

  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "transfers_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "transferNumber", order: "desc" },
  });

  const filteredAndSortedTransfers = React.useMemo(() => {
    let list = [...INITIAL_TRANSFERS];

    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (t) =>
          t.transferNumber.toLowerCase().includes(q) ||
          t.origin.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q)
      );
    }

    if (activeSort?.field) {
      list.sort((a, b) => {
        if (activeSort.field === "transferNumber") {
          return activeSort.order === "asc"
            ? a.transferNumber.localeCompare(b.transferNumber)
            : b.transferNumber.localeCompare(a.transferNumber);
        }
        if (activeSort.field === "origin") {
          return activeSort.order === "asc"
            ? a.origin.localeCompare(b.origin)
            : b.origin.localeCompare(a.origin);
        }
        if (activeSort.field === "destination") {
          return activeSort.order === "asc"
            ? a.destination.localeCompare(b.destination)
            : b.destination.localeCompare(a.destination);
        }
        if (activeSort.field === "itemsCount") {
          return activeSort.order === "asc"
            ? a.itemsCount - b.itemsCount
            : b.itemsCount - a.itemsCount;
        }
        return 0;
      });
    }

    return list;
  }, [searchValue, activeSort]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredAndSortedTransfers.length);

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      <TransfersHeader
        isDataAvailable={filteredAndSortedTransfers.length > 0}
        onCreateTransfer={() => alert("Create transfer action")}
      />

      <TransfersTable
        transfers={filteredAndSortedTransfers}
        checked={checked}
        allChecked={allChecked}
        someChecked={someChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showColumn={showColumn}
        rightSlot={
          <TableColumnSettings
            columns={TRANSFER_COLUMNS}
            visibleColumns={visibleColumns}
            onToggleColumn={toggleColumn}
            sortOptions={TRANSFER_SORT_OPTIONS}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            onResetColumns={resetColumns}
            onShowAllColumns={() =>
              showAllColumns(TRANSFER_COLUMNS.map((c) => c.key))
            }
            triggerVariant={filteredAndSortedTransfers.length === 0 ? "ghost" : "outline"}
            triggerSize={filteredAndSortedTransfers.length === 0 ? "icon-sm" : "sm"}
            triggerLabel={filteredAndSortedTransfers.length === 0 ? null : "Columns"}
          />
        }
      />

      <AdminFooterLink
        href="#"
        label="Learn more about transfers"
      />
    </div>
  );
}