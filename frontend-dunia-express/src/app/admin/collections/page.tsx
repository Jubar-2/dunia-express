"use client";

import * as React from "react";
import { INITIAL_COLLECTIONS } from "./_data/mock-collections";
import { useCollectionSelection } from "./_hooks";
import { useTableSettings } from "@/hooks/use-table-settings";
import {
  AdminEmptyState,
  AdminFooterLink,
  EmptyStateIllustration,
  TableColumnSettings,
} from "@/components/common";
import { CollectionHeader } from "./_components/collection-filters/collection-header";
import { CollectionTableFilter } from "./_components/collection-filters/collection-table-filter";
import { CollectionTable } from "./_components/collection-table/collection-table";

const COLLECTION_COLUMNS = [
  { key: "title", label: "Title", disableToggle: true },
  { key: "products", label: "Products count" },
  { key: "conditions", label: "Conditions" },
  { key: "status", label: "Status" },
  { key: "updatedAt", label: "Updated at" },
];

const COLLECTION_SORT_OPTIONS = [
  { label: "Title A–Z", value: "title" },
  { label: "Products count", value: "products" },
  { label: "Updated date", value: "updatedAt" },
  { label: "Status", value: "status" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "title",
  "products",
  "conditions",
  "status",
  "updatedAt",
];

export default function CollectionsPage() {
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
    storageKey: "collections_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "title", order: "asc" },
  });

  const filteredAndSortedCollections = React.useMemo(() => {
    let list = [...INITIAL_COLLECTIONS];

    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.conditions.toLowerCase().includes(q)
      );
    }

    if (activeSort?.field) {
      list.sort((a, b) => {
        if (activeSort.field === "title") {
          return activeSort.order === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
        if (activeSort.field === "products") {
          return activeSort.order === "asc"
            ? a.products - b.products
            : b.products - a.products;
        }
        if (activeSort.field === "updatedAt") {
          return activeSort.order === "asc"
            ? (a.updatedAt ?? "").localeCompare(b.updatedAt ?? "")
            : (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
        }
        if (activeSort.field === "status") {
          return activeSort.order === "asc"
            ? (a.status ?? "").localeCompare(b.status ?? "")
            : (b.status ?? "").localeCompare(a.status ?? "");
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
  } = useCollectionSelection(filteredAndSortedCollections.length);

  return (
    <div className="w-full px-8 py-6">
      <CollectionHeader isDataAvailable={filteredAndSortedCollections.length > 0} />

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
        <CollectionTableFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          rightSlot={
            <TableColumnSettings
              columns={COLLECTION_COLUMNS}
              visibleColumns={visibleColumns}
              onToggleColumn={toggleColumn}
              sortOptions={COLLECTION_SORT_OPTIONS}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              onResetColumns={resetColumns}
              onShowAllColumns={() =>
                showAllColumns(COLLECTION_COLUMNS.map((c) => c.key))
              }
              triggerVariant={filteredAndSortedCollections.length === 0 ? "ghost" : "outline"}
              triggerSize={filteredAndSortedCollections.length === 0 ? "icon-sm" : "sm"}
              triggerLabel={filteredAndSortedCollections.length === 0 ? null : "Columns"}
            />
          }
        />

        {filteredAndSortedCollections.length === 0 ? (
          <AdminEmptyState
            illustration={!searchValue ? <EmptyStateIllustration /> : undefined}
            title={searchValue ? "No collections found" : "Manage your collections"}
            description={
              searchValue
                ? `No collections matching "${searchValue}". Try clearing filters.`
                : "Group your products into categories to help customers find what they are looking for."
            }
            primaryAction={
              !searchValue
                ? {
                    label: "Create collection",
                    href: "/admin/collections/new",
                  }
                : undefined
            }
          />
        ) : (
          <CollectionTable
            collections={filteredAndSortedCollections}
            checked={checked}
            allChecked={allChecked}
            someChecked={someChecked}
            onToggleAll={toggleAll}
            onToggleOne={toggleOne}
            showColumn={showColumn}
          />
        )}
      </div>

      <AdminFooterLink
        href="#"
        label="Learn more about collections"
      />
    </div>
  );
}