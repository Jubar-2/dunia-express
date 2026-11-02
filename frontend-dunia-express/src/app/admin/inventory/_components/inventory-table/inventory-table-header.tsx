import * as React from "react";

export interface InventoryTableHeaderProps {
  allChecked: boolean;
  someChecked?: boolean;
  onToggleAll: () => void;
  showColumn?: (key: string) => boolean;
}

export function InventoryTableHeader({
  allChecked,
  someChecked,
  onToggleAll,
  showColumn = () => true,
}: InventoryTableHeaderProps) {
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = Boolean(someChecked && !allChecked);
    }
  }, [someChecked, allChecked]);

  return (
    <thead>
      <tr className="border-b border-neutral-200 text-[12px] font-medium text-neutral-500 bg-bg-admin">
        <th className="w-10 py-2.5 pl-4">
          <input
            ref={checkboxRef}
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
            aria-label="Select all inventory items"
            className="h-4 w-4 rounded border-neutral-300 accent-neutral-900 cursor-pointer"
          />
        </th>
        {showColumn("product") && (
          <th className="py-2.5 font-medium text-neutral-600 min-w-[260px] text-[12px]">
            Product
          </th>
        )}
        {showColumn("sku") && (
          <th className="py-2.5 font-medium text-neutral-600 min-w-[120px] text-[12px]">
            SKU
          </th>
        )}
        {showColumn("unavailable") && (
          <th className="py-2.5 font-medium text-neutral-600 text-right pr-4 text-[12px]">
            Unavailable
          </th>
        )}
        {showColumn("committed") && (
          <th className="py-2.5 font-medium text-neutral-600 text-right pr-4 text-[12px]">
            Committed
          </th>
        )}
        {showColumn("available") && (
          <th className="py-2.5 font-medium text-neutral-600 text-right pr-4 text-[12px]">
            Available
          </th>
        )}
        {showColumn("onHand") && (
          <th className="py-2.5 font-medium text-neutral-600 text-right pr-4 text-[12px]">
            On hand
          </th>
        )}
        {showColumn("incoming") && (
          <th className="py-2.5 font-medium text-neutral-600 text-right pr-6 text-[12px]">
            Incoming
          </th>
        )}
      </tr>
    </thead>
  );
}
