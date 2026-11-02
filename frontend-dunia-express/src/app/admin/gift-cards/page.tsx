"use client";

import * as React from "react";
import { AdminFooterLink, TableColumnSettings } from "@/components/common";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useTableSettings } from "@/hooks/use-table-settings";
import {
  GiftCardsHeader,
  GiftCardsStats,
  GiftCardsTable,
} from "./_components";
import { INITIAL_GIFT_CARDS } from "./_data/mock-gift-cards";

const GIFT_CARD_COLUMNS = [
  { key: "code", label: "Card code", disableToggle: true },
  { key: "customer", label: "Customer" },
  { key: "status", label: "Status" },
  { key: "balance", label: "Balance" },
  { key: "initialValue", label: "Initial value" },
  { key: "issueDate", label: "Issue date" },
  { key: "expirationDate", label: "Expiration" },
];

const GIFT_CARD_SORT_OPTIONS = [
  { label: "Card code", value: "code" },
  { label: "Balance", value: "balance" },
  { label: "Initial value", value: "initialValue" },
  { label: "Issue date", value: "issueDate" },
  { label: "Expiration date", value: "expirationDate" },
];

const DEFAULT_VISIBLE_COLUMNS = [
  "code",
  "customer",
  "status",
  "balance",
  "initialValue",
  "issueDate",
  "expirationDate",
];

export default function GiftCardsPage() {
  const [searchValue, setSearchValue] = React.useState("");

  const {
    visibleColumns,
    toggleColumn,
    showColumn,
    resetColumns,
    showAllColumns,
    activeSort,
    setActiveSort,
  } = useTableSettings({
    storageKey: "gift_cards_table",
    defaultVisibleColumns: DEFAULT_VISIBLE_COLUMNS,
    defaultSort: { field: "issueDate", order: "desc" },
  });

  const filteredAndSortedCards = React.useMemo(() => {
    let list = [...INITIAL_GIFT_CARDS];

    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          (c.customer && c.customer.name.toLowerCase().includes(q)) ||
          (c.customer && c.customer.email.toLowerCase().includes(q))
      );
    }

    if (activeSort?.field) {
      list.sort((a, b) => {
        if (activeSort.field === "balance") {
          return activeSort.order === "asc"
            ? a.balance - b.balance
            : b.balance - a.balance;
        }
        if (activeSort.field === "initialValue") {
          return activeSort.order === "asc"
            ? a.initialValue - b.initialValue
            : b.initialValue - a.initialValue;
        }
        if (activeSort.field === "code") {
          return activeSort.order === "asc"
            ? a.code.localeCompare(b.code)
            : b.code.localeCompare(a.code);
        }
        return 0;
      });
    }

    return list;
  }, [searchValue, activeSort]);

  const {
    checked,
    allChecked,
    someChecked,
    toggleAll,
    toggleOne,
  } = useTableSelection(filteredAndSortedCards.length);

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      <GiftCardsHeader
        isDataAvailable={filteredAndSortedCards.length > 0}
        onExport={() => alert("Export gift cards")}
        onIssueGiftCard={() => alert("Issue gift card")}
      />

      {filteredAndSortedCards.length > 0 && <GiftCardsStats />}

      <GiftCardsTable
        giftCards={filteredAndSortedCards}
        checked={checked}
        allChecked={allChecked}
        someChecked={someChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showColumn={showColumn}
        onIssueGiftCard={() => alert("Issue gift card")}
        rightSlot={
          <TableColumnSettings
            columns={GIFT_CARD_COLUMNS}
            visibleColumns={visibleColumns}
            onToggleColumn={toggleColumn}
            sortOptions={GIFT_CARD_SORT_OPTIONS}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            onResetColumns={resetColumns}
            onShowAllColumns={() =>
              showAllColumns(GIFT_CARD_COLUMNS.map((c) => c.key))
            }
            triggerVariant={filteredAndSortedCards.length === 0 ? "ghost" : "outline"}
            triggerSize={filteredAndSortedCards.length === 0 ? "icon-sm" : "sm"}
            triggerLabel={filteredAndSortedCards.length === 0 ? null : "Columns"}
          />
        }
      />

      <AdminFooterLink
        href="#"
        label="Learn more about gift cards"
      />
    </div>
  );
}