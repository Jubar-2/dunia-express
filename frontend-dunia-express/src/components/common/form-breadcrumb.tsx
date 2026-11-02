import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormBreadcrumbProps {
  title: string;
  icon?: React.ElementType;
  parentLabel?: string;
  parentHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function FormBreadcrumb({
  title,
  icon: Icon,
  parentLabel,
  parentHref,
  actions,
  className,
}: FormBreadcrumbProps) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center justify-between gap-3",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-neutral-500">
        {Icon && (
          parentHref ? (
            <Link
              href={parentHref}
              className="text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              <Icon className="h-4 w-4" />
            </Link>
          ) : (
            <Icon className="h-4 w-4" />
          )
        )}

        {parentLabel && parentHref && (
          <>
            <Link
              href={parentHref}
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors hover:underline"
            >
              {parentLabel}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        )}

        {!parentLabel && <ChevronRight className="h-3.5 w-3.5" />}

        <h1 className="text-[18px] font-semibold text-[#303030] tracking-tight">
          {title}
        </h1>
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
