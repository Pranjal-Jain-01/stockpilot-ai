from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
import random
from datetime import datetime, timedelta
# Create tables if they don't exist
models.Base.metadata.create_all(engine)

def seed_database():
    db = SessionLocal()
    try:
        # Clear existing data (in reverse order of foreign keys)
        db.query(models.ActionHistory).delete()
        db.query(models.Recommendation).delete()
        db.query(models.PurchaseOrderItem).delete()
        db.query(models.PurchaseOrder).delete()
        db.query(models.Supplier).delete()
        db.query(models.InventoryMovement).delete()
        db.query(models.Inventory).delete()
        db.query(models.Product).delete()
        db.query(models.Store).delete()
        db.commit()

        # Create stores
        stores_data = [
            {"code": "ST001", "name": "Downtown Store", "address": "123 Main St", "city": "New York", "state": "NY", "zip_code": "10001"},
            {"code": "ST002", "name": "Uptown Store", "address": "456 Broadway", "city": "New York", "state": "NY", "zip_code": "10002"},
            {"code": "ST003", "name": "Suburban Store", "address": "789 Oak Ave", "city": "Los Angeles", "state": "CA", "zip_code": "90001"},
            {"code": "ST004", "name": "Westside Store", "address": "321 Pine Rd", "city": "Los Angeles", "state": "CA", "zip_code": "90002"},
        ]
        stores = []
        for store_data in stores_data:
            store = models.Store(**store_data)
            db.add(store)
            db.flush()
            stores.append(store)

        # Create suppliers
        suppliers_data = [
            {"name": "Global Electronics", "contact_name": "John Doe", "email": "john@globalelectronics.com", "phone": "555-1000", "lead_time_days": 7},
            {"name": "Fashion Forward Inc", "contact_name": "Jane Smith", "email": "jane@fashionforward.com", "phone": "555-2000", "lead_time_days": 5},
            {"name": "Fresh Foods Co", "contact_name": "Bob Johnson", "email": "bob@freshfoods.com", "phone": "555-3000", "lead_time_days": 2},
            {"name": "Office Supplies Unlimited", "contact_name": "Alice Brown", "email": "alice@officesupplies.com", "phone": "555-4000", "lead_time_days": 10},
        ]
        suppliers = []
        for sup_data in suppliers_data:
            supplier = models.Supplier(**sup_data)
            db.add(supplier)
            db.flush()
            suppliers.append(supplier)

        # Create products
        products_data = [
            # Electronics
            {"sku": "ELC001", "name": "Smartphone X", "category": "electronics", "description": "Latest smartphone"},
            {"sku": "ELC002", "name": "Laptop Pro", "category": "electronics", "description": "High-performance laptop"},
            {"sku": "ELC003", "name": "Tablet Mini", "category": "electronics", "description": "Compact tablet"},
            # Clothing
            {"sku": "CLT001", "name": "Cotton T-Shirt", "category": "clothing", "description": "100% cotton t-shirt"},
            {"sku": "CLT002", "name": "Denim Jeans", "category": "clothing", "description": "Classic denim jeans"},
            {"sku": "CLT003", "name": "Winter Jacket", "category": "clothing", "description": "Insulated winter jacket"},
            # Grocery
            {"sku": "GRY001", "name": "Organic Apples", "category": "grocery", "description": "Fresh organic apples"},
            {"sku": "GRY002", "name": "Whole Grain Bread", "category": "grocery", "description": "Whole grain loaf"},
            {"sku": "GRY003", "name": "Milk Gallon", "category": "grocery", "description": "1 gallon milk"},
            # Office
            {"sku": "OFF001", "name": "Laser Printer", "category": "office", "description": "Monochrome laser printer"},
            {"sku": "OFF002", "name": "Ergonomic Chair", "category": "office", "description": "Adjustable ergonomic chair"},
            {"sku": "OFF003", "name": "Desk Lamp", "category": "office", "description": "LED desk lamp"},
        ]
        products = []
        for prod_data in products_data:
            product = models.Product(**prod_data)
            db.add(product)
            db.flush()
            products.append(product)

        # Create inventory for each product-store combination with varying quantities
        random.seed(42)  # for reproducibility
        for store in stores:
            for product in products:
                # Determine stock level based on some logic to create low stock, excess, etc.
                # We'll assign random quantities but bias certain combinations.
                # For simplicity, we'll assign:
                # - Low stock: quantity < reorder_point (set reorder_point to 10)
                # - Excess stock: quantity > max_stock (set max_stock to 100)
                # - Slow-moving: we'll later simulate via low movement (not in inventory directly)
                # We'll set reorder_point and max_stock per product category maybe.
                # Let's set reorder_point = 10, max_stock = 100 for all for simplicity.
                quantity = random.randint(0, 150)
                inventory = models.Inventory(
                    product_id=product.id,
                    store_id=store.id,
                    quantity=quantity,
                    reserved_quantity=random.randint(0, quantity),
                    reorder_point=10,
                    max_stock=100,
                )
                db.add(inventory)
                db.flush()

                # Create some inventory movements to simulate recent activity
                # For each inventory, create a few random movements in the past 30 days
                for _ in range(random.randint(0, 5)):
                    days_ago = random.randint(0, 30)
                    movement_type = random.choice(list(models.InventoryMovementType))
                    # Determine quantity change: for purchase and transfer_in positive, else negative
                    if movement_type in (models.InventoryMovementType.PURCHASE, models.InventoryMovementType.TRANSFER_IN):
                        quantity_change = random.randint(1, 20)
                    else:
                        quantity_change = -random.randint(1, 20)
                    movement = models.InventoryMovement(
                        inventory_id=inventory.id,
                        product_id=product.id,
                        store_id=store.id,
                        movement_type=movement_type,
                        quantity_change=quantity_change,
                        reference_number=f"REF{random.randint(1000,9999)}",
                        notes="Seed data movement",
                    )
                    db.add(movement)

        # Create some purchase orders (some overdue)
        for store in stores:
            for supplier in suppliers:
                if random.random() < 0.3:  # 30% chance of having a PO
                    # Decide if overdue: expected_delivery_date in the past
                    order_date = datetime.now() - timedelta(days=random.randint(5, 30))
                    expected_delivery = order_date + timedelta(days=supplier.lead_time_days)
                    overdue = expected_delivery < datetime.now()
                    # If we want overdue POs, we can force some to be overdue
                    # Let's make 20% of POs overdue regardless
                    if random.random() < 0.2:
                        overdue = True
                        expected_delivery = datetime.now() - timedelta(days=random.randint(1, 10))
                    po = models.PurchaseOrder(
                        po_number=f"PO{store.code}{supplier.id}{random.randint(100,999)}",
                        supplier_id=supplier.id,
                        store_id=store.id,
                        status=models.PurchaseOrderStatus.OPEN,
                        order_date=order_date,
                        expected_delivery_date=expected_delivery,
                        total_amount=0.0,  # will calculate from items
                    )
                    db.add(po)
                    db.flush()

                    # Add PO items
                    total_amount = 0.0
                    # Select 1-3 random products for this PO
                    selected_products = random.sample(products, k=random.randint(1, 3))
                    for product in selected_products:
                        # Find inventory for this product-store
                        inventory = db.query(models.Inventory).filter_by(product_id=product.id, store_id=store.id).first()
                        if inventory:
                            quantity = random.randint(5, 50)
                            unit_price = round(random.uniform(10.0, 100.0), 2)
                            total_price = quantity * unit_price
                            po_item = models.PurchaseOrderItem(
                                purchase_order_id=po.id,
                                product_id=product.id,
                                inventory_id=inventory.id,
                                quantity=quantity,
                                unit_price=unit_price,
                                total_price=total_price,
                            )
                            db.add(po_item)
                            total_amount += total_price
                    po.total_amount = round(total_amount, 2)
                    if overdue:
                        po.status = models.PurchaseOrderStatus.OPEN  # still open but overdue

        # Create some recommendations based on inventory levels
        for store in stores:
            for product in products:
                inventory = db.query(models.Inventory).filter_by(product_id=product.id, store_id=store.id).first()
                if inventory:
                    if inventory.quantity < inventory.reorder_point:
                        # Recommend purchase
                        rec = models.Recommendation(
                            product_id=product.id,
                            store_id=store.id,
                            recommendation_type=models.RecommendationType.PURCHASE,
                            quantity=inventory.reorder_point - inventory.quantity + 10,  # suggest ordering up to max
                            estimated_cost=(inventory.reorder_point - inventory.quantity + 10) * 25.0,  # dummy cost
                            priority=1,
                            notes="Low stock detected",
                        )
                        db.add(rec)
                    elif inventory.quantity > inventory.max_stock * 0.8:  # excess
                        # Recommend transfer to another store with low stock
                        # Find another store with low stock for same product
                        other_stores = [s for s in stores if s.id != store.id]
                        random.shuffle(other_stores)
                        target_store = None
                        for s in other_stores:
                            inv = db.query(models.Inventory).filter_by(product_id=product.id, store_id=s.id).first()
                            if inv and inv.quantity < inv.reorder_point:
                                target_store = s
                                break
                        if target_store:
                            transfer_qty = min(inventory.quantity - inventory.reorder_point, inv.reorder_point - inv.quantity)
                            if transfer_qty > 0:
                                rec = models.Recommendation(
                                    product_id=product.id,
                                    store_id=store.id,
                                    recommendation_type=models.RecommendationType.TRANSFER,
                                    quantity=transfer_qty,
                                    source_store_id=target_store.id,  # Wait: recommendation is for store (the destination?) Actually, recommendation is for the store that has excess? Let's think.
                                    # The spec: recommendation for a store? We'll store the store that has the recommendation (the store needing action).
                                    # If store has excess, we recommend transferring out to another store that needs stock.
                                    # So store_id is the store with excess, source_store_id is the store that needs stock (destination).
                                    # But we set source_store_id as the store that needs stock? Actually, transfer from source to destination.
                                    # We'll set store_id as the store with excess (source) and source_store_id as the destination? Let's rename fields: we have source_store_id for transfers, meaning the store providing the stock.
                                    # So for a transfer recommendation, store_id is the store that has excess (source) and source_store_id is the store that needs stock (destination).
                                    # However, we already have store_id as the store with excess (since we are iterating store). We'll set source_store_id to the destination store.
                                    # So we need to swap: store_id = excess store, source_store_id = destination store.
                                    # We'll set source_store_id to target_store.id (destination).
                                    # But we already set store_id to current store (excess). Good.
                                    estimated_cost=transfer_qty * 5.0,  # transfer cost
                                    priority=2,
                                    notes=f"Excess stock at {store.name}, transfer to {target_store.name}",
                                )
                                db.add(rec)
                        else:
                            # No store needs stock, maybe recommend purchase? but excess suggests overstock, maybe no action or discount.
                            pass

        db.commit()
        print("Database seeded successfully.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
