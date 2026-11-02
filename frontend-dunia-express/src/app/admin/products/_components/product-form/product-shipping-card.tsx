import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Info } from "lucide-react";

export interface ProductShippingCardProps {
  isPhysicalProduct: boolean;
  weight: string;
  weightUnit: string;
  packageType: string;
  countryOfOrigin: string;
  hsCode: string;
  onPhysicalProductChange: (val: boolean) => void;
  onWeightChange: (val: string) => void;
  onWeightUnitChange: (val: string) => void;
  onPackageTypeChange: (val: string) => void;
  onCountryChange: (val: string) => void;
  onHsCodeChange: (val: string) => void;
}

export function ProductShippingCard({
  isPhysicalProduct,
  weight,
  weightUnit,
  packageType,
  countryOfOrigin,
  hsCode,
  onPhysicalProductChange,
  onWeightChange,
  onWeightUnitChange,
  onPackageTypeChange,
  onCountryChange,
  onHsCodeChange,
}: ProductShippingCardProps) {
  const [showCustoms, setShowCustoms] = React.useState(false);

  return (
    <AdminCard
      title="Shipping"
      headerAction={
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Physical product</span>
          <Switch
            checked={isPhysicalProduct}
            onCheckedChange={onPhysicalProductChange}
            aria-label="Physical product"
          />
        </div>
      }
    >
      {isPhysicalProduct ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-4">
            <FormField
              label={
                <span className="flex items-center gap-1">
                  Package
                  <Info className="h-3 w-3 text-neutral-400" />
                </span>
              }
            >
              <Select value={packageType} onValueChange={(val) => onPackageTypeChange(val || "default")}>
                <SelectTrigger className="border-neutral-300">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">
                    Store default • Sample box - 22 x 13.7 x 4.2 cm
                  </SelectItem>
                  <SelectItem value="custom">Custom package</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Product weight">
              <div className="flex">
                <Input
                  value={weight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  className="rounded-r-none border-neutral-300"
                  placeholder="0.0"
                />
                <Select value={weightUnit} onValueChange={(val) => onWeightUnitChange(val || "kg")}>
                  <SelectTrigger className="w-16 rounded-l-none border-l-0 border-neutral-300 bg-neutral-50 px-2 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="lb">lb</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </FormField>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setShowCustoms(!showCustoms)}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${
                  showCustoms ? "rotate-180" : ""
                }`}
              />
              <span>Customs information (Country of origin, HS Code)</span>
            </button>

            {showCustoms && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-2">
                <FormField label="Country / Region of origin">
                  <Input
                    value={countryOfOrigin}
                    onChange={(e) => onCountryChange(e.target.value)}
                    placeholder="Bangladesh"
                    className="border-neutral-300"
                  />
                </FormField>
                <FormField label="HS (Harmonized System) code">
                  <Input
                    value={hsCode}
                    onChange={(e) => onHsCodeChange(e.target.value)}
                    placeholder="e.g. 3304.99"
                    className="border-neutral-300"
                  />
                </FormField>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-neutral-500 py-1">
          Customers won&apos;t enter shipping details or pay for shipping at checkout.
        </p>
      )}
    </AdminCard>
  );
}
