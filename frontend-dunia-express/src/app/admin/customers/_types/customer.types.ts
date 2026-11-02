export type MarketingStatus = "subscribed" | "unsubscribed" | "pending";

export type CustomerSegment = "new" | "returning" | "abandoned";

export interface CustomerLocation {
  city: string;
  country: string;
  flag?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: CustomerLocation;
  ordersCount: number;
  totalSpent: number;
  marketingStatus: MarketingStatus;
  lastOrderDate: string;
  segment: CustomerSegment;
  avatarColor?: string;
  note?: string;
}

export interface CustomerMetricsData {
  totalCustomers: number;
  totalCustomersChange: number;
  returningRate: number;
  returningRateChange: number;
  averageOrderValue: number;
  aovChange: number;
  emailSubscribers: number;
  emailSubscribersChange: number;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  marketingStatus: MarketingStatus;
  segment: CustomerSegment;
  note?: string;
}

export interface CustomerTableRowProps {
  customer: Customer;
  index: number;
  isChecked: boolean;
  onToggle: (index: number) => void;
  showColumn?: (key: string) => boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export interface CustomerTableProps {
  customers: Customer[];
  checked: boolean[];
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (index: number) => void;
  showColumn?: (key: string) => boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}
