export type TransferStatus = "draft" | "pending" | "in_transit" | "completed" | "cancelled";

export interface Transfer {
  id: string;
  transferNumber: string;
  origin: string;
  destination: string;
  status: TransferStatus;
  itemsCount: number;
  expectedDate: string;
  trackingNumber?: string;
}
