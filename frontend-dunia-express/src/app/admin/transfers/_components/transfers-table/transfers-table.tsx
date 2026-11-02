"use client";

import * as React from "react";
import {
  AdminEmptyState,
  AdminTableContainer,
  TableSearchFilter,
} from "@/components/common";
import { NoData } from "../noData";
import { TransfersTableHeader } from "./transfers-table-header";
import { TransfersTableRow } from "./transfers-table-row";
import type { Transfer } from "../../_types";

export interface TransfersTableProps {
  transfers: Transfer[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (idx: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  rightSlot?: React.ReactNode;
  showColumn?: (key: string) => boolean;
}

export function TransfersTable({
  transfers,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  searchValue,
  onSearchChange,
  rightSlot,
  showColumn = () => true,
}: TransfersTableProps) {
  return (
    <AdminTableContainer>
      <TableSearchFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        placeholder={transfers.length === 0 && !searchValue ? "Search and filter" : "Filter transfers by ID or location..."}
        showColumnsButton={false}
        rightSlot={rightSlot}
      />

      {transfers.length === 0 ? (
        <AdminEmptyState
          illustration={!searchValue ? <NoData /> : undefined}
          title={searchValue ? "No transfers found" : "Manage your transfers"}
          description={
            searchValue
              ? `No transfers matching "${searchValue}". Try clearing filters.`
              : "Move inventory between your retail stores and warehouses."
          }
          primaryAction={
            !searchValue
              ? {
                  label: "Create transfer",
                  onClick: () => alert("Create transfer action"),
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <TransfersTableHeader
              allChecked={allChecked}
              someChecked={someChecked}
              onToggleAll={onToggleAll}
              showColumn={showColumn}
            />
            <tbody className="divide-y divide-neutral-100">
              {transfers.map((transfer, idx) => (
                <TransfersTableRow
                  key={transfer.id}
                  transfer={transfer}
                  checked={checked[idx] ?? false}
                  onToggle={() => onToggleOne(idx)}
                  showColumn={showColumn}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminTableContainer>
  );
}
