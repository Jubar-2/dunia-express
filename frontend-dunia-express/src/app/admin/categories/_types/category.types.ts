export type CategoryStatus = "active" | "archived";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  parentName?: string | null;
  productsCount: number;
  status: CategoryStatus;
  position: number;
  swatch?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  parentId: string;
  status: CategoryStatus;
  position: number;
  swatch: string;
}

export interface CategoryTableRowProps {
  category: Category;
  index: number;
  isChecked: boolean;
  onToggle: (index: number) => void;
  showColumn?: (key: string) => boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export interface CategoryTableProps {
  categories: Category[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (index: number) => void;
  showColumn?: (key: string) => boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}
