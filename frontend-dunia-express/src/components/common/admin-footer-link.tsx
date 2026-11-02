import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface AdminFooterLinkProps {
  href?: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AdminFooterLink({
  href = "#",
  label,
  className,
  children,
}: AdminFooterLinkProps) {
  const content = children || label;

  return (
    <div className={cn("mt-6 text-center text-sm text-neutral-500", className)}>
      {href.startsWith("http") || href === "#" ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="hover:underline transition-colors text-neutral-600 hover:text-neutral-900"
        >
          {content}
        </a>
      ) : (
        <Link
          href={href}
          className="hover:underline transition-colors text-neutral-600 hover:text-neutral-900"
        >
          {content}
        </Link>
      )}
    </div>
  );
}
