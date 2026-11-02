"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/common/status-badge";
import { ExternalLink, Star } from "lucide-react";
import { BrandRowActions } from "./BrandRowActions";
import type { Brand } from "../_types/brand.types";

export interface BrandTableProps {
  brands: Brand[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (index: number) => void;
  showColumn?: (key: string) => boolean;
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onViewProducts?: (brand: Brand) => void;
  onToggleFeatured?: (brandId: string) => void;
}

function cleanWebsiteDisplay(url?: string): string {
  if (!url) return "";
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function formatBrandDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BrandTable({
  brands,
  checked,
  allChecked,
  someChecked,
  onToggleAll,
  onToggleOne,
  showColumn = () => true,
  onEdit,
  onDelete,
  onViewProducts,
  onToggleFeatured,
}: BrandTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[12px] font-medium text-neutral-500">
            {/* Checkbox */}
            <th className="w-10 py-2.5 pl-4 pr-2 text-left align-middle">
              <Checkbox
                checked={allChecked}
                onCheckedChange={onToggleAll}
                className={someChecked && !allChecked ? "opacity-70" : undefined}
                aria-label="Select all brands"
              />
            </th>

            {/* 1. Brand (locked) */}
            {showColumn("brand") && (
              <th className="py-2.5 px-3 text-left font-medium text-[12px]">
                Brand
              </th>
            )}

            {/* 2. Website / Link */}
            {showColumn("website") && (
              <th className="py-2.5 px-3 text-left font-medium text-[12px]">
                Website
              </th>
            )}

            {/* 3. Products Count */}
            {showColumn("products") && (
              <th className="py-2.5 px-3 text-right font-medium text-[12px]">
                Products
              </th>
            )}

            {/* 4. Featured Status */}
            {showColumn("featured") && (
              <th className="py-2.5 px-3 text-left font-medium text-[12px]">
                Featured
              </th>
            )}

            {/* 5. Status */}
            {showColumn("status") && (
              <th className="py-2.5 px-3 text-left font-medium text-[12px]">
                Status
              </th>
            )}

            {/* 6. Created Date */}
            {showColumn("createdAt") && (
              <th className="py-2.5 px-3 text-left font-medium text-[12px] hidden sm:table-cell">
                Created Date
              </th>
            )}

            {/* 7. Actions (locked) */}
            {showColumn("actions") && (
              <th className="w-12 py-2.5 pr-4 pl-2 text-right font-medium text-[12px]">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-100">
          {brands.map((brand, idx) => {
            const isChecked = checked[idx] || false;

            return (
              <tr
                key={brand.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/70 transition-colors text-[12px]"
              >
                {/* Checkbox */}
                <td className="w-10 py-2.5 pl-4 pr-2 align-middle">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleOne(idx)}
                    aria-label={`Select ${brand.name}`}
                  />
                </td>

                {/* 1. Brand (Logo thumbnail + Brand Name + Slug) */}
                {showColumn("brand") && (
                  <td className="py-2.5 px-3 align-middle text-[12px]">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 shrink-0 rounded-md border border-neutral-200 bg-white p-0.5 flex items-center justify-center overflow-hidden shadow-2xs">
                        {brand.logoUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-neutral-100 text-[11px] font-bold text-neutral-600 uppercase">
                            {brand.name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[200px] sm:max-w-[240px]">
                        <span
                          onClick={() => onEdit(brand)}
                          className="font-medium text-[12px] text-neutral-900 hover:underline cursor-pointer block truncate"
                          title={brand.name}
                        >
                          {brand.name}
                        </span>
                        <span
                          className="text-[11px] font-mono text-neutral-400 block truncate"
                          title={`/${brand.slug}`}
                        >
                          /{brand.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                )}

                {/* 2. Website / Link */}
                {showColumn("website") && (
                  <td className="py-2.5 px-3 align-middle text-[12px]">
                    {brand.website ? (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] text-neutral-600 hover:text-neutral-900 hover:underline max-w-[160px] truncate"
                        title={brand.website}
                      >
                        <span className="truncate">
                          {cleanWebsiteDisplay(brand.website)}
                        </span>
                        <ExternalLink className="h-3 w-3 text-neutral-400 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-neutral-400 text-[12px]">—</span>
                    )}
                  </td>
                )}

                {/* 3. Products Count */}
                {showColumn("products") && (
                  <td className="py-2.5 px-3 text-right text-[12px] font-mono font-medium text-neutral-800 align-middle">
                    {brand.productsCount}
                  </td>
                )}

                {/* 4. Featured Status */}
                {showColumn("featured") && (
                  <td className="py-2.5 px-3 align-middle text-[12px]">
                    {brand.isFeatured ? (
                      <button
                        type="button"
                        onClick={() => onToggleFeatured?.(brand.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2 py-0.5 text-[12px] font-medium text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                        title="Click to toggle featured status"
                      >
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                        <span>Featured</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleFeatured?.(brand.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[12px] font-medium text-neutral-500 hover:bg-neutral-200 transition-colors cursor-pointer"
                        title="Click to make featured"
                      >
                        <span>Standard</span>
                      </button>
                    )}
                  </td>
                )}

                {/* 5. Status */}
                {showColumn("status") && (
                  <td className="py-2.5 px-3 align-middle text-[12px]">
                    <StatusBadge
                      variant={brand.status === "active" ? "active" : "neutral"}
                      status={brand.status === "active" ? "Active" : "Inactive"}
                      size="sm"
                      className="text-[12px]"
                    />
                  </td>
                )}

                {/* 6. Created Date */}
                {showColumn("createdAt") && (
                  <td className="py-2.5 px-3 text-[12px] text-neutral-500 align-middle hidden sm:table-cell">
                    {formatBrandDate(brand.createdAt)}
                  </td>
                )}

                {/* 7. Actions */}
                {showColumn("actions") && (
                  <td className="w-12 py-2.5 pr-4 pl-2 text-right align-middle">
                    <BrandRowActions
                      brand={brand}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewProducts={onViewProducts}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
