import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";

export interface PurchaseOrderShippingCardProps {
  arrivalDate?: string;
  onArrivalDateChange?: (val: string) => void;
  carrier?: string;
  onCarrierChange?: (val: string) => void;
  trackingNumber?: string;
  onTrackingNumberChange?: (val: string) => void;
}

export function PurchaseOrderShippingCard({
  arrivalDate = "2026-10-15",
  onArrivalDateChange,
  carrier = "DHL Express",
  onCarrierChange,
  trackingNumber = "",
  onTrackingNumberChange,
}: PurchaseOrderShippingCardProps) {
  return (
    <AdminCard
      title="Shipment & Delivery"
      subtitle="Logistics information and expected delivery schedule"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Estimated arrival" id="arrival-date">
          <input
            id="arrival-date"
            type="date"
            value={arrivalDate}
            onChange={(e) => onArrivalDateChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </FormField>

        <FormField label="Shipping carrier" id="shipping-carrier">
          <select
            id="shipping-carrier"
            value={carrier}
            onChange={(e) => onCarrierChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="DHL Express">DHL Express</option>
            <option value="FedEx Freight">FedEx Freight</option>
            <option value="UPS Ground">UPS Ground</option>
            <option value="Custom Freight">Custom Freight / Other</option>
          </select>
        </FormField>

        <FormField label="Tracking number" id="tracking-num">
          <input
            id="tracking-num"
            type="text"
            placeholder="e.g. TRK-9823412"
            value={trackingNumber}
            onChange={(e) => onTrackingNumberChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </FormField>
      </div>
    </AdminCard>
  );
}
