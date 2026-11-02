"use client";

import { COLLECTION_ATTRIBUTES } from "../_data/mock-collections";
import { useConditionDropdown } from "../_hooks";
import { CollectionBreadcrumb } from "../_components/collection-form/collection-breadcrumb";
import { CollectionGeneralCard } from "../_components/collection-form/collection-general-card";
import { CollectionItemsCard } from "../_components/collection-form/collection-items-card";
import { CollectionTemplateCard } from "../_components/collection-form/collection-template-card";
import { CollectionSidebarCard } from "../_components/collection-form/collection-sidebar-card";

export default function NewCollectionPage() {
  const {
    conditionOpen,
    toggleCondition,
    conditionRef,
  } = useConditionDropdown();

  return (
    <div className="mx-auto max-w-6xl px-8 py-6">
      <CollectionBreadcrumb />

      <div className="grid grid-cols-[1fr_320px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <CollectionGeneralCard />
          <CollectionItemsCard />
          <CollectionTemplateCard />
        </div>

        {/* Right column */}
        <CollectionSidebarCard
          attributes={COLLECTION_ATTRIBUTES}
          isConditionOpen={conditionOpen}
          conditionRef={conditionRef}
          onToggleCondition={toggleCondition}
        />
      </div>
    </div>
  );
}