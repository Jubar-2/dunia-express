import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";

export interface ProductSeoCardProps {
  productTitle: string;
  productDescription: string;
}

export function ProductSeoCard({
  productTitle,
  productDescription,
}: ProductSeoCardProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");
  const [seoHandle, setSeoHandle] = React.useState("");

  const cleanDescription = (productDescription || "")
    .replace(/<[^>]*>?/gm, "")
    .slice(0, 160);

  const displayTitle = seoTitle || productTitle || "Product title";
  const displayDesc =
    seoDescription ||
    cleanDescription ||
    "Add a title and description to see how this product might appear in a search engine listing.";
  const displayHandle =
    seoHandle ||
    (productTitle ? productTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "product-handle");

  return (
    <AdminCard
      title="Search engine listing"
      headerAction={
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-neutral-400 hover:text-neutral-700 transition-colors p-1"
          aria-label="Edit website SEO"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      }
    >
      {/* SERP Snippet Preview */}
      <div className="space-y-1 mb-3">
        <div className="text-xs text-neutral-500 truncate">
          https://mystore.com/products/{displayHandle}
        </div>
        <div className="text-base font-medium text-blue-700 hover:underline cursor-pointer line-clamp-1">
          {displayTitle}
        </div>
        <div className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
          {displayDesc}
        </div>
      </div>

      {isEditing && (
        <div className="space-y-3 pt-3 border-t border-neutral-100">
          <FormField label="Page title" helpText={`${seoTitle.length} of 70 characters used`}>
            <Input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={productTitle || "Product title"}
              maxLength={70}
              className="border-neutral-300"
            />
          </FormField>

          <FormField
            label="Meta description"
            helpText={`${seoDescription.length} of 320 characters used`}
          >
            <Textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder={cleanDescription || "Enter description"}
              rows={3}
              maxLength={320}
              className="border-neutral-300"
            />
          </FormField>

          <FormField label="URL handle">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 text-xs text-neutral-500">
                https://mystore.com/products/
              </span>
              <Input
                value={seoHandle}
                onChange={(e) => setSeoHandle(e.target.value)}
                placeholder={displayHandle}
                className="rounded-l-none border-neutral-300"
              />
            </div>
          </FormField>
        </div>
      )}
    </AdminCard>
  );
}
