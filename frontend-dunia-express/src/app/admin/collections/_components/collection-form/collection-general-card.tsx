import * as React from "react";
import { ArrowUpFromLine, Users2, ChevronDown } from "lucide-react";
import type { CollectionGeneralCardProps } from "../../_types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CollectionGeneralCard({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onImageSelect,
  onChannelsClick,
}: CollectionGeneralCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        <label className="flex h-27.5 w-27.5 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 hover:border-neutral-400">
          <ArrowUpFromLine className="h-5 w-5" />
          <input type="file" className="hidden" onChange={onImageSelect} />
        </label>
        <div className="flex-1">
          <Input
            value={title}
            onChange={onTitleChange}
            placeholder="Add title"
            className="w-full border-none bg-transparent text-[20px] text-[#616161] placeholder:text-[#616161] placeholder:text-[20px] placeholder:font-[600] placeholder:text-[#a3a3a3] focus:outline-none focus-visible:ring-0 font-[600]"
          />
          <Textarea
            value={description}
            onChange={onDescriptionChange}
            placeholder="Add description"
            rows={2}
            className="mt-1 w-full resize-none border-none bg-transparent text-[13px] text-[#616161] placeholder:text-[13px] placeholder:font-normal placeholder:text-[#616161] focus:outline-none focus-visible:ring-0"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onChannelsClick}
              className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Users2 className="h-3.5 w-3.5" />
              2 channels
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
