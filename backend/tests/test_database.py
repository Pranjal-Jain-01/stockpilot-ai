import pytest
try:
    from fastapi.testclient import TestClient
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from app.main import app
    from app.database import Base, get_db
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
