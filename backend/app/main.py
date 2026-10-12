from fastapi import FastAPI
from app.database import engine
from app import models
from app.routers import inventory

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="StockPilot AI Backend")

app.include_router(inventory.router)


@app.get("/health")
def health():
    return {"status": "ok"}
