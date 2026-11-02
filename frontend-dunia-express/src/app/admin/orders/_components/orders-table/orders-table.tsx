"use client";

import * as React from "react";
import {
  AdminEmptyState,
  AdminTableContainer,
  EmptyStateIllustration,
  TableSearchFilter,
} from "@/components/common";
import { OrdersTableHeader } from "./orders-table-header";
import { OrdersTableRow } from "./orders-table-row";
import type { Order } from "../../_types";

export interface OrdersTableProps {
  orders: Order[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (idx: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  rightSlot?: React.ReactNode;
  showColumn?: (key: string) => boolean;
  onCreateOrder?: () => void;
}

const TABS = [
  { id: "all", label: "All" },
  { id: "unfulfilled", label: "Unfulfilled" },
  { id: "unpaid", label: "Unpaid" },
  { id: "open", label: "Open" },
  { id: "closed", label: "Closed" },
];

export function OrdersTable({
  orders,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  searchValue,
  onSearchChange,
  activeTab,
  onTabChange,
  rightSlot,
  showColumn = () => true,
  onCreateOrder,
}: OrdersTableProps) {
  const isCompletelyEmpty = orders.length === 0 && !searchValue && activeTab === "all";

  return (
    <AdminTableContainer>
      {/* Tabs Row (hidden when completely empty to match blueprint) */}
      {!isCompletelyEmpty && (
        <div className="flex items-center gap-1 border-b border-neutral-200 px-4 pt-1.5 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-neutral-900 font-semibold"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-900 rounded-t" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Filter and Search Bar */}
      <TableSearchFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        placeholder={isCompletelyEmpty ? "Search and filter" : "Filter orders by ID, customer, channel..."}
        showColumnsButton={false}
        rightSlot={rightSlot}
      />

      {/* Table or Empty State */}
      {orders.length === 0 ? (
        <AdminEmptyState
          illustration={!searchValue && activeTab === "all" ? <EmptyStateIllustration /> : undefined}
          title={
            searchValue || activeTab !== "all"
              ? "No orders found"
              : "Manage your orders"
          }
          description={
            searchValue
              ? `No orders matching "${searchValue}". Try clearing filters.`
              : activeTab !== "all"
              ? `No ${activeTab} orders found. Try selecting a different view.`
              : "Track and fulfill orders, handle payments, and manage shipping."
          }
          primaryAction={
            !searchValue && activeTab === "all"
              ? {
                  label: "Create order",
                  onClick: onCreateOrder ?? (() => alert("Navigate to create order")),
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <OrdersTableHeader
              allChecked={allChecked}
              someChecked={someChecked}
              onToggleAll={onToggleAll}
              showColumn={showColumn}
            />
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order, idx) => (
                <OrdersTableRow
                  key={order.id}
                  order={order}
                  checked={checked[idx] ?? false}
                  onToggle={() => onToggleOne(idx)}
                  showColumn={showColumn}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminTableContainer>
  );
}
