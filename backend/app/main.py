
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app import models
from app.routers import inventory

# 1. Create the FastAPI application first
app = FastAPI(title="StockPilot AI Backend")

# 2. Configure CORS before registering routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5175",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Initialize database tables
models.Base.metadata.create_all(bind=engine)

# 4. Register routers
app.include_router(inventory.router)


@app.get("/health")
def health():
    return {"status": "ok"}
