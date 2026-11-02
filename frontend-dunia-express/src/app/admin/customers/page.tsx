"use client";

import * as React from "react";
import {
  AdminEmptyState,
  AdminFooterLink,
  AdminTableContainer,
  EmptyStateIllustration,
} from "@/components/common";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useTableSettings } from "@/hooks/use-table-settings";
import {
  CustomerHeader,
  CustomerMetrics,
  CustomerFilters,
  CustomerTable,
  CustomerFormModal,
} from "./_components";
import {
  INITIAL_CUSTOMERS,
  MOCK_CUSTOMER_METRICS,
} from "./_data/mock-customers";
import type { Customer, CustomerFormData } from "./_types/customer.types";

const CUSTOMER_COLUMNS = [
  { key: "customer", label: "Customer", disableToggle: true },
  { key: "location", label: "Location" },
  { key: "orders", label: "Orders" },
  { key: "spent", label: "Total Spent" },
  { key: "marketing", label: "Marketing" },
  { key: "lastOrder", label: "Last Order" },
  { key: "actions", label: "Actions", disableToggle: true },
];

const CUSTOMER_SORT_OPTIONS = [
  { label: "Total spent (High to Low)", value: "spent_desc" },
  { label: "Total spent (Low to High)", value: "spent_asc" },
  { label: "Orders count (High to Low)", value: "orders_desc" },
  { label: "Orders count (Low to High)", value: "orders_asc" },
  { label: "Name (A–Z)", value: "name_asc" },
  { label: "Name (Z–A)", value: "name_desc" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "customer",
  "location",
  "orders",
  "spent",
  "marketing",
  "lastOrder",
  "actions",
];

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
  "bg-fuchsia-100 text-fuchsia-700",
];

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>(INITIAL_CUSTOMERS);
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);

  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "customers_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "spent_desc", order: "desc" },
  });

  // Filter & Sort Logic
  const filteredAndSortedCustomers = React.useMemo(() => {
    let list = [...customers];

    // Filter by tab
    if (activeTab === "new") {
      list = list.filter((c) => c.segment === "new");
    } else if (activeTab === "returning") {
      list = list.filter((c) => c.segment === "returning");
    } else if (activeTab === "subscribed") {
      list = list.filter((c) => c.marketingStatus === "subscribed");
    } else if (activeTab === "abandoned") {
      list = list.filter((c) => c.segment === "abandoned");
    }

    // Filter by search query (name, email, phone)
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.location.city.toLowerCase().includes(q) ||
          c.location.country.toLowerCase().includes(q)
      );
    }

    // Sort
    if (activeSort?.field) {
      list.sort((a, b) => {
        if (activeSort.field === "spent_desc") {
          return b.totalSpent - a.totalSpent;
        }
        if (activeSort.field === "spent_asc") {
          return a.totalSpent - b.totalSpent;
        }
        if (activeSort.field === "orders_desc") {
          return b.ordersCount - a.ordersCount;
        }
        if (activeSort.field === "orders_asc") {
          return a.ordersCount - b.ordersCount;
        }
        if (activeSort.field === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (activeSort.field === "name_desc") {
          return b.name.localeCompare(a.name);
        }
        return 0;
      });
    }

    return list;
  }, [customers, searchValue, activeTab, activeSort]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredAndSortedCustomers.length);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  const handleSaveCustomer = (formData: CustomerFormData, editingId?: string) => {
    if (editingId) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: {
                  ...c.location,
                  city: formData.city,
                  country: formData.country,
                },
                marketingStatus: formData.marketingStatus,
                segment: formData.segment,
                note: formData.note,
              }
            : c
        )
      );
    } else {
      const colorIndex = customers.length % AVATAR_COLORS.length;
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: {
          city: formData.city,
          country: formData.country,
          flag: "📍",
        },
        ordersCount: 0,
        totalSpent: 0.0,
        marketingStatus: formData.marketingStatus,
        lastOrderDate: "Never",
        segment: formData.segment,
        avatarColor: AVATAR_COLORS[colorIndex],
        note: formData.note,
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }
  };

  const isCompletelyEmpty =
    filteredAndSortedCustomers.length === 0 && !searchValue && activeTab === "all";

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      {/* Page Header */}
      <CustomerHeader
        onAddCustomer={handleOpenAddModal}
        isDataAvailable={customers.length > 0}
      />

      {/* Top 4 KPI Metrics Summary Cards */}
      {customers.length > 0 && (
        <CustomerMetrics metrics={MOCK_CUSTOMER_METRICS} />
      )}

      {/* Main Table Container */}
      <AdminTableContainer>
        {/* Customer Filter Tabs & Search Bar */}
        <CustomerFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          isCompletelyEmpty={isCompletelyEmpty}
          columns={CUSTOMER_COLUMNS}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
          sortOptions={CUSTOMER_SORT_OPTIONS}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          onResetColumns={resetColumns}
          onShowAllColumns={() =>
            showAllColumns(CUSTOMER_COLUMNS.map((c) => c.key))
          }
          filteredCount={filteredAndSortedCustomers.length}
        />

        {/* Table or Empty State */}
        {filteredAndSortedCustomers.length === 0 ? (
          <AdminEmptyState
            illustration={
              !searchValue && activeTab === "all" ? (
                <EmptyStateIllustration />
              ) : undefined
            }
            title={
              searchValue || activeTab !== "all"
                ? "No customers found"
                : "Manage your customers"
            }
            description={
              searchValue
                ? `No customers matching "${searchValue}". Try clearing filters.`
                : activeTab !== "all"
                ? `No ${activeTab} customers found. Try selecting another tab.`
                : "Everything you need to know about your customers in one place."
            }
            primaryAction={
              !searchValue && activeTab === "all"
                ? {
                    label: "Add customer",
                    onClick: handleOpenAddModal,
                  }
                : undefined
            }
          />
        ) : (
          <CustomerTable
            customers={filteredAndSortedCustomers}
            checked={checked}
            allChecked={allChecked}
            someChecked={someChecked}
            onToggleAll={toggleAll}
            onToggleOne={toggleOne}
            showColumn={showColumn}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        )}
      </AdminTableContainer>

      {/* Footer Link */}
      <AdminFooterLink
        href="#"
        label="Learn more about managing customers and customer segments"
      />

      {/* Quick Add / Edit Customer Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomer}
        editingCustomer={editingCustomer}
      />
    </div>
  );
}
