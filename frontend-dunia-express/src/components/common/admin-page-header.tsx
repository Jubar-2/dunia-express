import * as React from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeaderActionItem {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  icon?: React.ElementType;
  className?: string;
  disabled?: boolean;
}

export interface AdminPageHeaderProps {
  title: string;
  icon?: React.ElementType;
  subtitle?: string;
  primaryAction?: HeaderActionItem;
  secondaryActions?: HeaderActionItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  icon: Icon,
  subtitle,
  primaryAction,
  secondaryActions,
  actions,
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-neutral-700 shrink-0" />}
        <div>
          <h1 className="text-[18px] font-semibold text-[#303030] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] text-[#616161] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {secondaryActions &&
          secondaryActions.map((action, idx) => {
            const ActionIcon = action.icon;
            const content = (
              <>
                <span>{action.label}</span>
                {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
              </>
            );

            if (action.href) {
              return (
                <Link
                  key={idx}
                  href={action.href}
                  className={cn(
                    buttonVariants({
                      variant: action.variant || "outline",
                      size: "default",
                    }),
                    "h-8 border-neutral-300 text-neutral-700",
                    action.className
                  )}
                >
                  {content}
                </Link>
              );
            }

            return (
              <Button
                key={idx}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  "h-8 border-neutral-300 text-neutral-700",
                  action.className
                )}
              >
                {content}
              </Button>
            );
          })}

        {actions}

        {primaryAction &&
          (primaryAction.href ? (
            <Link
              href={primaryAction.href}
              className={cn(
                buttonVariants({
                  variant: primaryAction.variant || "default",
                  size: "default",
                }),
                "h-8 bg-neutral-900 text-white hover:bg-neutral-800",
                primaryAction.className
              )}
            >
              {primaryAction.icon && (
                <primaryAction.icon className="h-3.5 w-3.5 mr-1" />
              )}
              {primaryAction.label}
            </Link>
          ) : (
            <Button
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className={cn(
                "h-8 bg-neutral-900 text-white hover:bg-neutral-800",
                primaryAction.className
              )}
            >
              {primaryAction.icon && (
                <primaryAction.icon className="h-3.5 w-3.5 mr-1" />
              )}
              {primaryAction.label}
            </Button>
          ))}

        {children}
      </div>
    </div>
  );
}
