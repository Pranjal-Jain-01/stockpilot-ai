from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.database import SessionLocal
from app import models
from app import schemas

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/inventory", response_model=List[schemas.InventoryItem])
def get_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inventory_items = db.query(models.Inventory).offset(skip).limit(limit).all()
    return inventory_items


@router.get("/inventory/enriched", response_model=List[schemas.InventoryItemFrontend])
def get_inventory_enriched(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inventory_items = db.query(models.Inventory).options(joinedload(models.Inventory.product), joinedload(models.Inventory.store)).offset(skip).limit(limit).all()
    result = []
    for item in inventory_items:
        result.append(schemas.InventoryItemFrontend(
            id=item.id,
            sku=item.product.sku,
            productName=item.product.name,
            category=item.product.category,
            storeId=item.store.id,
            storeName=item.store.name,
            onHandQuantity=item.quantity,
            reservedQuantity=item.reserved_quantity,
            averageDailyDemand=None,
            coverageDays=None,
            riskStatus=None
        ))
    return result
