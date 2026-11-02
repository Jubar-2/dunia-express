"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminFooterLink } from "@/components/common";
import {
  DiscountsHeader,
  DiscountsEmptyState,
  DiscountTypeModal,
  DiscountsTable,
} from "./_components";
import { INITIAL_DISCOUNTS } from "./_data/mock-discounts";
import type { Discount, DiscountType } from "./_types/discount.types";

export default function DiscountsPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = React.useState<Discount[]>(INITIAL_DISCOUNTS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = React.useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = React.useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSelectDiscountType = React.useCallback(
    (type: DiscountType) => {
      setIsModalOpen(false);
      router.push(`/admin/discounts/new?type=${type}`);
    },
    [router]
  );

  const handleDeleteDiscount = React.useCallback((id: string) => {
    setDiscounts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const handleExport = React.useCallback(() => {
    alert("Export discounts CSV action triggered");
  }, []);

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      {/* Top Header Bar */}
      <DiscountsHeader
        onCreateDiscount={handleOpenModal}
        onExport={handleExport}
      />

      {/* Main Content Area */}
      {discounts.length === 0 ? (
        <DiscountsEmptyState onCreateDiscount={handleOpenModal} />
      ) : (
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">
              {discounts.length} {discounts.length === 1 ? "discount" : "discounts"}
            </span>
            <button
              type="button"
              onClick={() => setDiscounts([])}
              className="text-xs text-neutral-400 hover:text-neutral-700 underline"
            >
              Reset to empty state
            </button>
          </div>
          <DiscountsTable
            discounts={discounts}
            onDeleteDiscount={handleDeleteDiscount}
          />
        </div>
      )}

      {/* Footer Link matching purchase orders */}
      <AdminFooterLink
        href="#"
        label="Learn more about discounts"
      />

      {/* Select Discount Type Modal */}
      <DiscountTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectType={handleSelectDiscountType}
      />
    </div>
  );
}
