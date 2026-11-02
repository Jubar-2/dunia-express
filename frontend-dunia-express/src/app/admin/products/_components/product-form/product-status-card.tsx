import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { FormField } from "@/components/common/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/status-badge";

export interface ProductStatusCardProps {
  status: "active" | "draft";
  onStatusChange: (status: "active" | "draft") => void;
}

export function ProductStatusCard({
  status,
  onStatusChange,
}: ProductStatusCardProps) {
  return (
    <AdminCard title="Status">
      <FormField>
        <Select value={status} onValueChange={(val) => onStatusChange(val as "active" | "draft")}>
          <SelectTrigger className="border-neutral-300">
            <div className="flex items-center gap-2">
              <StatusBadge variant={status} size="sm" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </FormField>
    </AdminCard>
  );
}
