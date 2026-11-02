import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Info, Plus, X } from "lucide-react";

export interface ProductOrganizationCardProps {
  category: string;
  productType: string;
  vendor: string;
  collections: string[];
  tags: string[];
  onCategoryChange: (cat: string) => void;
  onProductTypeChange: (type: string) => void;
  onVendorChange: (vendor: string) => void;
  onAddCollection?: (collection: string) => void;
  onRemoveCollection?: (collection: string) => void;
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
}

export function ProductOrganizationCard({
  category,
  productType,
  vendor,
  collections = [],
  tags = [],
  onCategoryChange,
  onProductTypeChange,
  onVendorChange,
  onAddCollection,
  onRemoveCollection,
  onAddTag,
  onRemoveTag,
}: ProductOrganizationCardProps) {
  const [tagInput, setTagInput] = React.useState("");

  function handleAddTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      onAddTag?.(tagInput.trim());
      setTagInput("");
    }
  }

  return (
    <AdminCard
      title="Product organization"
      headerAction={<Info className="h-3.5 w-3.5 text-neutral-400" />}
    >
      <div className="flex flex-col gap-3.5">
        <FormField label="Category" helpText="Determines tax rates and adds metafields.">
          <Select value={category} onValueChange={(val) => onCategoryChange(val || "")}>
            <SelectTrigger className="border-neutral-300">
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="skincare">
                Health &amp; Beauty &gt; Personal Care &gt; Facial Cleansers
              </SelectItem>
              <SelectItem value="apparel">Apparel &amp; Accessories</SelectItem>
              <SelectItem value="home">Home &amp; Garden</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Product type">
          <Select value={productType} onValueChange={(val) => onProductTypeChange(val || "")}>
            <SelectTrigger className="border-neutral-300">
              <SelectValue placeholder="Select or enter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Face Wash">Face Wash</SelectItem>
              <SelectItem value="Skin Care">Skin Care</SelectItem>
              <SelectItem value="Beauty Care">Beauty Care</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Vendor">
          <Select value={vendor} onValueChange={(val) => onVendorChange(val || "")}>
            <SelectTrigger className="border-neutral-300">
              <SelectValue placeholder="Select or enter vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Al Amara shop">Al Amara shop</SelectItem>
              <SelectItem value="Organic Lab">Organic Lab</SelectItem>
              <SelectItem value="KORMESIC">KORMESIC</SelectItem>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Collections">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {collections.map((col) => (
              <span
                key={col}
                className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
              >
                {col}
                {onRemoveCollection && (
                  <button
                    type="button"
                    onClick={() => onRemoveCollection(col)}
                    className="hover:text-rose-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onAddCollection?.("Skincare Best Sellers")}
            className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors w-full justify-center"
          >
            <Plus className="h-3.5 w-3.5" />
            Add to collection
          </button>
        </FormField>

        <FormField label="Tags">
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-700"
                >
                  {tag}
                  {onRemoveTag && (
                    <button
                      type="button"
                      onClick={() => onRemoveTag(tag)}
                      className="hover:text-rose-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTagKeyDown}
            placeholder="Vintage, cotton, summer"
            className="border-neutral-300 text-xs"
          />
        </FormField>
      </div>
    </AdminCard>
  );
}
