import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";

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
      <div className="relative flex items-center gap-5">
        <div className="flex h-28 w-16 flex-col items-center gap-1.5 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-sm">
          <div className="flex w-full items-center justify-between px-0.5">
            <span className="h-1 w-5 rounded-full bg-neutral-300" />
            <MapPin className="h-3 w-3 text-cyan-500" />
          </div>
          <div className="h-12 w-9 rounded-sm bg-neutral-300" />
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
            6
          </span>
        </div>
        <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 shadow-md">
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
        <div className="flex h-28 w-16 flex-col items-center gap-1.5 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-sm">
          <div className="flex w-full items-center justify-between px-0.5">
            <span className="h-1 w-5 rounded-full bg-neutral-300" />
            <MapPin className="h-3 w-3 text-emerald-600" />
          </div>
          <div className="h-12 w-9 rounded-sm bg-teal-400" />
          <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
            4
          </span>
        </div>
      </div>
    </div>
  );
}
