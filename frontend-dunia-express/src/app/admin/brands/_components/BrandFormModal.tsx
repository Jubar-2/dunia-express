"use client";

import * as React from "react";
import {
  X,
  UploadCloud,
  Check,
  Sparkles,
  Globe,
  Trash2,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Brand, BrandFormData } from "../_types/brand.types";

export interface BrandFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BrandFormData, editingId?: string) => void;
  editingBrand?: Brand | null;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BrandFormModal({
  isOpen,
  onClose,
  onSave,
  editingBrand,
}: BrandFormModalProps) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [isSlugManual, setIsSlugManual] = React.useState(false);
  const [logoUrl, setLogoUrl] = React.useState<string | undefined>("");
  const [website, setWebsite] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [status, setStatus] = React.useState<"active" | "inactive">("active");

  const [isDragging, setIsDragging] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state when modal opens or editingBrand changes
  React.useEffect(() => {
    if (editingBrand) {
      setName(editingBrand.name);
      setSlug(editingBrand.slug);
      setIsSlugManual(true);
      setLogoUrl(editingBrand.logoUrl || "");
      setWebsite(editingBrand.website || "");
      setDescription(editingBrand.description || "");
      setIsFeatured(editingBrand.isFeatured);
      setStatus(editingBrand.status);
      setShowUrlInput(false);
    } else {
      setName("");
      setSlug("");
      setIsSlugManual(false);
      setLogoUrl("");
      setWebsite("");
      setDescription("");
      setIsFeatured(false);
      setStatus("active");
      setShowUrlInput(false);
    }
  }, [editingBrand, isOpen]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  // Handle file drop / upload
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (SVG, PNG, JPG, or WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setLogoUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        slug: slug.trim() || generateSlug(name),
        logoUrl: logoUrl?.trim() || undefined,
        website: website.trim() || undefined,
        description: description.trim() || undefined,
        isFeatured,
        status,
      },
      editingBrand?.id
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-xl z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {editingBrand ? "Edit brand" : "Add brand"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {editingBrand
                ? "Update brand profile, storefront features, and website links"
                : "Create a new brand or manufacturer to assign products to"}
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
          {/* Brand Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Brand Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Nike, Apple, Patagonia"
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
              <span className="text-neutral-400 font-mono">/brands/</span>
              <input
                value={slug}
                onChange={handleSlugChange}
                placeholder="brand-slug"
                required
                className="h-9 w-full bg-transparent pl-1 font-mono text-xs text-neutral-800 outline-none"
              />
            </div>
          </div>

          {/* Brand Logo Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-800">
                Brand Logo
              </label>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 underline"
              >
                {showUrlInput ? "Use file uploader" : "Enter image URL"}
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {showUrlInput ? (
              <Input
                value={logoUrl || ""}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.svg"
                className="h-9 text-xs"
              />
            ) : logoUrl ? (
              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50/60 p-3">
                <div className="h-12 w-12 shrink-0 rounded-md border border-neutral-200 bg-white p-1 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Brand logo preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-800 truncate">
                    Logo loaded
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    SVG or PNG preview active
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoUrl("")}
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-200 hover:text-rose-600 transition-colors"
                    title="Remove logo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed py-6 px-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-300 hover:border-neutral-400 bg-neutral-50/40"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <UploadCloud className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-700">
                    <span className="text-neutral-900 underline font-semibold">
                      Click to upload
                    </span>{" "}
                    or drag & drop logo
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    SVG, PNG, JPG or WebP (max 2MB, 1:1 ratio recommended)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Website URL
            </label>
            <div className="flex items-center rounded-md border border-neutral-300 bg-white px-2.5 text-xs focus-within:border-neutral-900">
              <Globe className="h-3.5 w-3.5 text-neutral-400 mr-2 shrink-0" />
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://brandwebsite.com"
                className="h-9 w-full bg-transparent text-xs text-neutral-800 outline-none"
              />
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
              placeholder="Provide an overview of the brand's story, products, or customer guarantee..."
              rows={2}
              className="resize-none text-xs"
            />
          </div>

          {/* Toggles: Featured and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Featured Brand Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  Featured brand
                </span>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Highlight on storefront
                </p>
              </div>
              <Switch
                checked={isFeatured}
                onCheckedChange={setIsFeatured}
                size="sm"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
              <div>
                <span className="block text-xs font-semibold text-neutral-800">
                  Status
                </span>
                <p className="text-[11px] text-neutral-500 capitalize mt-0.5">
                  {status}
                </p>
              </div>
              <Switch
                checked={status === "active"}
                onCheckedChange={(checked) =>
                  setStatus(checked ? "active" : "inactive")
                }
                size="sm"
              />
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
              {editingBrand ? "Save changes" : "Add brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
