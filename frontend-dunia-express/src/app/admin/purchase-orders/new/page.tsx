"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { StickySaveBar } from "@/components/common/sticky-save-bar";
import {
  PurchaseOrderBreadcrumb,
  PurchaseOrderSupplierCard,
  PurchaseOrderItemsCard,
  PurchaseOrderShippingCard,
  PurchaseOrderSummaryCard,
  PurchaseOrderNotesCard,
} from "../_components";

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const [hasChanges, setHasChanges] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/purchase-orders");
    }, 600);
  };

  return (
    <div className="mx-auto max-w-6xl px-8 py-6 pb-24">
      <PurchaseOrderBreadcrumb />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <PurchaseOrderSupplierCard />
          <PurchaseOrderItemsCard onItemsChange={() => setHasChanges(true)} />
          <PurchaseOrderShippingCard />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <PurchaseOrderSummaryCard />
          <PurchaseOrderNotesCard />
        </div>
      </div>

      <StickySaveBar
        isDirty={hasChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={() => router.push("/admin/purchase-orders")}
      />
    </div>
  );
}