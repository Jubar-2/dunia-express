export type DiscountType =
  | "amount-off-products"
  | "buy-x-get-y"
  | "amount-off-order"
  | "free-shipping";

export type DiscountMethod = "Code" | "Automatic";

export type DiscountStatus = "Active" | "Scheduled" | "Expired";

export interface Discount {
  id: string;
  title: string;
  code?: string;
  status: DiscountStatus;
  type: DiscountType;
  typeLabel: string;
  method: DiscountMethod;
  summary: string;
  usedCount: number;
  startDate?: string;
  endDate?: string;
}

export interface DiscountTypeOption {
  id: DiscountType;
  title: string;
  description: string;
  iconType: "tag" | "bogo" | "order" | "shipping";
}
