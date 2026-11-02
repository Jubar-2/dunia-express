import type { Collection } from "../_types";

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    title: "New Arrived Turmeric Face Wash Deep Cleansing Remove Blackhead",
    products: 7,
    conditions: "Suitable for skin type includes All skin types",
    swatch: "bg-gradient-to-br from-amber-200 to-orange-300",
    status: "Active",
    updatedAt: "May 12, 2026",
  },
  {
    title: "Bueauti Care",
    products: 18,
    conditions: "Manual selection",
    swatch: "bg-neutral-200",
    status: "Active",
    updatedAt: "Apr 28, 2026",
  },
  {
    title: "Summer Essentials 2026",
    products: 34,
    conditions: "Product tag is equal to summer",
    swatch: "bg-gradient-to-br from-rose-200 to-amber-200",
    status: "Active",
    updatedAt: "Yesterday",
  },
  {
    title: "Clearance & Archive",
    products: 12,
    conditions: "Compare at price is greater than 0",
    swatch: "bg-gradient-to-br from-slate-200 to-neutral-300",
    status: "Draft",
    updatedAt: "Mar 15, 2026",
  },
];

export const COLLECTION_ATTRIBUTES: string[] = [
  "Category",
  "Compare at price",
  "Inventory stock",
  "Metafield",
  "Price",
  "Status",
  "Tag",
  "Title",
  "Type",
  "Variant title",
  "Vendor",
];
