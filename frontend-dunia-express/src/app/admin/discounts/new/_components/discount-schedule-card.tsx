"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DiscountScheduleCardProps {
  startDate: string;
  onStartDateChange: (val: string) => void;
  startTime: string;
  onStartTimeChange: (val: string) => void;
  hasEndDate: boolean;
  onHasEndDateChange: (val: boolean) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  endTime: string;
  onEndTimeChange: (val: string) => void;
}

export function DiscountScheduleCard({
  startDate,
  onStartDateChange,
  startTime,
  onStartTimeChange,
  hasEndDate,
  onHasEndDateChange,
  endDate,
  onEndDateChange,
  endTime,
  onEndTimeChange,
}: DiscountScheduleCardProps) {
  const [isEditingStart, setIsEditingStart] = React.useState(false);

  const formattedStart = React.useMemo(() => {
    try {
      if (!startDate) return "Nov 2 at 12:06 PM";
      const [year, month, day] = startDate.split("-").map(Number);
      const [hours, mins] = (startTime || "12:00").split(":").map(Number);
      const d = new Date(year, month - 1, day, hours, mins);
      const monthStr = d.toLocaleDateString("en-US", { month: "short" });
      const dayNum = d.getDate();
      const h = hours % 12 || 12;
      const ampm = hours >= 12 ? "PM" : "AM";
      const mStr = mins < 10 ? `0${mins}` : `${mins}`;
      return `${monthStr} ${dayNum} at ${h}:${mStr} ${ampm}`;
    } catch {
      return "Nov 2 at 12:06 PM";
    }
  }, [startDate, startTime]);

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-semibold text-neutral-900">Schedule</h2>

      {/* Main Schedule Container matching screenshot */}
      <div className="rounded-lg border border-neutral-300 bg-white p-2 sm:px-3 sm:py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isEditingStart ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-8 text-xs border-neutral-300"
              />
              <Input
                type="time"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="h-8 w-24 text-xs border-neutral-300"
              />
              <button
                type="button"
                onClick={() => setIsEditingStart(false)}
                className="text-xs text-neutral-600 hover:text-neutral-900 underline font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingStart(true)}
              className="text-xs text-neutral-800 hover:text-neutral-950 font-normal hover:underline"
            >
              {formattedStart}
            </button>
          )}

          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            EST
          </span>
        </div>

        {!hasEndDate ? (
          <button
            type="button"
            onClick={() => onHasEndDateChange(true)}
            className="inline-flex items-center gap-1 text-xs text-neutral-700 hover:text-neutral-950 font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5 text-neutral-500" />
            <span>Set end date</span>
          </button>
        ) : null}
      </div>

      {/* Optional End Date */}
      {hasEndDate && (
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-700">End:</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="h-8 text-xs border-neutral-300"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="h-8 w-24 text-xs border-neutral-300"
            />
            <span className="text-[11px] font-medium text-neutral-500 uppercase">
              EST
            </span>
          </div>

          <button
            type="button"
            onClick={() => onHasEndDateChange(false)}
            className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1 font-medium"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
