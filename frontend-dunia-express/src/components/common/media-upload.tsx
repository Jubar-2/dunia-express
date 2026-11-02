"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MediaItem {
  id: string;
  url: string;
  name?: string;
  size?: string;
}

export interface MediaUploadProps {
  items?: MediaItem[];
  onUpload?: (files: FileList) => void;
  onSelectExisting?: () => void;
  onRemoveItem?: (id: string) => void;
  accept?: string;
  hint?: string;
  className?: string;
}

export function MediaUpload({
  items = [],
  onUpload,
  onSelectExisting,
  onRemoveItem,
  accept = "image/*,video/*",
  hint = "Accepts images, videos, or 3D models",
  className,
}: MediaUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload?.(e.dataTransfer.files);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onUpload?.(e.target.files);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-8 px-4 text-center transition-colors",
          isDragging
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-300 hover:border-neutral-400 bg-white"
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 mb-1">
          <UploadCloud className="h-5 w-5" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 border-neutral-300 text-neutral-700 font-medium"
          >
            Upload new
          </Button>
          {onSelectExisting && (
            <Button
              type="button"
              variant="ghost"
              onClick={onSelectExisting}
              className="h-8 text-neutral-700 hover:bg-neutral-100"
            >
              Select existing
            </Button>
          )}
        </div>

        {hint && <p className="text-xs text-neutral-400 mt-1">{hint}</p>}
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt={item.name || "Media"}
                className="h-full w-full object-cover"
              />
              {onRemoveItem && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute top-1 right-1 rounded-full bg-neutral-900/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-neutral-900"
                  aria-label="Remove media"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
