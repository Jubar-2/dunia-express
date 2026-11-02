import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProductTemplateCardProps {
  themeTemplate: string;
  onThemeTemplateChange: (val: string) => void;
}

export function ProductTemplateCard({
  themeTemplate,
  onThemeTemplateChange,
}: ProductTemplateCardProps) {
  return (
    <AdminCard title="Theme template">
      <FormField>
        <Select value={themeTemplate} onValueChange={(val) => onThemeTemplateChange(val || "default")}>
          <SelectTrigger className="border-neutral-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default product</SelectItem>
            <SelectItem value="featured">Featured product</SelectItem>
            <SelectItem value="custom">Custom template</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </AdminCard>
  );
}
