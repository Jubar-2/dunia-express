export type GiftCardStatus = "active" | "disabled" | "expired";

export interface GiftCard {
  id: string;
  code: string;
  initialValue: number;
  balance: number;
  customer?: {
    name: string;
    email: string;
  };
  issueDate: string;
  expirationDate: string;
  status: GiftCardStatus;
}
