import * as React from "react";
import { cn } from "@/lib/utils";

export interface DiscountIllustrationProps {
  className?: string;
}

export function DiscountIllustration({ className }: DiscountIllustrationProps) {
  return (
    <svg
      viewBox="0 0 200 170"
      className={cn("h-32 w-32 select-none", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Soft circular background */}
      <circle cx="100" cy="85" r="70" fill="#ECEFF1" />

      {/* Coupon Ticket (Golden Orange) */}
      <g id="coupon-ticket">
        {/* Ticket Base */}
        <rect
          x="52"
          y="56"
          width="96"
          height="58"
          rx="5"
          fill="#D68628"
        />

        {/* Top & Bottom Notches */}
        <circle cx="114" cy="56" r="4.5" fill="#ECEFF1" />
        <circle cx="114" cy="114" r="4.5" fill="#ECEFF1" />

        {/* Perforation line */}
        <line
          x1="114"
          y1="64"
          x2="114"
          y2="106"
          stroke="#FDF0D9"
          strokeWidth="2"
          strokeDasharray="3 3.5"
          strokeLinecap="round"
        />

        {/* % symbol on left section */}
        <text
          x="83"
          y="95"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize="28"
          fontWeight="700"
          fill="#FFFFFF"
          textAnchor="middle"
        >
          %
        </text>

        {/* Detail bars on the right stub */}
        <rect x="126" y="68" width="3.5" height="34" rx="1.5" fill="#BA6F1E" />
        <rect x="133" y="73" width="2.5" height="24" rx="1" fill="#BA6F1E" />
        <rect x="138" y="68" width="2.5" height="34" rx="1" fill="#BA6F1E" />
      </g>

      {/* Scissors Cutting Along the Perforation Line */}
      <g id="scissors">
        {/* Right blade (behind) */}
        <path
          d="M112 96L116 48L112 47L109 95Z"
          fill="#BAC0C5"
        />
        <path
          d="M114 48L116 48L112 96L110 96Z"
          fill="#9EA5AC"
        />

        {/* Left blade (front) */}
        <path
          d="M116 96L102 48L106 47L119 95Z"
          fill="#D9DEE1"
        />
        <path
          d="M104 47L106 47L119 95L117 95Z"
          fill="#EEF2F4"
        />

        {/* Pivot screw */}
        <circle cx="114" cy="96" r="3.5" fill="#6B7280" />
        <circle cx="114" cy="96" r="1.5" fill="#9CA3AF" />

        {/* Left scissor handle (Green loop) */}
        <path
          d="M111 98C108 106 100 115 94 122C88 129 77 129 70 122C63 115 64 104 71 97C78 90 89 95 95 101"
          stroke="#166534"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right scissor handle (Green loop) */}
        <path
          d="M117 98C120 106 128 115 134 122C140 129 151 129 158 122C165 115 164 104 157 97C150 90 139 95 133 101"
          stroke="#166534"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
