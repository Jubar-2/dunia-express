import * as React from "react";
import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "active"
  | "draft"
  | "archived"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  status?: string;
  dot?: boolean;
  size?: "sm" | "md";
}

const variantStyles: Record<
  StatusBadgeVariant,
  { badge: string; dot: string }
> = {
  active: {
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-600",
  },
  draft: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-600",
  },
  archived: {
    badge: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-500",
  },
  success: {
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-600",
  },
  warning: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-600",
  },
  error: {
    badge: "bg-rose-100 text-rose-800",
    dot: "bg-rose-600",
  },
  neutral: {
    badge: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-500",
  },
};

function resolveVariant(variant?: StatusBadgeVariant, status?: string): StatusBadgeVariant {
  if (variant) return variant;
  if (!status) return "neutral";
  const normalized = status.trim().toLowerCase();
  if (normalized === "active" || normalized === "published") return "active";
  if (normalized === "draft") return "draft";
  if (normalized === "archived") return "archived";
  if (normalized === "warning") return "warning";
  if (normalized === "error") return "error";
  return "neutral";
}

export function StatusBadge({
  variant,
  status,
  dot = true,
  size = "sm",
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const resolved = resolveVariant(variant, status);
  const styles = variantStyles[resolved];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium leading-none",
        size === "sm" ? "gap-1.5 px-2.5 py-1 text-xs" : "gap-2 px-3 py-1.5 text-sm",
        styles.badge,
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "rounded-full shrink-0",
            size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
            styles.dot
          )}
        />
      )}
      {children || status}
    </span>
  );
}
