import * as React from "react";
import { Gift, Plus, ArrowDownToLine } from "lucide-react";
import { AdminPageHeader } from "@/components/common/admin-page-header";

export interface GiftCardsHeaderProps {
  onExport?: () => void;
  onIssueGiftCard?: () => void;
  isDataAvailable?: boolean;
}

export function GiftCardsHeader({
  onExport,
  onIssueGiftCard,
  isDataAvailable = true,
}: GiftCardsHeaderProps) {
  return (
    <AdminPageHeader
      title="Gift cards"
      icon={Gift}
      secondaryActions={
        isDataAvailable
          ? [
              {
                label: "Export",
                onClick: onExport,
                icon: ArrowDownToLine,
              },
            ]
          : undefined
      }
      primaryAction={
        isDataAvailable
          ? {
              label: "Issue gift card",
              onClick: onIssueGiftCard,
              icon: Plus,
            }
          : undefined
      }
    />
  );
}
