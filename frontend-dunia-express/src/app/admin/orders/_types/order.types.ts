export type PaymentStatus = "paid" | "pending" | "refunded" | "authorized";
export type FulfillmentStatus = "fulfilled" | "unfulfilled" | "partial" | "restocked";
export type OrderStatus = "open" | "closed" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
  };
  channel: string;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  itemsCount: number;
  deliveryMethod: string;
  tags?: string[];
}
