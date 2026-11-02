"use client";

import * as React from "react";
import { AdminFooterLink, TableColumnSettings } from "@/components/common";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useTableSettings } from "@/hooks/use-table-settings";
import { OrdersHeader, OrdersTable } from "./_components";
import { INITIAL_ORDERS } from "./_data/mock-orders";

const ORDER_COLUMNS = [
  { key: "orderNumber", label: "Order", disableToggle: true },
  { key: "date", label: "Date" },
  { key: "customer", label: "Customer" },
  { key: "channel", label: "Sales channel" },
  { key: "total", label: "Total" },
  { key: "paymentStatus", label: "Payment status" },
  { key: "fulfillmentStatus", label: "Fulfillment status" },
  { key: "items", label: "Items" },
  { key: "deliveryMethod", label: "Delivery" },
];

const ORDER_SORT_OPTIONS = [
  { label: "Order number", value: "orderNumber" },
  { label: "Date (newest first)", value: "date" },
  { label: "Total amount", value: "total" },
  { label: "Customer name", value: "customer" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "orderNumber",
  "date",
  "customer",
  "channel",
  "total",
  "paymentStatus",
  "fulfillmentStatus",
  "items",
  "deliveryMethod",
];

export default function OrdersPage() {
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "orders_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "date", order: "desc" },
  });

  const filteredAndSortedOrders = React.useMemo(() => {
    let list = [...INITIAL_ORDERS];

    // Filter by tab
    if (activeTab === "unfulfilled") {
      list = list.filter((o) => o.fulfillmentStatus === "unfulfilled");
    } else if (activeTab === "unpaid") {
      list = list.filter((o) => o.paymentStatus !== "paid");
    } else if (activeTab === "open") {
      list = list.filter((o) => o.fulfillmentStatus !== "fulfilled");
    } else if (activeTab === "closed") {
      list = list.filter((o) => o.fulfillmentStatus === "fulfilled");
    }

    // Filter by search query
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          o.channel.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort?.field) {
      list.sort((a, b) => {
        if (activeSort.field === "orderNumber") {
          return activeSort.order === "asc"
            ? a.orderNumber.localeCompare(b.orderNumber)
            : b.orderNumber.localeCompare(a.orderNumber);
        }
        if (activeSort.field === "total") {
          return activeSort.order === "asc"
            ? a.total - b.total
            : b.total - a.total;
        }
        if (activeSort.field === "customer") {
          return activeSort.order === "asc"
            ? a.customer.name.localeCompare(b.customer.name)
            : b.customer.name.localeCompare(a.customer.name);
        }
        return 0;
      });
    }

    return list;
  }, [searchValue, activeTab, activeSort]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredAndSortedOrders.length);

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      <OrdersHeader
        isDataAvailable={filteredAndSortedOrders.length > 0}
        onExport={() => alert("Exporting orders...")}
        onCreateOrder={() => alert("Navigate to create order")}
      />

      <OrdersTable
        orders={filteredAndSortedOrders}
        checked={checked}
        allChecked={allChecked}
        someChecked={someChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showColumn={showColumn}
        onCreateOrder={() => alert("Navigate to create order")}
        rightSlot={
          <TableColumnSettings
            columns={ORDER_COLUMNS}
            visibleColumns={visibleColumns}
            onToggleColumn={toggleColumn}
            sortOptions={ORDER_SORT_OPTIONS}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            onResetColumns={resetColumns}
            onShowAllColumns={() =>
              showAllColumns(ORDER_COLUMNS.map((c) => c.key))
            }
            triggerVariant={filteredAndSortedOrders.length === 0 ? "ghost" : "outline"}
            triggerSize={filteredAndSortedOrders.length === 0 ? "icon-sm" : "sm"}
            triggerLabel={filteredAndSortedOrders.length === 0 ? null : "Columns"}
          />
        }
      />

      <AdminFooterLink
        href="#"
        label="Learn more about orders"
      />
    </div>
  );
}