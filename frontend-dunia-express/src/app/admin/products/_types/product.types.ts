export type ProductStatus = "Active" | "Draft";

export interface Product {
  id?: string;
  title: string;
  status: ProductStatus;
  inventory: string;
  category: string;
  channels: number;
  productType: string;
  vendor: string;
  swatch: string;
}

export type ProductColumnKey =
  | "status"
  | "inventory"
  | "category"
  | "channels"
  | "productType"
  | "vendor"
  | "created"
  | "updated";

export interface ProductColumnDef {
  key: ProductColumnKey;
  label: string;
  hideable: boolean;
}

export interface UseProductColumnsReturn {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hideArchived: boolean;
  setHideArchived: React.Dispatch<React.SetStateAction<boolean>>;
  hiddenCols: Set<string>;
  toggleCol: (key: string) => void;
  showCol: (key: string) => boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
}
