import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";

export interface PurchaseOrderNotesCardProps {
  note?: string;
  onNoteChange?: (val: string) => void;
  tags?: string;
  onTagsChange?: (val: string) => void;
}

export function PurchaseOrderNotesCard({
  note = "",
  onNoteChange,
  tags = "urgent, restock, Q3",
  onTagsChange,
}: PurchaseOrderNotesCardProps) {
  return (
    <AdminCard title="Notes & Tags" subtitle="Internal instructions">
      <div className="flex flex-col gap-3.5">
        <FormField label="Note to supplier" id="po-note">
          <textarea
            id="po-note"
            rows={3}
            value={note}
            onChange={(e) => onNoteChange?.(e.target.value)}
            placeholder="Add special packaging or handling instructions..."
            className="w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </FormField>

        <FormField label="Tags" id="po-tags">
          <input
            id="po-tags"
            type="text"
            value={tags}
            onChange={(e) => onTagsChange?.(e.target.value)}
            placeholder="Comma separated tags..."
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </FormField>
      </div>
    </AdminCard>
  );
}
