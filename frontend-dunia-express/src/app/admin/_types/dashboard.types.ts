export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  change: number; // percentage change, e.g. 14.2
  periodLabel: string; // e.g. "vs last month"
  iconName: "revenue" | "orders" | "aov" | "sessions";
}

export interface OrderStatusBreakdown {
  delivered: number;
  inProcess: number;
  cancelled: number;
  total: number;
}

export interface GrowthDataPoint {
  label: string; // e.g. "Jan", "Feb" or "Mon", "Tue"
  onlineStore: number;
  posStore: number;
  total: number;
}

export interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: "fulfilled" | "pending" | "cancelled";
  itemsCount: number;
}

export interface TopProduct {
  id: string;
  title: string;
  category: string;
  swatch: string;
  unitsSold: number;
  revenue: number;
  growth: number;
}

export interface LowStockProduct {
  id: string;
  title: string;
  sku: string;
  variant: string;
  swatch: string;
  currentStock: number;
  minThreshold: number;
  reorderQuantity: number;
}

export interface DashboardData {
  metrics: KpiMetric[];
  orderStatus: OrderStatusBreakdown;
  growthMonthly: GrowthDataPoint[];
  growthWeekly: GrowthDataPoint[];
  recentOrders: DashboardOrder[];
  topProducts: TopProduct[];
  lowStockProducts: LowStockProduct[];
}
