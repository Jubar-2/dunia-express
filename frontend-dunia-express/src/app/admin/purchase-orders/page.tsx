"use client";

import * as React from "react";
import {
  AdminEmptyState,
  AdminFooterLink,
  AdminTableContainer,
  TableColumnSettings,
  TableSearchFilter,
} from "@/components/common";
import { useTableSettings } from "@/hooks/use-table-settings";
import PurchaseOrdersHeader from "./_components/purchase-orders-header";
import { PurchaseOrderIllustration } from "./_components/purchase-order-illustration";

const columnDefs = [
  { key: "supplier", label: "Supplier" },
  { key: "destination", label: "Destination" },
  { key: "status", label: "Status" },
  { key: "linkedTransfer", label: "Linked transfer" },
  { key: "received", label: "Received" },
  { key: "total", label: "Total" },
  { key: "expectedArrival", label: "Expected arrival" },
];

const sortOptions = [
  { label: "Created date", value: "created" },
  { label: "Supplier", value: "supplier" },
  { label: "Destination", value: "destination" },
  { label: "Status", value: "status" },
  { label: "Total", value: "total" },
  { label: "Expected arrival", value: "expectedArrival" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "supplier",
  "destination",
  "status",
  "linkedTransfer",
  "received",
  "total",
  "expectedArrival",
];

export default function PurchaseOrdersPage() {
  const [searchValue, setSearchValue] = React.useState("");

  const {
    visibleColumns,
    toggleColumn,
    activeSort,
    setActiveSort,
    resetColumns,
    showAllColumns,
  } = useTableSettings({
    storageKey: "purchase_orders_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "created", order: "desc" },
  });

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      <PurchaseOrdersHeader isDataAvailable={false} />

      <AdminTableContainer>
        {/* Filter bar */}
        <TableSearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder="Search and filter"
          showColumnsButton={false}
          rightSlot={
            <TableColumnSettings
              columns={columnDefs}
              visibleColumns={visibleColumns}
              onToggleColumn={toggleColumn}
              sortOptions={sortOptions}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              onResetColumns={resetColumns}
              onShowAllColumns={() =>
                showAllColumns(columnDefs.map((c) => c.key))
              }
              triggerVariant="ghost"
              triggerSize="icon-sm"
              triggerLabel={null}
            />
          }
        />

        {/* Empty state */}
        <AdminEmptyState
          illustration={<PurchaseOrderIllustration />}
          title="Manage your purchase orders"
          description="Track and receive inventory ordered from suppliers."
          primaryAction={{
            label: "Create purchase order",
            href: "/admin/purchase-orders/new",
          }}
        />
      </AdminTableContainer>

      <AdminFooterLink
        href="#"
        label="Learn more about purchase orders"
      />
    </div>
  );
}