"use client";

import * as React from "react";
import { Tag as TagIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface DiscountTagsCardProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function DiscountTagsCard({
  tags,
  onAddTag,
  onRemoveTag,
}: DiscountTagsCardProps) {
  const [inputValue, setInputValue] = React.useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      onAddTag(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-neutral-900">Tags</h3>

      <div className="relative">
        <TagIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add tags"
          className="h-9 pl-8 text-xs border-neutral-300"
        />
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-800"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
