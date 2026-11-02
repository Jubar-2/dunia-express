"use client";

import * as React from "react";
import {
  AdminEmptyState,
  AdminFooterLink,
  AdminTableContainer,
  EmptyStateIllustration,
  TableColumnSettings,
  TableSearchFilter,
} from "@/components/common";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useTableSettings } from "@/hooks/use-table-settings";
import {
  CategoryHeader,
  CategoryTable,
  CategoryFormModal,
} from "./_components";
import { INITIAL_CATEGORIES } from "./_data/mock-categories";
import type { Category, CategoryFormData } from "./_types/category.types";

const CATEGORY_COLUMNS = [
  { key: "name", label: "Category", disableToggle: true },
  { key: "parent", label: "Parent Category" },
  { key: "products", label: "Products" },
  { key: "status", label: "Status" },
  { key: "position", label: "Position" },
  { key: "updatedAt", label: "Updated" },
  { key: "actions", label: "Actions", disableToggle: true },
];

const CATEGORY_SORT_OPTIONS = [
  { label: "Category name (A–Z)", value: "name_asc" },
  { label: "Category name (Z–A)", value: "name_desc" },
  { label: "Position (Low to High)", value: "position_asc" },
  { label: "Position (High to Low)", value: "position_desc" },
  { label: "Products count (High to Low)", value: "products_desc" },
  { label: "Products count (Low to High)", value: "products_asc" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "name",
  "parent",
  "products",
  "status",
  "position",
  "updatedAt",
  "actions",
];

const TABS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "archived", label: "Archived" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>(INITIAL_CATEGORIES);
  const [searchValue, setSearchValue] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "categories_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "position_asc", order: "asc" },
  });

  // Filter & Sort Logic
  const filteredAndSortedCategories = React.useMemo(() => {
    let list = [...categories];

    // Filter by tab
    if (activeTab === "active") {
      list = list.filter((c) => c.status === "active");
    } else if (activeTab === "archived") {
      list = list.filter((c) => c.status === "archived");
    }

    // Filter by search query (name, slug, parentName)
    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          (c.parentName && c.parentName.toLowerCase().includes(q))
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
        if (activeSort.field === "position_asc") {
          return a.position - b.position;
        }
        if (activeSort.field === "position_desc") {
          return b.position - a.position;
        }
        if (activeSort.field === "products_desc") {
          return b.productsCount - a.productsCount;
        }
        if (activeSort.field === "products_asc") {
          return a.productsCount - b.productsCount;
        }
        return 0;
      });
    }

    return list;
  }, [categories, searchValue, activeTab, activeSort]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredAndSortedCategories.length);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
  };

  const handleSaveCategory = (formData: CategoryFormData, editingId?: string) => {
    const parent = categories.find((c) => c.id === formData.parentId);

    if (editingId) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                parentId: formData.parentId || null,
                parentName: parent ? parent.name : null,
                status: formData.status,
                position: formData.position,
                swatch: formData.swatch,
                updatedAt: "Just now",
              }
            : c
        )
      );
    } else {
      const newCategory: Category = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        parentId: formData.parentId || null,
        parentName: parent ? parent.name : null,
        productsCount: 0,
        status: formData.status,
        position: formData.position,
        swatch: formData.swatch,
        updatedAt: "Just now",
      };
      setCategories((prev) => [newCategory, ...prev]);
    }
  };

  const isCompletelyEmpty =
    filteredAndSortedCategories.length === 0 && !searchValue && activeTab === "all";

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      {/* Page Header */}
      <CategoryHeader
        onAddCategory={handleOpenAddModal}
        isDataAvailable={categories.length > 0}
      />

      <AdminTableContainer>
        {/* Filter Tabs Row (hidden when completely empty to match blueprint) */}
        {!isCompletelyEmpty && (
          <div className="flex items-center gap-1 border-b border-neutral-200 px-4 pt-1.5 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

        {/* Search & Filter Toolbar */}
        <TableSearchFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          placeholder={
            isCompletelyEmpty
              ? "Search and filter"
              : "Search categories by name or slug..."
          }
          showColumnsButton={false}
          rightSlot={
            <TableColumnSettings
              columns={CATEGORY_COLUMNS}
              visibleColumns={visibleColumns}
              onToggleColumn={toggleColumn}
              sortOptions={CATEGORY_SORT_OPTIONS}
              activeSort={activeSort}
              onSortChange={setActiveSort}
              onResetColumns={resetColumns}
              onShowAllColumns={() =>
                showAllColumns(CATEGORY_COLUMNS.map((c) => c.key))
              }
              triggerVariant={
                filteredAndSortedCategories.length === 0 ? "ghost" : "outline"
              }
              triggerSize={
                filteredAndSortedCategories.length === 0 ? "icon-sm" : "sm"
              }
              triggerLabel={
                filteredAndSortedCategories.length === 0 ? null : "Columns"
              }
            />
          }
        />

        {/* Table or Empty State */}
        {filteredAndSortedCategories.length === 0 ? (
          <AdminEmptyState
            illustration={
              !searchValue && activeTab === "all" ? (
                <EmptyStateIllustration />
              ) : undefined
            }
            title={
              searchValue || activeTab !== "all"
                ? "No categories found"
                : "Manage your categories"
            }
            description={
              searchValue
                ? `No categories matching "${searchValue}". Try clearing filters.`
                : activeTab !== "all"
                ? `No ${activeTab} categories found. Try selecting another tab.`
                : "Organize products into hierarchical categories to help customers navigate your store."
            }
            primaryAction={
              !searchValue && activeTab === "all"
                ? {
                    label: "Add category",
                    onClick: handleOpenAddModal,
                  }
                : undefined
            }
          />
        ) : (
          <CategoryTable
            categories={filteredAndSortedCategories}
            checked={checked}
            allChecked={allChecked}
            someChecked={someChecked}
            onToggleAll={toggleAll}
            onToggleOne={toggleOne}
            showColumn={showColumn}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </AdminTableContainer>

      {/* Footer Link */}
      <AdminFooterLink
        href="#"
        label="Learn more about managing product categories"
      />

      {/* Quick Add / Edit Category Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
        existingCategories={categories}
      />
    </div>
  );
}
