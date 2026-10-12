# StockPilot AI Backend

This is the backend for the StockPilot AI application, built with FastAPI and SQLAlchemy.

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```

2. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database (create tables):
   The database tables will be created automatically when the application starts.
   Alternatively, you can run the seed script to populate with sample data:
   ```bash
   python seed.py
   ```

## Run the application

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /inventory` - List inventory items (with pagination via `skip` and `limit` query parameters)

## Running Tests

```bash
pytest
```

## Seed Data

The `seed.py` script creates realistic synthetic data including:
- Multiple stores
- Products in various categories
- Inventory with low stock, excess stock, and slow-moving items
- Suppliers and purchase orders (including overdue orders)
- Recommendations based on inventory levels

## Database

The application uses SQLite by default (file `stockpilot.db` in the backend directory). For production, consider using a more robust database like PostgreSQL.

## Model Overview

- Product
- Store
- Inventory
- InventoryMovement
- Supplier
- PurchaseOrder
- PurchaseOrderItem
- Recommendation
- ActionHistory

Each model is defined in `app/models.py` with appropriate relationships.

