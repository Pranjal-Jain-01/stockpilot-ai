import sys
sys.path.insert(0, '/Users/pranjaljain/stockpilot-ai/backend')
import pytest
try:
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.main import app
    from app.database import Base
    from app.routers.inventory import get_db
    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False

if HAS_DEPS:
    # Create an in-memory SQLite database for testing
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    client = TestClient(app)


    @pytest.fixture(scope="function")
    def db_session():
        Base.metadata.create_all(bind=engine)
        yield
        Base.metadata.drop_all(bind=engine)


    def test_health_endpoint(db_session):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


    def test_inventory_endpoint_empty(db_session):
        response = client.get("/inventory")
        assert response.status_code == 200
        assert response.json() == []  # no inventory yet


    def test_inventory_endpoint_with_data(db_session):
        # Add a product and store and inventory
        from app import models
        db = TestingSessionLocal()
        try:
            product = models.Product(sku="TEST001", name="Test Product", category="electronics")
            store = models.Store(code="TS001", name="Test Store")
            db.add_all([product, store])
            db.commit()
            db.refresh(product)
            db.refresh(store)
            inventory = models.Inventory(product_id=product.id, store_id=store.id, quantity=10)
            db.add(inventory)
            db.commit()
        finally:
            db.close()

        response = client.get("/inventory")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["quantity"] == 10
        assert data[0]["product_id"] == product.id
        assert data[0]["store_id"] == store.id

    def test_approve_recommendation(db_session):
        # Add a product, store, inventory, and recommendation
        from app import models
        db = TestingSessionLocal()
        try:
            product = models.Product(sku="TEST001", name="Test Product", category="electronics")
            store = models.Store(code="TS001", name="Test Store")
            db.add_all([product, store])
            db.commit()
            db.refresh(product)
            db.refresh(store)

            # Create inventory item
            inventory = models.Inventory(product_id=product.id, store_id=store.id, quantity=10)
            db.add(inventory)
            db.commit()
            db.refresh(inventory)

            # Create recommendation
            recommendation = models.Recommendation(
                product_id=product.id,
                store_id=store.id,
                recommendation_type=models.RecommendationType.TRANSFER,
                quantity=5,
                estimated_cost=25.0,
                notes="Test recommendation for approval"
            )
            db.add(recommendation)
            db.commit()
            db.refresh(recommendation)
        finally:
            db.close()

        # Test approving the recommendation
        response = client.post(
            f"/recommendations/{recommendation.id}/approve",
            json={
                "action_type": "approved",
                "performed_by": "Test User",
                "notes": "Test approval"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["action_type"] == "approved_transfer"
        assert data["performed_by"] == "Test User"
        assert data["notes"] == "Test approval"
        assert "id" in data
        assert "created_at" in data

        # Verify that we can't act on the same recommendation again
        response = client.post(
            f"/recommendations/{recommendation.id}/approve",
            json={
                "action_type": "approved",
                "performed_by": "Test User 2",
                "notes": "Second approval attempt"
            }
        )
        assert response.status_code == 400  # Should fail as already acted upon

    def test_reject_recommendation(db_session):
        # Add a product, store, inventory, and recommendation
        from app import models
        db = TestingSessionLocal()
        try:
            product = models.Product(sku="TEST002", name="Test Product 2", category="grocery")
            store = models.Store(code="TS002", name="Test Store 2")
            db.add_all([product, store])
            db.commit()
            db.refresh(product)
            db.refresh(store)

            # Create inventory item
            inventory = models.Inventory(product_id=product.id, store_id=store.id, quantity=5)
            db.add(inventory)
            db.commit()
            db.refresh(inventory)

            # Create recommendation
            recommendation = models.Recommendation(
                product_id=product.id,
                store_id=store.id,
                recommendation_type=models.RecommendationType.PURCHASE,
                quantity=10,
                estimated_cost=50.0,
                notes="Test recommendation for rejection"
            )
            db.add(recommendation)
            db.commit()
            db.refresh(recommendation)
        finally:
            db.close()

        # Test rejecting the recommendation
        response = client.post(
            f"/recommendations/{recommendation.id}/reject",
            json={
                "action_type": "rejected",
                "performed_by": "Test User",
                "notes": "Test rejection"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["action_type"] == "rejected_purchase"
        assert data["performed_by"] == "Test User"
        assert data["notes"] == "Test rejection"
        assert "id" in data
        assert "created_at" in data

        # Verify that we can't act on the same recommendation again
        response = client.post(
            f"/recommendations/{recommendation.id}/reject",
            json={
                "action_type": "rejected",
                "performed_by": "Test User 2",
                "notes": "Second rejection attempt"
            }
        )
        assert response.status_code == 400  # Should fail as already acted upon
else:
    # Define dummy tests that will be skipped
    @pytest.mark.skip(reason="Dependencies not installed")
    def test_health_endpoint():
        pass

    @pytest.mark.skip(reason="Dependencies not installed")
    def test_inventory_endpoint_empty():
        pass

    @pytest.mark.skip(reason="Dependencies not installed")
    def test_inventory_endpoint_with_data():
        pass

    @pytest.mark.skip(reason="Dependencies not installed")
    def test_approve_recommendation():
        pass

    @pytest.mark.skip(reason="Dependencies not installed")
    def test_reject_recommendation():
        pass
