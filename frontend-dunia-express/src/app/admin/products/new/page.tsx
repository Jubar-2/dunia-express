"use client";

import * as React from "react";
import { Package } from "lucide-react";
import { FormBreadcrumb } from "@/components/common/form-breadcrumb";
import { StickySaveBar } from "@/components/common/sticky-save-bar";
import {
  ProductGeneralCard,
  ProductMediaCard,
  ProductPricingCard,
  ProductInventoryCard,
  ProductShippingCard,
  ProductVariantsCard,
  ProductSeoCard,
  ProductStatusCard,
  ProductPublishingCard,
  ProductOrganizationCard,
  ProductTemplateCard,
} from "../_components";
import {
  INITIAL_PRODUCT_FORM_VALUES,
  type ProductFormValues,
} from "../_types";

export default function NewProductPage() {
  const [form, setForm] = React.useState<ProductFormValues>(
    INITIAL_PRODUCT_FORM_VALUES
  );
  const [isDirty, setIsDirty] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  function updateField<K extends keyof ProductFormValues>(
    key: K,
    val: ProductFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setIsDirty(true);
  }

  function handleSave() {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
    }, 600);
  }

  function handleDiscard() {
    setForm(INITIAL_PRODUCT_FORM_VALUES);
    setIsDirty(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-6 text-sm text-neutral-900">
      {/* Breadcrumb Header matching collections/new standard */}
      <FormBreadcrumb
        title="Add product"
        icon={Package}
        parentHref="/admin/products"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Main Left Column */}
        <div className="flex flex-col gap-4">
          <ProductGeneralCard
            title={form.title}
            description={form.description}
            onTitleChange={(v) => updateField("title", v)}
            onDescriptionChange={(v) => updateField("description", v)}
          />

          <ProductMediaCard
            media={form.media}
            onUpload={(files) => {
              const newItems = Array.from(files).map((f, idx) => ({
                id: `${f.name}-${Date.now()}-${idx}`,
                url: URL.createObjectURL(f),
                name: f.name,
              }));
              updateField("media", [...form.media, ...newItems]);
            }}
            onRemoveItem={(id) => {
              updateField(
                "media",
                form.media.filter((m) => m.id !== id)
              );
            }}
          />

          <ProductPricingCard
            price={form.price}
            compareAtPrice={form.compareAtPrice}
            costPerItem={form.costPerItem}
            chargeTax={form.chargeTax}
            onPriceChange={(v) => updateField("price", v)}
            onCompareAtPriceChange={(v) => updateField("compareAtPrice", v)}
            onCostPerItemChange={(v) => updateField("costPerItem", v)}
            onChargeTaxChange={(v) => updateField("chargeTax", v)}
          />

          <ProductInventoryCard
            inventoryTracked={form.inventoryTracked}
            sellOutOfStock={form.sellOutOfStock}
            sku={form.sku}
            barcode={form.barcode}
            quantity={form.locationQuantity}
            onInventoryTrackedChange={(v) => updateField("inventoryTracked", v)}
            onSellOutOfStockChange={(v) => updateField("sellOutOfStock", v)}
            onSkuChange={(v) => updateField("sku", v)}
            onBarcodeChange={(v) => updateField("barcode", v)}
            onQuantityChange={(v) => updateField("locationQuantity", v)}
          />

          <ProductShippingCard
            isPhysicalProduct={form.isPhysicalProduct}
            weight={form.weight}
            weightUnit={form.weightUnit}
            packageType={form.packageType}
            countryOfOrigin={form.countryOfOrigin}
            hsCode={form.hsCode}
            onPhysicalProductChange={(v) => updateField("isPhysicalProduct", v)}
            onWeightChange={(v) => updateField("weight", v)}
            onWeightUnitChange={(v) => updateField("weightUnit", v)}
            onPackageTypeChange={(v) => updateField("packageType", v)}
            onCountryChange={(v) => updateField("countryOfOrigin", v)}
            onHsCodeChange={(v) => updateField("hsCode", v)}
          />

          <ProductVariantsCard />

          <ProductSeoCard
            productTitle={form.title}
            productDescription={form.description}
          />
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-4">
          <ProductStatusCard
            status={form.status}
            onStatusChange={(v) => updateField("status", v)}
          />

          <ProductPublishingCard channels={["Online Store", "Point of Sale"]} />

          <ProductOrganizationCard
            category={form.category}
            productType={form.productType}
            vendor={form.vendor}
            collections={form.collections}
            tags={form.tags}
            onCategoryChange={(v) => updateField("category", v)}
            onProductTypeChange={(v) => updateField("productType", v)}
            onVendorChange={(v) => updateField("vendor", v)}
            onAddCollection={(col) =>
              updateField("collections", [...form.collections, col])
            }
            onRemoveCollection={(col) =>
              updateField(
                "collections",
                form.collections.filter((c) => c !== col)
              )
            }
            onAddTag={(tag) => updateField("tags", [...form.tags, tag])}
            onRemoveTag={(tag) =>
              updateField(
                "tags",
                form.tags.filter((t) => t !== tag)
              )
            }
          />

          <ProductTemplateCard
            themeTemplate={form.themeTemplate}
            onThemeTemplateChange={(v) => updateField("themeTemplate", v)}
          />
        </div>
      </div>

      {/* Sticky Save Bar */}
      <StickySaveBar
        isDirty={isDirty}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={handleDiscard}
      />
    </div>
  );
}