"use client";

import * as React from "react";
import Link from "next/link";
import { Trash2, Tag, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Discount } from "../_types/discount.types";

export interface DiscountsTableProps {
  discounts: Discount[];
  onDeleteDiscount: (id: string) => void;
}

export function DiscountsTable({
  discounts,
  onDeleteDiscount,
}: DiscountsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-neutral-200/80 bg-neutral-50/70 text-neutral-600 font-medium">
            <tr>
              <th className="px-5 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Used</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-800">
            {discounts.map((discount) => {
              const isActive = discount.status === "Active";
              return (
                <tr
                  key={discount.id}
                  className="hover:bg-neutral-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/discounts/new?type=${discount.type}&id=${discount.id}`}
                      className="font-semibold text-neutral-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {discount.title}
                    </Link>
                    {discount.summary && (
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {discount.summary}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-neutral-100 text-neutral-700 border border-neutral-200/60"
                      }`}
                    >
                      {discount.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600">
                    {discount.method}
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600">
                    {discount.typeLabel}
                  </td>
                  <td className="px-4 py-3.5 text-neutral-600 font-medium">
                    {discount.usedCount}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteDiscount(discount.id)}
                      className="h-7 w-7 p-0 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
