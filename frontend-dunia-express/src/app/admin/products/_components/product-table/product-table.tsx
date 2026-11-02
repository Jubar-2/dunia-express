"use client";

import * as React from "react";
import { TableSearchFilter } from "@/components/common/table-search-filter";
import { AdminEmptyState } from "@/components/common/admin-empty-state";
import { EmptyStateIllustration } from "@/components/common/empty-state-illustration";
import { ProductTableHeader } from "./product-table-header";
import { ProductTableRow } from "./product-table-row";
import { ProductColumnMenu } from "./product-column-menu";
import type { Product, UseProductColumnsReturn } from "../../_types";

export interface ProductTableProps {
  products: Product[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (index: number) => void;
  columnControls: UseProductColumnsReturn;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function ProductTable({
  products,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  columnControls,
  searchValue = "",
  onSearchChange,
}: ProductTableProps) {
  const {
    menuOpen,
    setMenuOpen,
    hideArchived,
    setHideArchived,
    hiddenCols,
    toggleCol,
    showCol,
    menuRef,
  } = columnControls;

  return (
    <div className="overflow-visible rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Table Filter Toolbar */}
      <TableSearchFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        showColumnsButton={true}
        onColumnsClick={() => setMenuOpen((v) => !v)}
        isColumnsActive={menuOpen}
      >
        <ProductColumnMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          hiddenCols={hiddenCols}
          onToggleCol={toggleCol}
          hideArchived={hideArchived}
          onToggleHideArchived={setHideArchived}
          menuRef={menuRef}
        />
      </TableSearchFilter>

      {/* Table or Empty State */}
      {products.length === 0 ? (
        <AdminEmptyState
          illustration={!searchValue ? <EmptyStateIllustration /> : undefined}
          title={searchValue ? "No products found" : "Manage your products"}
          description={
            searchValue
              ? `No products matching "${searchValue}". Try clearing filters.`
              : "Add products to sell in your store, manage pricing, and track inventory."
          }
          primaryAction={
            !searchValue
              ? {
                  label: "Add product",
                  href: "/admin/products/new",
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <ProductTableHeader
              showCol={showCol}
              allChecked={allChecked}
              someChecked={someChecked}
              onToggleAll={onToggleAll}
            />
            <tbody>
              {products.map((p, index) => (
                <ProductTableRow
                  key={p.title}
                  product={p}
                  isSelected={Boolean(checked[index])}
                  onToggleSelect={() => onToggleOne(index)}
                  showCol={showCol}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
