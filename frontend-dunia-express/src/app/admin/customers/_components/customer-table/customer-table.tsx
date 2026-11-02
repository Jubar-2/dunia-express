"use client";

import * as React from "react";
import { CustomerTableHeader } from "./customer-table-header";
import { CustomerTableRow } from "./customer-table-row";
import type { CustomerTableProps } from "../../_types/customer.types";

export function CustomerTable({
  customers,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  showColumn = () => true,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[12px]">
        <CustomerTableHeader
          allChecked={allChecked}
          someChecked={someChecked}
          onToggleAll={onToggleAll}
          showColumn={showColumn}
        />
        <tbody className="divide-y divide-neutral-100">
          {customers.map((customer, index) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              index={index}
              isChecked={Boolean(checked[index])}
              onToggle={onToggleOne}
              showColumn={showColumn}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
