import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";

export interface PurchaseOrderSummaryCardProps {
  referenceNumber?: string;
  onReferenceNumberChange?: (val: string) => void;
  currency?: string;
  onCurrencyChange?: (val: string) => void;
  paymentTerms?: string;
  onPaymentTermsChange?: (val: string) => void;
}

export function PurchaseOrderSummaryCard({
  referenceNumber = "PO-2026-0042",
  onReferenceNumberChange,
  currency = "USD",
  onCurrencyChange,
  paymentTerms = "Net 30",
  onPaymentTermsChange,
}: PurchaseOrderSummaryCardProps) {
  return (
    <AdminCard title="Order Details" subtitle="Financial & reference settings">
      <div className="flex flex-col gap-3.5">
        <FormField label="PO reference #" id="po-ref">
          <input
            id="po-ref"
            type="text"
            value={referenceNumber}
            onChange={(e) => onReferenceNumberChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </FormField>

        <FormField label="Currency" id="po-currency">
          <select
            id="po-currency"
            value={currency}
            onChange={(e) => onCurrencyChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD ($)</option>
          </select>
        </FormField>

        <FormField label="Payment terms" id="payment-terms">
          <select
            id="payment-terms"
            value={paymentTerms}
            onChange={(e) => onPaymentTermsChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="Due on receipt">Due on receipt</option>
            <option value="Net 15">Net 15</option>
            <option value="Net 30">Net 30</option>
            <option value="Net 60">Net 60</option>
          </select>
        </FormField>
      </div>
    </AdminCard>
  );
}
