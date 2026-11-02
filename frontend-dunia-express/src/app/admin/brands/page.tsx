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
  BrandHeader,
  BrandFilters,
  BrandTable,
  BrandFormModal,
} from "./_components";
import { INITIAL_BRANDS } from "./_data/mock-brands";
import type { Brand, BrandFormData } from "./_types/brand.types";

const BRAND_COLUMNS = [
  { key: "brand", label: "Brand", disableToggle: true },
  { key: "website", label: "Website" },
  { key: "products", label: "Products" },
  { key: "featured", label: "Featured" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created Date" },
  { key: "actions", label: "Actions", disableToggle: true },
];

const BRAND_SORT_OPTIONS = [
  { label: "Brand name (A–Z)", value: "name_asc" },
  { label: "Brand name (Z–A)", value: "name_desc" },
  { label: "Products count (High to Low)", value: "products_desc" },
  { label: "Products count (Low to High)", value: "products_asc" },
  { label: "Created date (Newest first)", value: "created_desc" },
  { label: "Created date (Oldest first)", value: "created_asc" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "brand",
  "website",
  "products",
  "featured",
  "status",
  "createdAt",
  "actions",
];

export default function BrandsPage() {
  const [brands, setBrands] = React.useState<Brand[]>(INITIAL_BRANDS);
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);

  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "brands_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "name_asc", order: "asc" },
  });

  // Filter & Sort Logic
  const filteredAndSortedBrands = React.useMemo(() => {
    let list = [...brands];

    // Filter by tab
    if (activeTab === "active") {
      list = list.filter((b) => b.status === "active");
    } else if (activeTab === "inactive") {
      list = list.filter((b) => b.status === "inactive");
    }

    // Filter by search query (name, slug, website)
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          (b.website && b.website.toLowerCase().includes(q))
      );
    }

    // Sort
    if (activeSort?.field) {
      list.sort((a, b) => {
        if (activeSort.field === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (activeSort.field === "name_desc") {
          return b.name.localeCompare(a.name);
        }
        if (activeSort.field === "products_desc") {
          return b.productsCount - a.productsCount;
        }
        if (activeSort.field === "products_asc") {
          return a.productsCount - b.productsCount;
        }
        if (activeSort.field === "created_desc") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (activeSort.field === "created_asc") {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        return 0;
      });
    }

    return list;
  }, [brands, searchValue, activeTab, activeSort]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredAndSortedBrands.length);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = (brandId: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== brandId));
  };

  const handleToggleFeatured = (brandId: string) => {
    setBrands((prev) =>
      prev.map((b) =>
        b.id === brandId ? { ...b, isFeatured: !b.isFeatured } : b
      )
    );
  };

  const handleSaveBrand = (formData: BrandFormData, editingId?: string) => {
    if (editingId) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? {
                ...b,
                name: formData.name,
                slug: formData.slug,
                logoUrl: formData.logoUrl,
                website: formData.website,
                description: formData.description,
                isFeatured: formData.isFeatured,
                status: formData.status,
              }
            : b
        )
      );
    } else {
      const newBrand: Brand = {
        id: `brand-${Date.now()}`,
        name: formData.name,
        slug: formData.slug,
        logoUrl: formData.logoUrl,
        website: formData.website,
        description: formData.description,
        productsCount: 0,
        isFeatured: formData.isFeatured,
        status: formData.status,
        createdAt: new Date().toISOString(),
      };
      setBrands((prev) => [newBrand, ...prev]);
    }
  };

  const isCompletelyEmpty =
    filteredAndSortedBrands.length === 0 && !searchValue && activeTab === "all";

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      {/* Page Header */}
      <BrandHeader
        onAddBrand={handleOpenAddModal}
        isDataAvailable={brands.length > 0}
      />

      <AdminTableContainer>
        {/* Filter Toolbar (Status Tabs + Search + TableColumnSettings) */}
        <BrandFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          isCompletelyEmpty={isCompletelyEmpty}
          columns={BRAND_COLUMNS}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
          sortOptions={BRAND_SORT_OPTIONS}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          onResetColumns={resetColumns}
          onShowAllColumns={() =>
            showAllColumns(BRAND_COLUMNS.map((c) => c.key))
          }
          filteredCount={filteredAndSortedBrands.length}
        />

        {/* Table or Empty State */}
        {filteredAndSortedBrands.length === 0 ? (
          <AdminEmptyState
            illustration={
              !searchValue && activeTab === "all" ? (
                <EmptyStateIllustration />
              ) : undefined
            }
            title={
              searchValue || activeTab !== "all"
                ? "No brands found"
                : "Manage your brands"
            }
            description={
              searchValue
                ? `No brands matching "${searchValue}". Try clearing filters.`
                : activeTab !== "all"
                ? `No ${activeTab} brands found. Try selecting another tab.`
                : "Keep track of the brands and manufacturers for your products."
            }
            primaryAction={
              !searchValue && activeTab === "all"
                ? {
                    label: "Add brand",
                    onClick: handleOpenAddModal,
                  }
                : undefined
            }
            secondaryAction={
              searchValue || activeTab !== "all"
                ? {
                    label: "Clear filters",
                    onClick: () => {
                      setSearchValue("");
                      setActiveTab("all");
                    },
                  }
                : undefined
            }
          />
        ) : (
          <BrandTable
            brands={filteredAndSortedBrands}
            checked={checked}
            allChecked={allChecked}
            someChecked={someChecked}
            onToggleAll={toggleAll}
            onToggleOne={toggleOne}
            showColumn={showColumn}
            onEdit={handleEditBrand}
            onDelete={handleDeleteBrand}
            onToggleFeatured={handleToggleFeatured}
          />
        )}
      </AdminTableContainer>

      {/* Footer Link */}
      <AdminFooterLink
        href="#"
        label="Learn more about managing brands and manufacturers"
      />

      {/* Add / Edit Brand Form Modal */}
      <BrandFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBrand}
        editingBrand={editingBrand}
      />
    </div>
  );
}
