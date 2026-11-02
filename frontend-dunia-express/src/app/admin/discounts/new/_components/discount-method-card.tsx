"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DiscountMethod } from "../../_types/discount.types";

export interface DiscountMethodCardProps {
  typeTitle: string;
  method: DiscountMethod;
  onMethodChange: (method: DiscountMethod) => void;
  title: string;
  onTitleChange: (title: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
}

export function DiscountMethodCard({
  typeTitle,
  method,
  onMethodChange,
  title,
  onTitleChange,
  code,
  onCodeChange,
}: DiscountMethodCardProps) {
  const handleGenerateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";
    for (let i = 0; i < 8; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    onCodeChange(randomCode);
  };

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">{typeTitle}</h2>

      {/* Method selector */}
      <div>
        <label className="text-xs font-medium text-neutral-700 block mb-1.5">
          Method
        </label>
        <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100/80 p-0.5">
          <button
            type="button"
            onClick={() => onMethodChange("Code")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              method === "Code"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Discount code
          </button>
          <button
            type="button"
            onClick={() => onMethodChange("Automatic")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              method === "Automatic"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Automatic discount
          </button>
        </div>
      </div>

      {/* Code or Title Input */}
      {method === "Code" ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-700">
              Discount code
            </label>
            <button
              type="button"
              onClick={handleGenerateCode}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="h-3 w-3" />
              Generate
            </button>
          </div>
          <Input
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="e.g. SUMMER20"
            className="h-9 border-neutral-300 font-mono text-xs uppercase"
          />
          <p className="text-[11px] text-neutral-500">
            Customers will enter this code at checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-700 block">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder=""
            className="h-9 border-neutral-300 text-xs"
          />
          <p className="text-[11px] text-neutral-500">
            Customers will see this in their cart and at checkout.
          </p>
        </div>
      )}
    </div>
  );
}
