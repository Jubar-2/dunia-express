import type { MediaItem } from "@/components/common/media-upload";

export interface ProductVariantOption {
  name: string;
  values: string[];
}

export interface ProductFormValues {
  title: string;
  description: string;
  media: MediaItem[];
  category: string;
  price: string;
  compareAtPrice: string;
  costPerItem: string;
  chargeTax: boolean;
  inventoryTracked: boolean;
  sellOutOfStock: boolean;
  sku: string;
  barcode: string;
  locationQuantity: string;
  isPhysicalProduct: boolean;
  weight: string;
  weightUnit: string;
  packageType: string;
  countryOfOrigin: string;
  hsCode: string;
  status: "active" | "draft";
  salesChannels: string[];
  productType: string;
  vendor: string;
  collections: string[];
  tags: string[];
  themeTemplate: string;
  seoTitle?: string;
  seoDescription?: string;
  seoHandle?: string;
}

export const INITIAL_PRODUCT_FORM_VALUES: ProductFormValues = {
  title: "",
  description: "",
  media: [],
  category: "skincare",
  price: "0.00",
  compareAtPrice: "",
  costPerItem: "",
  chargeTax: true,
  inventoryTracked: true,
  sellOutOfStock: false,
  sku: "",
  barcode: "",
  locationQuantity: "0",
  isPhysicalProduct: true,
  weight: "0.0",
  weightUnit: "kg",
  packageType: "default",
  countryOfOrigin: "",
  hsCode: "",
  status: "active",
  salesChannels: ["online-store", "pos"],
  productType: "Face Wash",
  vendor: "Al Amara shop",
  collections: [],
  tags: [],
  themeTemplate: "default",
};
