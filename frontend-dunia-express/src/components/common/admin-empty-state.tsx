import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
}

export interface AdminEmptyStateProps {
  illustration?: React.ReactNode;
  icon?: React.ElementType;
  iconClassName?: string;
  title: string;
  description?: React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  footerLink?: {
    label: string;
    href: string;
    className?: string;
  };
  className?: string;
  children?: React.ReactNode;
}

export function AdminEmptyState({
  illustration,
  icon: Icon,
  iconClassName,
  title,
  description,
  primaryAction,
  secondaryAction,
  footerLink,
  className,
  children,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-8 py-16 text-center",
        className
      )}
    >
      {/* Visual illustration or Icon */}
      {illustration ? (
        <div className="flex items-center justify-center">{illustration}</div>
      ) : Icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 shadow-inner">
          <Icon className={cn("h-8 w-8 text-neutral-700", iconClassName)} />
        </div>
      ) : null}

      {/* Title & Description */}
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
        {description && (
          <p className="max-w-md text-[13px] text-neutral-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action buttons */}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className={cn(
                  buttonVariants({
                    variant: secondaryAction.variant || "outline",
                    size: "default",
                  }),
                  "h-8 border-neutral-300 text-neutral-700 text-xs",
                  secondaryAction.className
                )}
              >
                {secondaryAction.icon && (
                  <secondaryAction.icon className="h-3.5 w-3.5 mr-1.5" />
                )}
                {secondaryAction.label}
              </Link>
            ) : (
              <Button
                variant={secondaryAction.variant || "outline"}
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
                className={cn(
                  "h-8 border-neutral-300 text-neutral-700 text-xs",
                  secondaryAction.className
                )}
              >
                {secondaryAction.icon && (
                  <secondaryAction.icon className="h-3.5 w-3.5 mr-1.5" />
                )}
                {secondaryAction.label}
              </Button>
            ))}

          {primaryAction &&
            (primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className={cn(
                  buttonVariants({
                    variant: primaryAction.variant || "default",
                    size: "default",
                  }),
                  "h-8 bg-neutral-900 text-white hover:bg-neutral-800 text-xs shadow-sm",
                  primaryAction.className
                )}
              >
                {primaryAction.icon && (
                  <primaryAction.icon className="h-3.5 w-3.5 mr-1.5" />
                )}
                {primaryAction.label}
              </Link>
            ) : (
              <Button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className={cn(
                  "h-8 bg-neutral-900 text-white hover:bg-neutral-800 text-xs shadow-sm",
                  primaryAction.className
                )}
              >
                {primaryAction.icon && (
                  <primaryAction.icon className="h-3.5 w-3.5 mr-1.5" />
                )}
                {primaryAction.label}
              </Button>
            ))}
        </div>
      )}

      {children}

      {/* Optional inline footer link */}
      {footerLink && (
        <div className="mt-2">
          <Link
            href={footerLink.href}
            className={cn(
              "text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:underline",
              footerLink.className
            )}
          >
            {footerLink.label}
          </Link>
        </div>
      )}
    </div>
  );
}
