import * as React from "react";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";

export function NoData({
  searchValue,
  className,
}: {
  searchValue?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-44 w-44 items-center justify-center", className)}>
      <div className="absolute h-40 w-40 rounded-full bg-neutral-100" />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-teal-500/80">
        <Gift className="h-12 w-12 text-teal-700" strokeWidth={1.75} />
      </div>
    </div>
  );
}
