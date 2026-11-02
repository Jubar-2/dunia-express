import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
}

export function AdminCard({
  title,
  subtitle,
  headerAction,
  headerClassName,
  bodyClassName,
  className,
  children,
  ...props
}: AdminCardProps) {
  const hasHeader = Boolean(title || subtitle || headerAction);

  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-5 shadow-sm text-sm text-neutral-900",
        className
      )}
      {...props}
    >
      {hasHeader && (
        <div
          className={cn(
            "mb-3 flex items-center justify-between gap-2",
            subtitle ? "items-start" : "items-center",
            headerClassName
          )}
        >
          <div>
            {title && (
              <h2 className="font-medium text-neutral-900 leading-snug">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-1.5 shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
