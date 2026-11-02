export type BrandStatus = "active" | "inactive";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  productsCount: number;
  isFeatured: boolean;
  status: BrandStatus;
  createdAt: string;
  description?: string;
}

export interface BrandFormData {
  name: string;
  slug: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  isFeatured: boolean;
  status: BrandStatus;
}

export type BrandSortField =
  | "name_asc"
  | "name_desc"
  | "products_desc"
  | "products_asc"
  | "created_desc"
  | "created_asc";
