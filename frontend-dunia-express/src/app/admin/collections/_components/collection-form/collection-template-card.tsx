import * as React from "react";
import { cn } from "@/lib/utils";
import type { CollectionTemplateCardProps } from "../../_types";

export function CollectionTemplateCard({ className }: CollectionTemplateCardProps) {
  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-5 shadow-sm", className)}>
      <h2 className="font-medium text-neutral-900">
        Theme template
      </h2>
    </div>
  );
}
