import * as React from "react";
import { CollectionTableHeader } from "./collection-table-header";
import { CollectionTableRow } from "./collection-table-row";
import type { CollectionTableProps } from "../../_types";

export function CollectionTable({
  collections,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  showColumn = () => true,
}: CollectionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <CollectionTableHeader
          allChecked={allChecked}
          someChecked={someChecked}
          onToggleAll={onToggleAll}
          showColumn={showColumn}
        />
        <tbody>
          {collections.map((collection, index) => (
            <CollectionTableRow
              key={collection.title}
              collection={collection}
              index={index}
              isChecked={!!checked[index]}
              onToggle={onToggleOne}
              showColumn={showColumn}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
