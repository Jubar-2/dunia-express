"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiscountsRosetteIcon } from "../_components";
import {
  DiscountMethodCard,
  DiscountValueCard,
  DiscountEligibilityCard,
  DiscountRequirementsCard,
  type RequirementType,
  DiscountCombinationsCard,
  DiscountScheduleCard,
  DiscountSummaryCard,
  DiscountTagsCard,
  DiscountCollectionsModal,
} from "./_components";
import type {
  DiscountMethod,
  DiscountType,
} from "../_types/discount.types";

function NewDiscountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType =
    (searchParams.get("type") as DiscountType) || "amount-off-products";

  // Form State
  const [method, setMethod] = React.useState<DiscountMethod>("Automatic");
  const [title, setTitle] = React.useState("");
  const [code, setCode] = React.useState("");
  const [valueType, setValueType] = React.useState<"Percentage" | "Fixed amount">(
    "Percentage"
  );
  const [value, setValue] = React.useState("");
  const [appliesTo, setAppliesTo] = React.useState<
    "Specific collections" | "Specific products"
  >("Specific collections");
  const [selectedTargets, setSelectedTargets] = React.useState<string[]>([]);
  const [eligibility, setEligibility] = React.useState("All customers");
  const [applyOnPos, setApplyOnPos] = React.useState(false);
  const [requirementType, setRequirementType] =
    React.useState<RequirementType>("none");
  const [minAmount, setMinAmount] = React.useState("");
  const [minQuantity, setMinQuantity] = React.useState("");
  const [combineProductDiscounts, setCombineProductDiscounts] =
    React.useState(false);
  const [combineOrderDiscounts, setCombineOrderDiscounts] = React.useState(false);
  const [combineShippingDiscounts, setCombineShippingDiscounts] =
    React.useState(false);

  // Schedule State
  const [startDate, setStartDate] = React.useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [startTime, setStartTime] = React.useState("12:00");
  const [hasEndDate, setHasEndDate] = React.useState(false);
  const [endDate, setEndDate] = React.useState("");
  const [endTime, setEndTime] = React.useState("23:59");

  // Tags State
  const [tags, setTags] = React.useState<string[]>([]);

  // Browse Modal
  const [isBrowseOpen, setIsBrowseOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const typeTitles: Record<DiscountType, string> = {
    "amount-off-products": "Amount off products",
    "buy-x-get-y": "Buy X get Y",
    "amount-off-order": "Amount off order",
    "free-shipping": "Free shipping",
  };

  const typeTitle = typeTitles[initialType] || "Amount off products";

  const handleToggleTarget = (target: string) => {
    setSelectedTargets((prev) =>
      prev.includes(target)
        ? prev.filter((t) => t !== target)
        : [...prev, target]
    );
  };

  const handleRemoveTarget = (target: string) => {
    setSelectedTargets((prev) => prev.filter((t) => t !== target));
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleDiscard = () => {
    router.push("/admin/discounts");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push("/admin/discounts");
    }, 500);
  };

  return (
    <div className="relative mx-auto max-w-6xl w-full px-6 py-4 sm:px-8 text-sm text-neutral-900 pb-20">
      {/* Floating Save Pill at Top Center (Fixed) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-neutral-800 bg-[#1a1a1a] px-4 py-1 text-white shadow-xl">
          <span className="text-xs font-medium text-neutral-300">
            Unsaved discount
          </span>
          <div className="h-3 w-px bg-neutral-700" />
          <button
            type="button"
            onClick={handleDiscard}
            className="text-xs text-neutral-300 hover:text-white transition-colors font-medium px-1.5 py-0.5 rounded"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-full bg-white px-3 py-0.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Top Bar: Breadcrumb `< [Rosette] Discounts` */}
      <div className="mb-3">
        <Link
          href="/admin/discounts"
          className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-neutral-500 shrink-0" />
          <DiscountsRosetteIcon className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
          <span className="ml-0.5">Discounts</span>
        </Link>
      </div>

      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-[18px] sm:text-xl font-semibold text-[#1a1a1a] tracking-tight">
          Create discount
        </h1>
      </div>

      {/* Main Grid: Left Column + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* Left Column (Cards) */}
        <div className="flex flex-col gap-4">
          <DiscountMethodCard
            typeTitle={typeTitle}
            method={method}
            onMethodChange={setMethod}
            title={title}
            onTitleChange={setTitle}
            code={code}
            onCodeChange={setCode}
          />

          <DiscountValueCard
            valueType={valueType}
            onValueTypeChange={setValueType}
            value={value}
            onValueChange={setValue}
            appliesTo={appliesTo}
            onAppliesToChange={setAppliesTo}
            selectedTargets={selectedTargets}
            onRemoveTarget={handleRemoveTarget}
            onOpenBrowse={() => setIsBrowseOpen(true)}
          />

          <DiscountEligibilityCard
            eligibility={eligibility}
            onEligibilityChange={setEligibility}
            applyOnPos={applyOnPos}
            onApplyOnPosChange={setApplyOnPos}
          />

          <DiscountRequirementsCard
            requirementType={requirementType}
            onRequirementTypeChange={setRequirementType}
            minAmount={minAmount}
            onMinAmountChange={setMinAmount}
            minQuantity={minQuantity}
            onMinQuantityChange={setMinQuantity}
          />

          <DiscountCombinationsCard
            combineProductDiscounts={combineProductDiscounts}
            onCombineProductChange={setCombineProductDiscounts}
            combineOrderDiscounts={combineOrderDiscounts}
            onCombineOrderChange={setCombineOrderDiscounts}
            combineShippingDiscounts={combineShippingDiscounts}
            onCombineShippingChange={setCombineShippingDiscounts}
          />

          <DiscountScheduleCard
            startDate={startDate}
            onStartDateChange={setStartDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            hasEndDate={hasEndDate}
            onHasEndDateChange={setHasEndDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            endTime={endTime}
            onEndTimeChange={setEndTime}
          />
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-4">
          <DiscountSummaryCard
            title={title}
            code={code}
            method={method}
            typeLabel={typeTitle}
            eligibility={eligibility}
            applyOnPos={applyOnPos}
            requirementType={requirementType}
            minAmount={minAmount}
            minQuantity={minQuantity}
            combineProductDiscounts={combineProductDiscounts}
            combineOrderDiscounts={combineOrderDiscounts}
            combineShippingDiscounts={combineShippingDiscounts}
            startDate={startDate}
          />

          <DiscountTagsCard
            tags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
          />
        </div>
      </div>

      {/* Browse Collections / Products Modal */}
      <DiscountCollectionsModal
        isOpen={isBrowseOpen}
        onClose={() => setIsBrowseOpen(false)}
        selectedTargets={selectedTargets}
        onToggleTarget={handleToggleTarget}
        appliesTo={appliesTo}
      />
    </div>
  );
}

export default function NewDiscountPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-neutral-500 text-xs">
          Loading discount form...
        </div>
      }
    >
      <NewDiscountForm />
    </React.Suspense>
  );
}
