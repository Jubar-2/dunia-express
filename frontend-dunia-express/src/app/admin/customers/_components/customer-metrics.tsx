"use client";

import * as React from "react";
import { Users, Repeat, CreditCard, Mail, TrendingUp, TrendingDown } from "lucide-react";
import type { CustomerMetricsData } from "../_types/customer.types";

export interface CustomerMetricsProps {
  metrics: CustomerMetricsData;
}

export function CustomerMetrics({ metrics }: CustomerMetricsProps) {
  const cards = [
    {
      id: "total-customers",
      title: "Total Customers",
      value: metrics.totalCustomers.toLocaleString(),
      change: metrics.totalCustomersChange,
      periodLabel: "vs last month",
      icon: Users,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "returning-rate",
      title: "Returning Customer Rate",
      value: `${metrics.returningRate}%`,
      change: metrics.returningRateChange,
      periodLabel: "vs last month",
      icon: Repeat,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      id: "aov",
      title: "Average Order Value",
      value: `$${metrics.averageOrderValue.toFixed(2)}`,
      change: metrics.aovChange,
      periodLabel: "vs last month",
      icon: CreditCard,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      id: "subscribers",
      title: "Email Subscribers",
      value: metrics.emailSubscribers.toLocaleString(),
      change: metrics.emailSubscribersChange,
      periodLabel: "vs last month",
      icon: Mail,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const isPositive = card.change >= 0;
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4.5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">
                {card.title}
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bgColor} ${card.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Metric Value */}
            <div className="mt-3">
              <div className="text-[24px] font-bold tracking-tight text-neutral-900 leading-tight">
                {card.value}
              </div>
            </div>

            {/* Bottom row: Trend badge & period */}
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? `+${card.change}%` : `${card.change}%`}
              </span>
              <span className="text-[11px] text-neutral-400">
                {card.periodLabel}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
