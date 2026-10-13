from pydantic import BaseModel
from typing import Optional
from datetime import datetime


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
