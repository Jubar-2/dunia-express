"use client";

import * as React from "react";
import { X, Upload, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Category, CategoryFormData } from "../_types/category.types";

export interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData, editingId?: string) => void;
  editingCategory?: Category | null;
  existingCategories: Category[];
}

const SWATCH_PRESETS = [
  "bg-gradient-to-br from-neutral-200 to-neutral-400",
  "bg-gradient-to-br from-sky-100 to-blue-200",
  "bg-gradient-to-br from-teal-100 to-cyan-200",
  "bg-gradient-to-br from-pink-100 to-rose-200",
  "bg-gradient-to-br from-amber-100 to-yellow-200",
  "bg-gradient-to-br from-emerald-100 to-teal-200",
  "bg-gradient-to-br from-purple-100 to-indigo-200",
  "bg-gradient-to-br from-rose-100 to-orange-200",
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  existingCategories,
}: CategoryFormModalProps) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [isSlugManual, setIsSlugManual] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [parentId, setParentId] = React.useState("");
  const [status, setStatus] = React.useState<"active" | "archived">("active");
  const [position, setPosition] = React.useState(1);
  const [swatch, setSwatch] = React.useState(SWATCH_PRESETS[0]);

  // Sync state when modal opens or editingCategory changes
  React.useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setSlug(editingCategory.slug);
      setIsSlugManual(true);
      setDescription(editingCategory.description || "");
      setParentId(editingCategory.parentId || "");
      setStatus(editingCategory.status);
      setPosition(editingCategory.position);
      setSwatch(editingCategory.swatch || SWATCH_PRESETS[0]);
    } else {
      setName("");
      setSlug("");
      setIsSlugManual(false);
      setDescription("");
      setParentId("");
      setStatus("active");
      setPosition(existingCategories.length + 1);
      setSwatch(SWATCH_PRESETS[0]);
    }
  }, [editingCategory, isOpen, existingCategories.length]);

  // Auto-generate slug when name changes, unless user manually edited slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isSlugManual) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugManual(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        description: description.trim(),
        parentId,
        status,
        position: Number(position) || 1,
        swatch,
      },
      editingCategory?.id
    );
    onClose();
  };

  if (!isOpen) return null;

  // Filter available parent candidates (cannot select oneself as parent)
  const availableParents = existingCategories.filter(
    (c) => !editingCategory || c.id !== editingCategory.id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {editingCategory ? "Edit category" : "Add category"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {editingCategory
                ? "Update category hierarchy, slug, and display settings"
                : "Create a new product department or nested sub-category"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 text-xs">
          {/* Category Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Cleansers & Face Wash"
              required
              className="h-9 text-xs"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-800">
                Slug <span className="text-rose-500">*</span>
              </label>
              {isSlugManual && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugManual(false);
                    setSlug(generateSlug(name));
                  }}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  Auto-generate
                </button>
              )}
            </div>
            <div className="flex items-center rounded-md border border-neutral-300 bg-neutral-50 px-2.5 text-xs">
              <span className="text-neutral-400 font-mono">/categories/</span>
              <input
                value={slug}
                onChange={handleSlugChange}
                placeholder="cleansers-face-wash"
                required
                className="h-9 w-full bg-transparent pl-1 font-mono text-xs text-neutral-800 outline-none"
              />
            </div>
          </div>

          {/* Parent Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Parent Category
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="h-9 w-full rounded-md border border-neutral-300 bg-white px-2.5 text-xs text-neutral-800 outline-none focus:border-neutral-900"
            >
              <option value="">None (Top-level Category)</option>
              {availableParents.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.parentName ? `${cat.parentName} > ` : ""}
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail / Swatch Preset */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
              Category Thumbnail Swatch
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {SWATCH_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setSwatch(preset)}
                  className={`relative h-7 w-7 rounded-md border ${preset} transition-transform ${
                    swatch === preset
                      ? "ring-2 ring-neutral-900 scale-105"
                      : "border-neutral-300 hover:scale-105"
                  }`}
                >
                  {swatch === preset && (
                    <Check className="h-3.5 w-3.5 mx-auto text-neutral-800" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Description
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description for storefront category banner and SEO"
              rows={2}
              className="resize-none text-xs"
            />
          </div>

          {/* Position & Status Row */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Position */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Display Position
              </label>
              <Input
                type="number"
                min={1}
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="h-9 text-xs"
              />
            </div>

            {/* Status Toggle */}
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Visibility Status
              </label>
              <div className="flex h-9 items-center justify-between rounded-md border border-neutral-300 px-3">
                <span className="text-xs font-medium text-neutral-700 capitalize">
                  {status}
                </span>
                <Switch
                  checked={status === "active"}
                  onCheckedChange={(checked) =>
                    setStatus(checked ? "active" : "archived")
                  }
                  size="sm"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="mt-2 flex items-center justify-end gap-2 border-t border-neutral-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              {editingCategory ? "Save changes" : "Create category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
