from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

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


@router.get("/recommendations", response_model=List[schemas.Recommendation])
def get_recommendations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Get recommendations with joined product, store, and inventory data
    recommendations = db.query(models.Recommendation).options(
        joinedload(models.Recommendation.product),
        joinedload(models.Recommendation.store),
        joinedload(models.Recommendation.product).joinedload(models.Product.inventory_items).joinedload(models.Inventory.store)
    ).offset(skip).limit(limit).all()

    # Convert to frontend format with string IDs
    result = []
    for rec in recommendations:
        # Find the inventory item that matches this recommendation's product and store
        inventory_item = None
        if rec.product and rec.product.inventory_items:
            for item in rec.product.inventory_items:
                if item.store_id == rec.store_id:
                    inventory_item = item
                    break

        # Convert evidence items (using notes as explanation for now)
        evidence = []
        if rec.notes:
            evidence.append({
                "label": "Explanation",
                "value": rec.notes
            })

        # Convert options (not stored in DB, so empty for now)
        options = []

        result.append(schemas.Recommendation(
            id=str(rec.id),  # Convert int to string to match frontend expectation
            inventoryId=str(inventory_item.id) if inventory_item else "0",  # Correct inventory item ID
            status="pending",  # Hardcoded for now
            preferredOptionId=None,  # Not stored in DB
            explanation=rec.notes or "No explanation available",
            evidence=evidence,
            options=options
        ))
    return result


@router.get("/history", response_model=List[schemas.DecisionRecord])
def get_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Get action history with joined recommendation, product, and store data
    history_records = db.query(models.ActionHistory).options(
        joinedload(models.ActionHistory.recommendation).joinedload(models.Recommendation.product),
        joinedload(models.ActionHistory.recommendation).joinedload(models.Recommendation.store)
    ).offset(skip).limit(limit).all()

    # Convert to frontend format
    result = []
    for record in history_records:
        # Get product and store info from the recommendation
        product_name = "Unknown"
        sku = "Unknown"
        store_name = "Unknown"

        if record.recommendation and record.recommendation.product:
            product_name = record.recommendation.product.name
            sku = record.recommendation.product.sku

        if record.recommendation and record.recommendation.store:
            store_name = record.recommendation.store.name

        # Determine decision from action_type (simplified mapping)
        decision = "approved" if "approved" in record.action_type.lower() else "rejected"

        result.append(schemas.DecisionRecord(
            id=str(record.id),
            productName=product_name,
            sku=sku,
            storeName=store_name,
            actionLabel=record.action_type.replace("_", " ").title(),
            decision=decision,
            decidedAt=record.created_at,
            actorLabel=record.performed_by,
            rationale=record.notes or "No rationale provided"
        ))
    return result


# Placeholder for risks endpoint - risks are synthetic fixtures in the mock data
# To properly implement this, either:
# 1. Create a Risk model in the database and populate it
# 2. Compute risks dynamically from inventory data (complex)
# 3. Return mock data from the endpoint (not ideal for production)
@router.get("/risks", response_model=List[schemas.RiskAlert])
def get_risks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    # Since there's no Risk model and risks are synthetic fixtures in the mock data,
    # we return an empty list. A proper implementation would require:
    # - Adding a Risk model to store synthetic risk data
    # - Or computing risks from inventory levels, demand, lead times, etc.
    return []


@router.post("/recommendations/{recommendation_id}/approve", response_model=schemas.ActionHistory)
def approve_recommendation(recommendation_id: int, approval: schemas.RecommendationApproval, db: Session = Depends(get_db)):
    # Check if recommendation exists
    recommendation = db.query(models.Recommendation).filter(models.Recommendation.id == recommendation_id).first()
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Check if recommendation is already acted upon (no existing action history for this recommendation)
    existing_action = db.query(models.ActionHistory).filter(models.ActionHistory.recommendation_id == recommendation_id).first()
    if existing_action:
        raise HTTPException(status_code=400, detail="Recommendation has already been acted upon")

    # Create action history record for approval
    action_type = f"approved_{recommendation.recommendation_type.value}"
    db_action = models.ActionHistory(
        recommendation_id=recommendation_id,
        action_type=action_type,
        performed_by=approval.performed_by,
        notes=approval.notes
    )
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action


@router.post("/recommendations/{recommendation_id}/reject", response_model=schemas.ActionHistory)
def reject_recommendation(recommendation_id: int, approval: schemas.RecommendationApproval, db: Session = Depends(get_db)):
    # Check if recommendation exists
    recommendation = db.query(models.Recommendation).filter(models.Recommendation.id == recommendation_id).first()
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    # Check if recommendation is already acted upon (no existing action history for this recommendation)
    existing_action = db.query(models.ActionHistory).filter(models.ActionHistory.recommendation_id == recommendation_id).first()
    if existing_action:
        raise HTTPException(status_code=400, detail="Recommendation has already been acted upon")

    # Create action history record for rejection
    action_type = f"rejected_{recommendation.recommendation_type.value}"
    db_action = models.ActionHistory(
        recommendation_id=recommendation_id,
        action_type=action_type,
        performed_by=approval.performed_by,
        notes=approval.notes
    )
    db.add(db_action)
    db.commit()
    db.refresh(db_action)
    return db_action

