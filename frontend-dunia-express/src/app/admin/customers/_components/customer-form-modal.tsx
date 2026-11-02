"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Customer, CustomerFormData } from "../_types/customer.types";

export interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CustomerFormData, editingId?: string) => void;
  editingCustomer?: Customer | null;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  onSave,
  editingCustomer,
}: CustomerFormModalProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [country, setCountry] = React.useState("United States");
  const [isSubscribed, setIsSubscribed] = React.useState(true);
  const [segment, setSegment] = React.useState<"new" | "returning" | "abandoned">("new");
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email);
      setPhone(editingCustomer.phone);
      setCity(editingCustomer.location.city);
      setCountry(editingCustomer.location.country);
      setIsSubscribed(editingCustomer.marketingStatus === "subscribed");
      setSegment(editingCustomer.segment);
      setNote(editingCustomer.note || "");
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setCountry("United States");
      setIsSubscribed(true);
      setSegment("new");
      setNote("");
    }
  }, [editingCustomer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSave(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim() || "Unknown",
        country: country.trim() || "United States",
        marketingStatus: isSubscribed ? "subscribed" : "unsubscribed",
        segment,
        note: note.trim(),
      },
      editingCustomer?.id
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
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-xl z-10 max-h-[90vh] overflow-y-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {editingCustomer ? "Edit customer" : "Add customer"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {editingCustomer
                ? "Update customer contact, location, and subscription status"
                : "Create a new customer profile and manage communication preferences"}
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
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              required
              className="h-9 text-xs"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                required
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Phone Number
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* City & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                City
              </label>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. San Francisco"
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Country
              </label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States"
                className="h-9 text-xs"
              />
            </div>
          </div>

          {/* Segment selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Customer Segment
            </label>
            <select
              value={segment}
              onChange={(e) =>
                setSegment(e.target.value as "new" | "returning" | "abandoned")
              }
              className="h-9 w-full rounded-md border border-neutral-300 bg-white px-2.5 text-xs text-neutral-800 outline-none focus:border-neutral-900"
            >
              <option value="new">New Customer</option>
              <option value="returning">Returning Customer</option>
              <option value="abandoned">Abandoned Checkout</option>
            </select>
          </div>

          {/* Marketing Subscription Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/50 p-3">
            <div>
              <div className="font-semibold text-neutral-900 text-xs">
                Email Marketing Subscription
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Customer consented to receive commercial email campaigns
              </div>
            </div>
            <Switch
              checked={isSubscribed}
              onCheckedChange={setIsSubscribed}
              size="sm"
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 mb-1">
              Staff Notes (Optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VIP tier, preferences, special shipping instructions..."
              rows={2}
              className="resize-none text-xs"
            />
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
              {editingCustomer ? "Save changes" : "Create customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
