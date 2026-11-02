import * as React from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface TransfersHeaderProps {
  onCreateTransfer?: () => void;
  isDataAvailable?: boolean;
}

export function TransfersHeader({
  onCreateTransfer,
  isDataAvailable = true,
}: TransfersHeaderProps) {
  return (
    <AdminPageHeader
      title="Transfers"
      icon={ArrowLeftRight}
      primaryAction={
        isDataAvailable
          ? {
              label: "Create transfer",
              onClick: onCreateTransfer,
              icon: Plus,
            }
          : undefined
      }
    />
  );
}
