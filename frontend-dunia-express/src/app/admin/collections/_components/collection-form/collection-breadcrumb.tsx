import * as React from "react";
import { Tag } from "lucide-react";
import { FormBreadcrumb } from "@/components/common/form-breadcrumb";
import type { CollectionBreadcrumbProps } from "../../_types";

export function CollectionBreadcrumb({
  title = "Add collection",
}: CollectionBreadcrumbProps) {
  return (
    <FormBreadcrumb
      title={title}
      icon={Tag}
      parentHref="/admin/collections"
    />
  );
}
