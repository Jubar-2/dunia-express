import { Calendar } from "lucide-react";
import type { Product, ProductColumnDef } from "../_types";
import type { StatItem } from "@/components/common/stat-card-group";

export const INITIAL_PRODUCTS: Product[] = [
  {
    title:
      "OEM Skincare Daily Anti-Aging Face Wash Natural Mild Deep Cleanser Vitamin C Gentle Oil Form Firming Pore Cleansing...",
    status: "Active",
    inventory: "3,000 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Buty care",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-neutral-300 to-neutral-500",
  },
  {
    title:
      "OEM KORMESIC Private Label Organic Anti-Acne Facial Cleanser Foaming Gel Face Wash Deeply Cleansing Pore...",
    status: "Active",
    inventory: "1,000 in stock",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-sky-100 to-blue-200",
  },
  {
    title:
      "Korea Private Label Organic Deep Clean Pink Rose Creamy Jelly Cleanser Women Skin Care Facial Wash Cleanser Face...",
    status: "Active",
    inventory: "499 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-pink-100 to-rose-200",
  },
  {
    title:
      "FATAZEN Private Label Skin Care Products Deep Moisturizing Foaming Facial Cleanser Organic Anti-Acne Smoothing Face...",
    status: "Active",
    inventory: "999 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-rose-100 to-pink-200",
  },
  {
    title:
      "Natural Neem Pimple Control Cleansing Gel Neem Squalane Oil-Water Balance Gentle Cleansing Simple Refreshing Facial...",
    status: "Active",
    inventory: "1,000 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-emerald-100 to-green-200",
  },
  {
    title: "Purifying Neem Face Wash",
    status: "Active",
    inventory: "1,000 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-lime-100 to-emerald-200",
  },
  {
    title:
      "Private Label Acne Foaming Wash Cream Face Wash for Sensitive Skin Acne-Fighting Properties",
    status: "Active",
    inventory: "1,000 in stock for 1 variant",
    category: "Acne Treatments & Kits",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-teal-100 to-cyan-200",
  },
  {
    title:
      "Private Label Skin Care Simple Face Wash Deep Moisturizing Facial Cleanser",
    status: "Active",
    inventory: "999 in stock",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-rose-100 to-pink-200",
  },
  {
    title: "Simple Daily Skin Detox Purifying Face Wash",
    status: "Active",
    inventory: "99 in stock for 1 variant",
    category: "Beauty & Personal Care",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-amber-100 to-orange-200",
  },
  {
    title:
      "Japanese Skincare Vitamin C Enzyme Facial Wash Cleanser Moisturizing Deep Cleans Foaming Face Wash For Oily Skin...",
    status: "Active",
    inventory: "50 in stock",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Face Wash",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-yellow-100 to-amber-200",
  },
  {
    title: "Face Wash Deep KOJIC Facial Cleanser Whitening Skin Brightening",
    status: "Active",
    inventory: "112 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Skin Care",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-orange-100 to-amber-200",
  },
  {
    title: "Private Label KORMESIC Acne Treatment Foaming Face Wash",
    status: "Active",
    inventory: "1,200 in stock for 1 variant",
    category: "Facial Cleansers",
    channels: 2,
    productType: "Skin Care",
    vendor: "Al Amara shop",
    swatch: "bg-gradient-to-br from-amber-200 to-yellow-300",
  },
];

export const PRODUCT_COLUMN_DEFS: readonly ProductColumnDef[] = [
  { key: "status", label: "Status", hideable: true },
  { key: "inventory", label: "Inventory", hideable: true },
  { key: "category", label: "Category", hideable: true },
  { key: "channels", label: "Channels", hideable: true },
  { key: "productType", label: "Product type", hideable: true },
  { key: "vendor", label: "Vendor", hideable: true },
  { key: "created", label: "Created", hideable: false },
  { key: "updated", label: "Updated", hideable: false },
] as const;

export const PRODUCT_STAT_ITEMS: StatItem[] = [
  {
    id: "duration",
    icon: Calendar,
    label: "30 days",
  },
  {
    id: "sell-through",
    label: "Average sell-through rate",
    value: "0% —",
  },
  {
    id: "inventory-remaining",
    label: "Products by days of inventory remaining",
    value: "No data",
  },
  {
    id: "abc-analysis",
    label: "ABC product analysis",
    value: "BDT 0.00 C",
    isLink: true,
  },
];
