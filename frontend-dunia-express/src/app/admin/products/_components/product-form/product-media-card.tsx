import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { MediaUpload, type MediaItem } from "@/components/common/media-upload";

export interface ProductMediaCardProps {
  media?: MediaItem[];
  onUpload?: (files: FileList) => void;
  onRemoveItem?: (id: string) => void;
  onSelectExisting?: () => void;
}

export function ProductMediaCard({
  media = [],
  onUpload,
  onRemoveItem,
  onSelectExisting,
}: ProductMediaCardProps) {
  return (
    <AdminCard title="Media">
      <MediaUpload
        items={media}
        onUpload={onUpload}
        onRemoveItem={onRemoveItem}
        onSelectExisting={onSelectExisting}
      />
    </AdminCard>
  );
}
