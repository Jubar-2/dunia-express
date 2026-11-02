"use client";

import * as React from "react";
import { AdminFooterLink } from "@/components/common";
import {
  DashboardHeader,
  DashboardMetrics,
  GrowthStackedBar,
  OrderStatsDoughnut,
  RecentOrdersTable,
  TopProductsCard,
  LowStockAlertCard,
} from "./_components";
import { MOCK_DASHBOARD_DATA } from "./_data/mock-dashboard";

export default function AdminDashboardPage() {
  const [data, setData] = React.useState(MOCK_DASHBOARD_DATA);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData({ ...MOCK_DASHBOARD_DATA });
      setIsRefreshing(false);
    }, 600);
  }, []);

  const handleExport = React.useCallback(() => {
    alert("Exporting dashboard report for last 30 days...");
  }, []);

  return (
    <div className="w-full px-8 py-6 text-sm text-neutral-900">
      {/* Dashboard Top Header */}
      <DashboardHeader
        onRefresh={handleRefresh}
        onExport={handleExport}
        isRefreshing={isRefreshing}
        periodLabel="Last 30 days"
      />

      {/* 4 KPI Summary Metric Cards */}
      <DashboardMetrics metrics={data.metrics} />

      {/* Charts Grid: Stacked Bar Chart & Doughnut Chart */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <GrowthStackedBar
            monthlyData={data.growthMonthly}
            weeklyData={data.growthWeekly}
          />
        </div>
        <div className="lg:col-span-4">
          <OrderStatsDoughnut data={data.orderStatus} />
        </div>
      </div>

      {/* Operations Grid: Recent Orders Table & Best-Selling Products */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <RecentOrdersTable orders={data.recentOrders} />
        </div>
        <div className="lg:col-span-5">
          <TopProductsCard products={data.topProducts} />
        </div>
      </div>

      {/* Inventory Health: Low Stock Products Alert */}
      <div className="mb-6">
        <LowStockAlertCard products={data.lowStockProducts} />
      </div>

      {/* Footer Link */}
      <AdminFooterLink
        href="#"
        label="Learn more about dashboard analytics and store reporting"
      />
    </div>
  );
}
