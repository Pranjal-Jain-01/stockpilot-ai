from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app import models
from app.schemas import InventoryItem

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/inventory", response_model=List[InventoryItem])
def get_inventory(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    inventory_items = db.query(models.Inventory).offset(skip).limit(limit).all()
    return inventory_items
