import * as React from "react";

export interface ProductTableHeaderProps {
  showCol: (key: string) => boolean;
  allChecked: boolean;
  someChecked?: boolean;
  onToggleAll: () => void;
}

export function ProductTableHeader({
  showCol,
  allChecked,
  someChecked,
  onToggleAll,
}: ProductTableHeaderProps) {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(someChecked && !allChecked);
    }
  }, [someChecked, allChecked]);

  return (
    <thead>
      <tr className="border-b border-neutral-200 text-xs font-medium text-neutral-500 bg-bg-admin">
        <th className="w-10 py-2.5 pl-4">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
            aria-label="Select all products"
            className="h-4 w-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
          />
        </th>
        <th className="py-2.5 font-medium text-neutral-600">Product</th>
        {showCol("status") && (
          <th className="py-2.5 font-medium text-neutral-600">Status</th>
        )}
        {showCol("inventory") && (
          <th className="py-2.5 font-medium text-neutral-600">Inventory</th>
        )}
        {showCol("category") && (
          <th className="py-2.5 font-medium text-neutral-600">Category</th>
        )}
        {showCol("channels") && (
          <th className="py-2.5 font-medium text-neutral-600">Channels</th>
        )}
        {showCol("productType") && (
          <th className="py-2.5 font-medium text-neutral-600">Product type</th>
        )}
        {showCol("vendor") && (
          <th className="py-2.5 pr-4 font-medium text-neutral-600">Vendor</th>
        )}
      </tr>
    </thead>
  );
}
