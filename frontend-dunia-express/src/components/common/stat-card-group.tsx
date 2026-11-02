import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatItem {
  id?: string;
  icon?: React.ElementType;
  label?: string;
  value?: React.ReactNode;
  isLink?: boolean;
  href?: string;
  customRender?: React.ReactNode;
}

export interface StatCardGroupProps {
  items?: StatItem[];
  children?: React.ReactNode;
  columns?: number;
  className?: string;
}

export function StatCardGroup({
  items,
  children,
  columns = 4,
  className,
}: StatCardGroupProps) {
  const colClass =
    columns === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1";

  return (
    <div
      className={cn(
        "mb-4 grid divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden",
        colClass,
        className
      )}
    >
      {items
        ? items.map((item, idx) => {
            if (item.customRender) {
              return (
                <div key={item.id || idx} className="px-5 py-4">
                  {item.customRender}
                </div>
              );
            }

            const Icon = item.icon;

            // If item is purely an icon + label row (like "30 days" date range selector)
            if (Icon && !item.value) {
              return (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-2 px-5 py-4"
                >
                  <Icon className="h-4 w-4 text-neutral-500 shrink-0" />
                  <span className="text-neutral-700 text-sm">{item.label}</span>
                </div>
              );
            }

            return (
              <div key={item.id || idx} className="px-5 py-4">
                {item.label && (
                  <div className="font-medium text-neutral-900 text-sm">
                    {item.label}
                  </div>
                )}
                <div className="mt-1 text-sm">
                  {item.isLink ? (
                    <a
                      href={item.href || "#"}
                      className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-neutral-500">{item.value}</span>
                  )}
                </div>
              </div>
            );
          })
        : children}
    </div>
  );
}
