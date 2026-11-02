import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";

export interface PurchaseOrderSupplierCardProps {
  supplier?: string;
  onSupplierChange?: (val: string) => void;
  destination?: string;
  onDestinationChange?: (val: string) => void;
}

export function PurchaseOrderSupplierCard({
  supplier = "Apex Logistics & Supplies",
  onSupplierChange,
  destination = "Main Warehouse (New York)",
  onDestinationChange,
}: PurchaseOrderSupplierCardProps) {
  return (
    <AdminCard
      title="Supplier & Destination"
      subtitle="Select the supplier providing inventory and the fulfillment destination"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Supplier" id="supplier-select">
          <select
            id="supplier-select"
            value={supplier}
            onChange={(e) => onSupplierChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
          >
            <option value="Apex Logistics & Supplies">Apex Logistics & Supplies</option>
            <option value="Global Tech Components Ltd">Global Tech Components Ltd</option>
            <option value="Aurora Apparel Mills">Aurora Apparel Mills</option>
            <option value="Nexus Industrial Supply">Nexus Industrial Supply</option>
          </select>
        </FormField>

        <FormField label="Destination location" id="destination-select">
          <select
            id="destination-select"
            value={destination}
            onChange={(e) => onDestinationChange?.(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
          >
            <option value="Main Warehouse (New York)">Main Warehouse (New York)</option>
            <option value="West Coast Distribution (Los Angeles)">West Coast Distribution (Los Angeles)</option>
            <option value="Midwest Fulfillment Center (Chicago)">Midwest Fulfillment Center (Chicago)</option>
          </select>
        </FormField>
      </div>
    </AdminCard>
  );
}
