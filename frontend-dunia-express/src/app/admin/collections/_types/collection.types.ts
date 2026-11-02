export interface Collection {
  id?: string;
  title: string;
  products: number;
  conditions: string;
  swatch: string;
  status?: "Active" | "Draft" | "Archived";
  updatedAt?: string;
}

export interface CollectionHeaderProps {
  title?: string;
  actionHref?: string;
  actionLabel?: string;
  isDataAvailable?: boolean;
}

export interface CollectionTableFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onColumnsClick?: () => void;
  rightSlot?: React.ReactNode;
}

export interface CollectionTableHeaderProps {
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export interface CollectionTableRowProps {
  collection: Collection;
  index: number;
  isChecked: boolean;
  onToggle: (index: number) => void;
  showColumn?: (key: string) => boolean;
}

export interface CollectionTableProps {
  collections: Collection[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (index: number) => void;
  showColumn?: (key: string) => boolean;
}

export interface UseCollectionSelectionReturn {
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  toggleAll: () => void;
  toggleOne: (index: number) => void;
  setChecked: React.Dispatch<React.SetStateAction<boolean[]>>;
}
