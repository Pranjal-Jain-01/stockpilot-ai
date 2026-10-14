from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List


class ProductBase(BaseModel):
    sku: str
    name: str
    category: str
    description: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class StoreBase(BaseModel):
    code: str
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    is_active: bool = True


class StoreCreate(StoreBase):
    pass


class Store(StoreBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class InventoryItemBase(BaseModel):
    product_id: int
    store_id: int
    quantity: int = 0
    reserved_quantity: int = 0
    reorder_point: int = 0
    max_stock: int = 0


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItem(InventoryItemBase):
    id: int
    last_updated: Optional[datetime] = None

    class Config:
        orm_mode = True


# Additional schemas for other models can be added as needed

class InventoryItemFrontend(BaseModel):
    id: int
    sku: str
    productName: str
    category: str
    storeId: int
    storeName: str
    onHandQuantity: int
    reservedQuantity: int
    averageDailyDemand: Optional[float] = None
    coverageDays: Optional[float] = None
    riskStatus: Optional[str] = None

    class Config:
        orm_mode = True


class EvidenceItem(BaseModel):
    label: str
    value: Optional[str] = None


class RiskAlert(BaseModel):
    id: str
    inventoryId: str
    type: str  # RiskType: 'Stockout' | 'Excess stock' | 'Slow movement' | 'Supplier delay'
    severity: str  # Severity: 'high' | 'medium' | 'low'
    title: str
    description: str
    evidence: List[EvidenceItem]

    class Config:
        orm_mode = True


class ReplenishmentOption(BaseModel):
    id: str
    type: str  # 'transfer' | 'purchase'
    sourceLabel: str
    feasible: bool
    quantity: int
    arrivalLabel: Optional[str] = None
    estimatedTotalCost: Optional[float] = None
    currency: str
    costScope: str
    infeasibilityReason: Optional[str] = None

    class Config:
        orm_mode = True


class Recommendation(BaseModel):
    id: str
    inventoryId: str
    status: str  # 'pending'
    preferredOptionId: Optional[str] = None
    explanation: str
    evidence: List[EvidenceItem]
    options: List[ReplenishmentOption]

    class Config:
        orm_mode = True


class DecisionRecord(BaseModel):
    id: str
    productName: str
    sku: str
    storeName: str
    actionLabel: str
    decision: str  # 'approved' | 'rejected'
    decidedAt: datetime
    actorLabel: str
    rationale: str

    class Config:
        orm_mode = True


class RecommendationCreate(BaseModel):
    product_id: int
    store_id: int
    recommendation_type: str  # 'transfer' | 'purchase' | 'no_action'
    quantity: int
    source_store_id: Optional[int] = None  # for transfers
    estimated_cost: float
    priority: int = 0  # higher number = higher priority
    notes: Optional[str] = None


class RecommendationUpdate(BaseModel):
    recommendation_type: Optional[str] = None
    quantity: Optional[int] = None
    source_store_id: Optional[int] = None
    estimated_cost: Optional[float] = None
    priority: Optional[int] = None
    notes: Optional[str] = None
    expires_at: Optional[datetime] = None


class ActionHistoryBase(BaseModel):
    recommendation_id: Optional[int] = None
    action_type: str  # e.g., "approved_transfer", "rejected_purchase"
    performed_by: str  # for demo, just a username
    notes: Optional[str] = None


class ActionHistoryCreate(ActionHistoryBase):
    pass


class ActionHistory(ActionHistoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class RecommendationApproval(BaseModel):
    action_type: str  # "approved" or "rejected"
    performed_by: str  # for demo, just a username
    notes: Optional[str] = None