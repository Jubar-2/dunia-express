import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import { RichTextEditor } from "@/components/common/rich-text-editor";
import { Input } from "@/components/ui/input";

export interface ProductGeneralCardProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function ProductGeneralCard({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: ProductGeneralCardProps) {
  return (
    <AdminCard>
      <FormField label="Title">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Short sleeve t-shirt"
          className="border-neutral-300 focus:border-neutral-900"
        />
      </FormField>

      <div className="mt-4">
        <FormField label="Description">
          <RichTextEditor
            value={description}
            onChange={onDescriptionChange}
          />
        </FormField>
      </div>
    </AdminCard>
  );
}
