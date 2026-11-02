"use client";

import * as React from "react";
import { INITIAL_PRODUCTS } from "./_data/mock-products";
import { useProductColumns, useProductSelection } from "./_hooks";
import {
  ProductHeader,
  ProductStatsCards,
  ProductTable,
} from "./_components";

export default function ProductsPage() {
  const [searchValue, setSearchValue] = React.useState("");
  const columnControls = useProductColumns();
  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useProductSelection(INITIAL_PRODUCTS.length);

  return (
    <div className="w-full px-8 py-6">
      {/* Page Header */}
      <ProductHeader isDataAvailable={INITIAL_PRODUCTS.length > 0} />

      {/* 30-Day Metrics Summary Cards (only if data available) */}
      {INITIAL_PRODUCTS.length > 0 && <ProductStatsCards />}

      {/* Data Table with Filter Toolbar & Column Popover */}
      <ProductTable
        products={INITIAL_PRODUCTS}
        checked={checked}
        allChecked={allChecked}
        someChecked={someChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        columnControls={columnControls}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </div>
  );
}
