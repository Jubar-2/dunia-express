export interface InventoryItem {
  id: string;
  title: string;
  variant: string;
  swatch: string;
  sku: string;
  unavailable: number;
  committed: number;
  available: number;
  onHand: number;
  incoming: number;
}
