import * as React from "react";
import Link from "next/link";
import { AdminEmptyState, AdminTableContainer } from "@/components/common";
import { DiscountIllustration } from "./discount-illustration";

export interface DiscountsEmptyStateProps {
  onCreateDiscount?: () => void;
}

export function DiscountsEmptyState({
  onCreateDiscount,
}: DiscountsEmptyStateProps) {
  return (
    <AdminTableContainer>
      <AdminEmptyState
        illustration={<DiscountIllustration className="h-32 w-32" />}
        title="Manage discounts and promotions"
        description={
          <>
            Add discount codes and automatic discounts that apply at checkout.
            <br />
            You can also use discounts with{" "}
            <Link
              href="/admin/products"
              className="text-neutral-900 underline underline-offset-2 hover:text-blue-600 transition-colors"
            >
              compare at prices
            </Link>
            .
          </>
        }
        primaryAction={{
          label: "Create discount",
          onClick: onCreateDiscount,
        }}
      />
    </AdminTableContainer>
  );
}
