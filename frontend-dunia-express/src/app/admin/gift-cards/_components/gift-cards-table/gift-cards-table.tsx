"use client";

import * as React from "react";
import {
  AdminEmptyState,
  AdminTableContainer,
  EmptyStateIllustration,
  TableSearchFilter,
} from "@/components/common";
import { GiftCardsTableHeader } from "./gift-cards-table-header";
import { GiftCardsTableRow } from "./gift-cards-table-row";
import type { GiftCard } from "../../_types";
import { NoData } from "../noData";

export interface GiftCardsTableProps {
  giftCards: GiftCard[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (idx: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  rightSlot?: React.ReactNode;
  showColumn?: (key: string) => boolean;
  onIssueGiftCard?: () => void;
}

export function GiftCardsTable({
  giftCards,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  searchValue,
  onSearchChange,
  rightSlot,
  showColumn = () => true,
  onIssueGiftCard,
}: GiftCardsTableProps) {
  return (
    <AdminTableContainer>
      <TableSearchFilter
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        placeholder={
          giftCards.length === 0 && !searchValue
            ? "Search and filter"
            : "Search gift card code or customer..."
        }
        showColumnsButton={false}
        rightSlot={rightSlot}
      />

      {giftCards.length === 0 ? (
        <AdminEmptyState
          illustration={!searchValue ? <NoData /> : undefined}
          title={searchValue ? "No gift cards found" : "Manage your gift cards"}
          description={
            searchValue
              ? `No gift cards matching "${searchValue}". Try clearing filters.`
              : "Issue digital gift cards to your customers and track their balances."
          }
          primaryAction={
            !searchValue
              ? {
                  label: "Issue gift card",
                  onClick: onIssueGiftCard ?? (() => alert("Issue gift card")),
                }
              : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <GiftCardsTableHeader
              allChecked={allChecked}
              someChecked={someChecked}
              onToggleAll={onToggleAll}
              showColumn={showColumn}
            />
            <tbody className="divide-y divide-neutral-100">
              {giftCards.map((gc, idx) => (
                <GiftCardsTableRow
                  key={gc.id}
                  giftCard={gc}
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
