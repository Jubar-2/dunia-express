import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminTableContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AdminTableContainer({
  children,
  className,
  ...props
}: AdminTableContainerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
