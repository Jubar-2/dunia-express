import { useEffect, useState } from "react";
import {
  LayoutGrid,
  List,
  Columns3,
  SlidersHorizontal,
  X,
  Plus,
  Search as SearchIcon,
} from "lucide-react";
import type { CollectionItemsCardProps } from "../../_types";
import { motion } from "motion/react";

export function CollectionItemsCard({
  itemCount = 0,
  statusLabel = "Status: Active, Draft, Unlisted, and Suspended",
  onAddCondition,
  onAddProducts,
  onClearAll,
  onRemoveStatusFilter,
}: CollectionItemsCardProps) {
  const [items, setItems] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {

      const idxA = Math.floor(Math.random() * 8);
      let idxB = Math.floor(Math.random() * 8);
      while (idxB === idxA) {
        idxB = Math.floor(Math.random() * 8);
      }

      setItems((prevItems) => {
        const newItems = [...prevItems];
        const temp = newItems[idxA];
        newItems[idxA] = newItems[idxB];
        newItems[idxB] = temp;

        setActiveItem(temp);
        return newItems;
      });


      setTimeout(() => {
        setActiveItem(null);
      }, 1200);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-neutral-900">Collection items</h2>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            {itemCount}
          </span>
        </div>
        <span className="text-neutral-400">
          Add conditions or products to populate your collection
        </span>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 px-5 py-2.5">
        <div className="flex items-center rounded-md border border-neutral-200 p-0.5">
          <button type="button" className="rounded p-1 text-neutral-500 hover:bg-neutral-100">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button type="button" className="rounded p-1 text-neutral-400 hover:bg-neutral-100">
            <List className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-50"
        >
          <Columns3 className="h-3.5 w-3.5" />
          4
        </button>
        <div className="flex-1" />
        <button type="button" className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-5 pb-3 pt-1">
        <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-700">
          {statusLabel}
          <X
            onClick={onRemoveStatusFilter}
            className="h-3 w-3 cursor-pointer text-neutral-400"
          />
        </span>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-neutral-400 hover:text-neutral-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Skeleton grid */}
      <div className="grid grid-cols-4 gap-4 px-5 pb-5">
        {items.map((id) => {
          const isFloating = activeItem === id;

          return (
            <motion.div
              key={id}
              layout
              animate={{
                scale: isFloating ? 1.03 : 1,
                zIndex: isFloating ? 20 : 1,
                boxShadow: isFloating
                  ? "0px 16px 24px -4px rgba(0, 0, 0, 0.1), 0px 6px 10px -4px rgba(0, 0, 0, 0.06)"
                  : "0px 0px 0px 0px rgba(0, 0, 0, 0)",
              }}
              transition={{
                layout: {
                  duration: 0.7,
                  ease: [0.25, 1, 0.5, 1],
                },
                scale: { duration: 0.4, ease: "easeOut" },
                boxShadow: { duration: 0.4, ease: "easeOut" },
              }}
              className="relative flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-2"
            >
              <div className="aspect-square animate-pulse rounded-md bg-neutral-100" />
              <div className="h-2.5 w-4/5 animate-pulse rounded bg-neutral-100" />
              <div className="h-2.5 w-3/5 animate-pulse rounded bg-neutral-100" />
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 border-t border-neutral-200 px-5 py-3">
        <button
          type="button"
          onClick={onAddCondition}
          className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <Plus className="h-3.5 w-3.5" />
          Add condition
        </button>
        <button
          type="button"
          onClick={onAddProducts}
          className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <SearchIcon className="h-3.5 w-3.5" />
          Add products
        </button>
      </div>
    </div>
  );
}