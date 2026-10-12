// Frontend view models for synthetic fixtures. These are NOT agreed API DTOs.
export type RiskStatus = 'healthy' | 'low' | 'critical' | 'excess' | 'unknown';
export type Severity = 'high' | 'medium' | 'low';
export type RiskType = 'Stockout' | 'Excess stock' | 'Slow movement' | 'Supplier delay';
export type DemoState = 'ready' | 'loading' | 'empty' | 'error';

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  storeId: string;
  storeName: string;
  onHandQuantity: number;
  reservedQuantity: number;
  averageDailyDemand: number | null;
  coverageDays: number | null;
  riskStatus: RiskStatus;
}

export interface EvidenceItem {
  label: string;
  value: string | null;
}
export interface RiskAlert {
  id: string;
  inventoryId: string;
  type: RiskType;
  severity: Severity;
  title: string;
  description: string;
  evidence: EvidenceItem[];
}

export interface ReplenishmentOption {
  id: string;
  type: 'transfer' | 'purchase';
  sourceLabel: string;
  feasible: boolean;
  quantity: number;
  arrivalLabel: string | null;
  estimatedTotalCost: number | null;
  currency: string;
  costScope: string;
  infeasibilityReason?: string;
}

export interface Recommendation {
  id: string;
  inventoryId: string;
  preferredOptionId: string | null;
  status: 'pending';
  explanation: string;
  options: ReplenishmentOption[];
  evidence: EvidenceItem[];
}

export interface DecisionRecord {
  id: string;
  productName: string;
  sku: string;
  storeName: string;
  actionLabel: string;
  decision: 'approved' | 'rejected';
  decidedAt: string;
  actorLabel: string;
  rationale: string;
}

export interface MockDataset {
  inventory: InventoryItem[];
  risks: RiskAlert[];
  recommendations: Recommendation[];
  history: DecisionRecord[];
  snapshotLabel: string;
}
