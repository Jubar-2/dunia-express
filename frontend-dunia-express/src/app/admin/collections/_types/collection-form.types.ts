import type * as React from "react";

export interface CollectionBreadcrumbProps {
  title?: string;
  parentLabel?: string;
  parentHref?: string;
}

export interface CollectionGeneralCardProps {
  title?: string;
  description?: string;
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChannelsClick?: () => void;
}

export interface CollectionItemsCardProps {
  itemCount?: number;
  statusLabel?: string;
  onAddCondition?: () => void;
  onAddProducts?: () => void;
  onClearAll?: () => void;
  onRemoveStatusFilter?: () => void;
}

export interface CollectionTemplateCardProps {
  className?: string;
}

export interface CollectionAttributePopoverProps {
  attributes: string[];
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectAttribute?: (attr: string) => void;
}

export interface CollectionSidebarCardProps {
  attributes: string[];
  isConditionOpen: boolean;
  conditionRef: React.RefObject<HTMLDivElement | null>;
  onToggleCondition: () => void;
  onAddProducts?: () => void;
  onExcludeClick?: () => void;
}

export interface UseConditionDropdownReturn {
  conditionOpen: boolean;
  setConditionOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleCondition: () => void;
  conditionRef: React.RefObject<HTMLDivElement | null>;
}
