from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class ProductCategory(str, enum.Enum):
    ELECTRONICS = "electronics"
    CLOTHING = "clothing"
    GROCERY = "grocery"
    OFFICE = "office"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(Enum(ProductCategory), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # relationships
    inventory_items = relationship("Inventory", back_populates="product")
    inventory_movements = relationship("InventoryMovement", back_populates="product")
    purchase_order_items = relationship("PurchaseOrderItem", back_populates="product")


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    zip_code = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # relationships
    inventory_items = relationship("Inventory", back_populates="store")
    inventory_movements = relationship("InventoryMovement", back_populates="store")
    purchase_orders = relationship("PurchaseOrder", back_populates="store")


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    quantity = Column(Integer, default=0)
    reserved_quantity = Column(Integer, default=0)
    reorder_point = Column(Integer, default=0)
    max_stock = Column(Integer, default=0)
    last_updated = Column(DateTime(timezone=True), onupdate=func.now())

    # relationships
    product = relationship("Product", back_populates="inventory_items")
    store = relationship("Store", back_populates="inventory_items")
    inventory_movements = relationship("InventoryMovement", back_populates="inventory")
    purchase_order_items = relationship("PurchaseOrderItem", back_populates="inventory")


class InventoryMovementType(str, enum.Enum):
    PURCHASE = "purchase"
    SALE = "sale"
    TRANSFER_IN = "transfer_in"
    TRANSFER_OUT = "transfer_out"
    ADJUSTMENT = "adjustment"


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(Integer, primary_key=True, index=True)
    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    movement_type = Column(Enum(InventoryMovementType), nullable=False)
    quantity_change = Column(Integer, nullable=False)  # positive for in, negative for out
    reference_number = Column(String)  # e.g., PO number, transfer ID
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    inventory = relationship("Inventory", back_populates="inventory_movements")
    product = relationship("Product", back_populates="inventory_movements")
    store = relationship("Store", back_populates="inventory_movements")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_name = Column(String)
    email = Column(String)
    phone = Column(String)
    lead_time_days = Column(Integer, default=7)  # average lead time
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # relationships
    purchase_orders = relationship("PurchaseOrder", back_populates="supplier")


class PurchaseOrderStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    APPROVED = "approved"
    RECEIVED = "received"
    CANCELLED = "cancelled"


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    po_number = Column(String, unique=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    status = Column(Enum(PurchaseOrderStatus), default=PurchaseOrderStatus.DRAFT)
    order_date = Column(DateTime(timezone=True), server_default=func.now())
    expected_delivery_date = Column(DateTime(timezone=True))
    total_amount = Column(Float, default=0.0)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # relationships
    supplier = relationship("Supplier", back_populates="purchase_orders")
    store = relationship("Store", back_populates="purchase_orders")
    items = relationship("PurchaseOrderItem", back_populates="purchase_order")


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    id = Column(Integer, primary_key=True, index=True)
    purchase_order_id = Column(Integer, ForeignKey("purchase_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    inventory_id = Column(Integer, ForeignKey("inventory.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    received_quantity = Column(Integer, default=0)

    # relationships
    purchase_order = relationship("PurchaseOrder", back_populates="items")
    product = relationship("Product", back_populates="purchase_order_items")
    inventory = relationship("Inventory", back_populates="purchase_order_items")


class RecommendationType(str, enum.Enum):
    TRANSFER = "transfer"
    PURCHASE = "purchase"
    NO_ACTION = "no_action"


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    recommendation_type = Column(Enum(RecommendationType), nullable=False)
    quantity = Column(Integer, nullable=False)
    source_store_id = Column(Integer, ForeignKey("stores.id"), nullable=True)  # for transfers
    estimated_cost = Column(Float, nullable=False)
    priority = Column(Integer, default=0)  # higher number = higher priority
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))

    # relationships
    product = relationship("Product")
    store = relationship("Store", foreign_keys=[store_id])
    source_store = relationship("Store", foreign_keys=[source_store_id])


class ActionHistory(Base):
    __tablename__ = "action_history"

    id = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id"), nullable=True)
    action_type = Column(String, nullable=False)  # e.g., "approved_transfer", "rejected_purchase"
    performed_by = Column(String, nullable=False)  # for demo, just a username
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # relationships
    recommendation = relationship("Recommendation")
