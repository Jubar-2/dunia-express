"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface StickySaveBarProps {
  isDirty?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
  discardLabel?: string;
  message?: string;
  className?: string;
}

export function StickySaveBar({
  isDirty = true,
  onSave,
  onDiscard,
  isSaving = false,
  saveLabel = "Save",
  discardLabel = "Discard",
  message = "Unsaved changes",
  className,
}: StickySaveBarProps) {
  if (!isDirty) return null;

  return (
    <div
      className={cn(
        "sticky bottom-4 z-30 mx-auto mt-6 flex max-w-4xl items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-3 text-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-2",
        className
      )}
    >
      <span className="text-sm font-medium text-neutral-200">{message}</span>
      <div className="flex items-center gap-2">
        {onDiscard && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDiscard}
            className="h-8 text-neutral-300 hover:bg-neutral-800 hover:text-white"
          >
            {discardLabel}
          </Button>
        )}
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-8 bg-white text-neutral-900 font-medium hover:bg-neutral-100"
        >
          {isSaving ? "Saving..." : saveLabel}
        </Button>
      </div>
    </div>
  );
}
