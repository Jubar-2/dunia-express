import * as React from "react";
import { Tag } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";
import type { CollectionHeaderProps } from "../../_types";

export function CollectionHeader({
  title = "Collections",
  actionHref = "/admin/collections/new",
  actionLabel = "Add collection",
  isDataAvailable = true,
}: CollectionHeaderProps) {
  return (
    <AdminPageHeader
      title={title}
      icon={Tag}
      primaryAction={
        isDataAvailable
          ? {
              label: actionLabel,
              href: actionHref,
            }
          : undefined
      }
    />
  );
}
