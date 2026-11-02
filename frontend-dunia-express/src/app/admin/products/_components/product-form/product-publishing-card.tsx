import * as React from "react";
import { AdminCard } from "@/components/common/admin-card";
import { Share2, Calendar, Check } from "lucide-react";

export interface ProductPublishingCardProps {
  channels?: string[];
}

export function ProductPublishingCard({
  channels = ["Online Store", "Point of Sale"],
}: ProductPublishingCardProps) {
  return (
    <AdminCard
      title="Publishing"
      headerAction={<Share2 className="h-4 w-4 text-neutral-400" />}
    >
      <div className="space-y-2.5">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Sales channels
        </div>

        {channels.map((ch, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
            <span className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-2.5 w-2.5" />
              </span>
              <span className="font-medium">{ch}</span>
            </span>
            <span className="text-neutral-400">Included</span>
          </div>
        ))}

        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
          <button
            type="button"
            className="flex items-center gap-1.5 text-blue-600 hover:underline font-medium"
          >
            <Calendar className="h-3.5 w-3.5" />
            Schedule availability
          </button>
        </div>
      </div>
    </AdminCard>
  );
}
