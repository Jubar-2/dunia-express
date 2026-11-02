import * as React from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DiscountsHeaderProps {
  onCreateDiscount?: () => void;
  onExport?: () => void;
}

export function DiscountsRosetteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "h-5 w-5"}
    >
      <path
        d="M10 2.2c.7 0 1.3.4 1.6 1 .4.8 1.4 1.2 2.2.9.7-.3 1.4 0 1.9.5.4.5.7 1.2.5 1.9-.3.8.1 1.8.9 2.2.6.3 1 .9 1 1.6s-.4 1.3-1 1.6c-.8.4-1.2 1.4-.9 2.2.2.7-.1 1.4-.5 1.9-.5.5-1.2.7-1.9.5-.8-.3-1.8.1-2.2.9-.3.6-.9 1-1.6 1s-1.3-.4-1.6-1c-.4-.8-1.4-1.2-2.2-.9-.7.3-1.4 0-1.9-.5-.5-.5-.7-1.2-.5-1.9.3-.8-.1-1.8-.9-2.2-.6-.3-1-.9-1-1.6s.4-1.3 1-1.6c.8-.4 1.2-1.4.9-2.2-.2-.7.1-1.4.5-1.9.5-.5 1.2-.7 1.9-.5.8.3 1.8-.1 2.2-.9.3-.6.9-1 1.6-1z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function DiscountsHeader({
  onCreateDiscount,
  onExport,
}: DiscountsHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      {/* Title with Flower/Rosette icon */}
      <div className="flex items-center gap-2">
        <DiscountsRosetteIcon className="h-5 w-5 text-neutral-800 shrink-0" />
        <h1 className="text-[18px] font-semibold text-[#1a1a1a] tracking-tight">
          Discounts
        </h1>
      </div>

      {/* Top right actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-8 gap-1.5 border-neutral-300 bg-white px-3 text-xs font-medium text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-900"
        >
          <Upload className="h-3.5 w-3.5 text-neutral-500" />
          Export
        </Button>

        <Button
          size="sm"
          onClick={onCreateDiscount}
          className="h-8 bg-[#1a1a1a] px-3.5 text-xs font-medium text-white shadow-sm hover:bg-[#303030]"
        >
          Create discount
        </Button>
      </div>
    </div>
  );
}
