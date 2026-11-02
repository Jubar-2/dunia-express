import * as React from "react";
import { cn } from "@/lib/utils";

export interface PurchaseOrderIllustrationProps {
  className?: string;
}

export function PurchaseOrderIllustration({
  className,
}: PurchaseOrderIllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn("h-32 w-32", className)}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Orange circle backdrop */}
      <circle cx="92" cy="80" r="48" fill="#E8A33D" />

      {/* Folded corner behind the sheet */}
      <path
        d="M60 24h44l14 14v88a4 4 0 0 1-4 4H60a4 4 0 0 1-4-4V28a4 4 0 0 1 4-4z"
        fill="#D9DCDE"
      />

      {/* Main document */}
      <path
        d="M52 20h44l14 14v96a4 4 0 0 1-4 4H52a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z"
        fill="#FFFFFF"
        stroke="#D9DCDE"
        strokeWidth="1.5"
      />
      <path d="M96 20 110 34H96z" fill="#EEF0F1" />

      {/* Row 1 — mountain icon */}
      <rect x="56" y="46" width="26" height="20" rx="3" fill="#F1F8F6" />
      <path d="M60 60l5-7 4 5 3-4 5 6z" fill="#0F9488" />
      <rect x="90" y="49" width="24" height="3" rx="1.5" fill="#E4E6E8" />
      <rect x="90" y="57" width="18" height="3" rx="1.5" fill="#E4E6E8" />

      {/* Row 2 — shirt icon */}
      <rect x="56" y="74" width="26" height="20" rx="3" fill="#F1F8F6" />
      <path
        d="M69 78l-6 3 2 4 3-1v9h8v-9l3 1 2-4-6-3-3 2z"
        fill="#0F9488"
      />
      <rect x="90" y="77" width="24" height="3" rx="1.5" fill="#E4E6E8" />
      <rect x="90" y="85" width="20" height="3" rx="1.5" fill="#E4E6E8" />

      {/* Row 3 — bag icon */}
      <rect x="56" y="102" width="26" height="20" rx="3" fill="#F1F8F6" />
      <path
        d="M69 106c-3 0-5 2-5 5v3h10v-3c0-3-2-5-5-5z"
        fill="none"
        stroke="#0F9488"
        strokeWidth="1.8"
      />
      <path d="M63 111h12l1 9H62z" fill="#0F9488" />
      <rect x="90" y="105" width="24" height="3" rx="1.5" fill="#E4E6E8" />
      <rect x="90" y="113" width="16" height="3" rx="1.5" fill="#E4E6E8" />

      {/* Small accent squares on the orange circle */}
      <rect x="120" y="60" width="10" height="10" rx="2" fill="#C97A1E" />
      <rect x="122" y="98" width="8" height="8" rx="2" fill="#FBD9A1" />
    </svg>
  );
}
